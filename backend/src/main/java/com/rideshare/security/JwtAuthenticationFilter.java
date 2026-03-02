package com.rideshare.security;

import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import com.rideshare.model.User;
import com.rideshare.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${supabase.jwt.secret}")
    private String jwtSecret;

    private final UserRepository userRepository;

    public JwtAuthenticationFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        return path.startsWith("/api/auth/")
            || path.startsWith("/api/files/")
            || path.equals("/api/rides/search")
            || (path.equals("/api/rides") && "POST".equalsIgnoreCase(method))
            || (path.startsWith("/api/rides/") && "GET".equalsIgnoreCase(method))
            || path.equals("/api/admin/reload-schema")
            || path.equals("/api/admin/send-approval-email");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                SignedJWT signedJWT = SignedJWT.parse(token);

                // Supabase JWT secret is Base64-encoded — decode before use as HMAC key
                byte[] secretBytes;
                try {
                    secretBytes = Base64.getDecoder().decode(jwtSecret);
                } catch (IllegalArgumentException e) {
                    secretBytes = jwtSecret.getBytes();
                }

                JWSVerifier verifier = new MACVerifier(secretBytes);

                if (signedJWT.verify(verifier)) {
                    String sub = signedJWT.getJWTClaimsSet().getSubject();
                    String email = (String) signedJWT.getJWTClaimsSet().getClaim("email");
                    UUID authUserId = UUID.fromString(sub);

                    // 1. Try lookup by Supabase Auth UUID first
                    Optional<User> userOpt = userRepository.findById(authUserId);

                    // 2. Fallback: lookup by email (user registered with a different random UUID)
                    //    Do NOT try to update the UUID — FK constraints would block it.
                    //    The found user entity has the correct role/status — that's all we need.
                    if (userOpt.isEmpty() && email != null) {
                        userOpt = userRepository.findFirstByEmail(email);
                        if (userOpt.isPresent()) {
                            System.out.println("Auth via email fallback for: " + email);
                        }
                    }

                    if (userOpt.isPresent()) {
                        User u = userOpt.get();
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                u, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + u.getRole().name())));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        System.out.println("JWT valid but no user found — sub=" + sub + " email=" + email);
                    }
                } else {
                    System.out.println("JWT signature verification failed.");
                }
            } catch (Exception e) {
                System.out.println("JWT processing error: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
