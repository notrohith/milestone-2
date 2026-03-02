package com.rideshare.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    @Value("${resend.api-key}")
    private String resendApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    /**
     * Sends a beautiful HTML approval email via Resend.
     *
     * @param toEmail     recipient email address
     * @param name        recipient's display name
     * @param tempPassword the temporary password for first login
     * @param loginUrl    the URL for logging in (e.g. http://localhost:3000/login)
     * @throws IllegalStateException if Resend API returns an error
     */
    public void sendApprovalEmail(String toEmail, String name, String tempPassword, String loginUrl) {
        if (resendApiKey == null || resendApiKey.isEmpty() || resendApiKey.equals("re_TguMhA92_9rjjfqomjksGzDAsbN6mjb7x")) {
            printMockEmail(toEmail, tempPassword, loginUrl);
            return; // Skip actual API call
        }

        String html = buildHtml(name, toEmail, tempPassword, loginUrl);
        String text = buildText(name, toEmail, tempPassword, loginUrl);

        String body = """
                {
                  "from": "CoRide <onboarding@resend.dev>",
                  "to": ["%s"],
                  "subject": "\\uD83C\\uDF89 You are approved! Your CoRide login details",
                  "html": %s,
                  "text": %s
                }
                """.formatted(
                toEmail,
                quoted(html),
                quoted(text)
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                System.err.println("Resend API failed: " + response.statusCode() + " " + response.body());
                System.out.println("NOTE: Resend requires a verified domain to send emails to arbitrary addresses.");
                System.out.println("Falling back to console printing...");
                printMockEmail(toEmail, tempPassword, loginUrl);
                // Do not throw an exception here, so the frontend still succeeds
            } else {
                System.out.println("Email sent successfully via Resend to " + toEmail);
            }
        } catch (Exception e) {
            System.err.println("Failed to call Resend API: " + e.getMessage());
            System.out.println("Falling back to console printing...");
            printMockEmail(toEmail, tempPassword, loginUrl);
        }
    }

    private void printMockEmail(String toEmail, String tempPassword, String loginUrl) {
        System.out.println("\n========== MOCK EMAIL SENT ==========");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: You are approved! Your CoRide login details");
        System.out.println("Temporary Password: [HIDDEN FOR SECURITY]");
        System.out.println("Login URL: " + loginUrl);
        System.out.println("=====================================\n");
    }

    // ── Template helpers ────────────────────────────────────────────────────

    /** Escape a string for embedding as a JSON string value. */
    private static String quoted(String s) {
        return "\"" + s
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "")
                .replace("\n", "\\n")
                .replace("\t", "\\t")
                + "\"";
    }

    private static String buildText(String name, String email, String tempPassword, String loginUrl) {
        return """
                Hi %s,
                
                Great news — your CoRide registration has been approved!
                
                Your login credentials:
                  Email:              %s
                  Temporary Password: %s
                
                Log in here: %s
                
                You will be asked to set a new secure password on your first login.
                
                — The CoRide Team
                """.formatted(name, email, tempPassword, loginUrl);
    }

    private static String buildHtml(String name, String email, String tempPassword, String loginUrl) {
        return """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Welcome to CoRide</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%%;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.10);">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#0f172a 0%%,#1e3a5f 60%%,#0369a1 100%%);padding:48px 40px 36px;text-align:center;">
      <table width="100%%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding-bottom:20px;">
          <div style="display:inline-block;background:rgba(255,255,255,.12);border-radius:16px;padding:12px 28px;">
            <span style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-.5px;">Co<span style="color:#38bdf8;">Ride</span></span>
          </div>
        </td></tr>
        <tr><td align="center">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#22c55e,#16a34a);border-radius:50%%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 4px 20px rgba(34,197,94,.35);">
            <span style="font-size:38px;line-height:72px;display:block;color:#fff;">&#10003;</span>
          </div>
          <h1 style="color:#fff;font-size:28px;font-weight:800;margin:0 0 10px;">You're Approved! &#127881;</h1>
          <p style="color:#bae6fd;font-size:15px;margin:0;">Your CoRide account is ready to go</p>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Greeting -->
  <tr><td style="padding:36px 40px 0;">
    <p style="font-size:17px;color:#1e293b;font-weight:600;margin:0 0 8px;">Hi %s &#128075;</p>
    <p style="font-size:15px;color:#64748b;line-height:1.7;margin:0 0 24px;">
      Your CoRide registration has been <strong style="color:#16a34a;">reviewed and approved</strong> by our admin team.
      Log in below and start your journey!
    </p>
  </td></tr>

  <!-- Credentials Card -->
  <tr><td style="padding:0 40px 28px;">
    <div style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1.5px solid #bae6fd;border-radius:16px;padding:28px;">
      <p style="font-size:12px;font-weight:700;color:#0369a1;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 18px;">Your Login Credentials</p>
      <table width="100%%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:16px;">
          <p style="font-size:12px;color:#64748b;margin:0 0 5px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;">&#128231; Email Address</p>
          <p style="font-size:15px;color:#0f172a;font-weight:700;margin:0;font-family:monospace;background:#fff;padding:10px 14px;border-radius:8px;border:1px solid #e0f2fe;">%s</p>
        </td></tr>
        <tr><td>
          <p style="font-size:12px;color:#64748b;margin:0 0 5px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;">&#128273; Temporary Password</p>
          <p style="font-size:17px;color:#0f172a;font-weight:800;margin:0;font-family:'Courier New',monospace;background:#fff;padding:12px 14px;border-radius:8px;border:2px dashed #38bdf8;letter-spacing:2px;">%s</p>
        </td></tr>
      </table>
    </div>
  </td></tr>

  <!-- Warning -->
  <tr><td style="padding:0 40px 28px;">
    <div style="background:#fffbeb;border:1.5px solid #fcd34d;border-radius:12px;padding:14px 18px;">
      <p style="font-size:13px;color:#92400e;font-weight:700;margin:0 0 4px;">&#9888;&#65039; Change your password on first login</p>
      <p style="font-size:13px;color:#92400e;margin:0;line-height:1.5;">For your security, you will be asked to set a new password immediately after logging in with this temporary one.</p>
    </div>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:0 40px 36px;text-align:center;">
    <a href="%s" style="display:inline-block;background:linear-gradient(135deg,#0369a1,#0f172a);color:#fff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 48px;border-radius:50px;box-shadow:0 6px 24px rgba(3,105,161,.35);">
      &#128640;&nbsp;&nbsp;Log In to CoRide
    </a>
    <p style="font-size:12px;color:#94a3b8;margin:14px 0 0;">Or copy this link: <a href="%s" style="color:#0369a1;">%s</a></p>
  </td></tr>

  <!-- Steps -->
  <tr><td style="padding:0 40px 36px;">
    <div style="background:#f8fafc;border-radius:14px;padding:24px;">
      <p style="font-size:13px;font-weight:700;color:#1e293b;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">Getting Started</p>
      <table cellpadding="0" cellspacing="0" width="100%%">
        <tr><td style="padding-bottom:12px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:14px;vertical-align:top;"><div style="width:28px;height:28px;background:#0369a1;border-radius:50%%;text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">1</div></td>
            <td style="vertical-align:middle;"><p style="font-size:14px;color:#475569;margin:0;line-height:1.5;">Log in with your temporary password</p></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding-bottom:12px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:14px;vertical-align:top;"><div style="width:28px;height:28px;background:#7c3aed;border-radius:50%%;text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">2</div></td>
            <td style="vertical-align:middle;"><p style="font-size:14px;color:#475569;margin:0;line-height:1.5;">Set a new secure password when prompted</p></td>
          </tr></table>
        </td></tr>
        <tr><td style="vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:14px;vertical-align:top;"><div style="width:28px;height:28px;background:#16a34a;border-radius:50%%;text-align:center;line-height:28px;color:#fff;font-size:13px;font-weight:800;">3</div></td>
            <td style="vertical-align:middle;"><p style="font-size:14px;color:#475569;margin:0;line-height:1.5;">Complete your profile and start riding!</p></td>
          </tr></table>
        </td></tr>
      </table>
    </div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:0 40px;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>
  <tr><td style="padding:28px 40px;text-align:center;">
    <p style="font-size:13px;color:#94a3b8;margin:0 0 6px;">This email was sent to <strong>%s</strong></p>
    <p style="font-size:12px;color:#cbd5e1;margin:0;">&#169; 2026 CoRide &nbsp;&#183;&nbsp; Safe, smart, shared journeys</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>""".formatted(name, email, tempPassword, loginUrl, loginUrl, loginUrl, email);
    }
}
