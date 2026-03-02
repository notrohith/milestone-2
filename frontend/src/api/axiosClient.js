import axios from "axios";
import { supabase } from "../supabaseClient";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080", // Spring Boot
});

const isPublicEndpoint = (url = "", method = "GET") => {
    const normalizedPath = url.split("?")[0].replace(/\/$/, "");
    const httpMethod = method.toUpperCase();

    if (normalizedPath.startsWith("/api/auth/") || normalizedPath.startsWith("/api/files/")) {
        return true;
    }

    if (normalizedPath === "/api/rides/search" && httpMethod === "GET") {
        return true;
    }

    // Ride publishing is intentionally public and uses driverEmail in payload.
    if (normalizedPath === "/api/rides" && httpMethod === "POST") {
        return true;
    }

    if (normalizedPath.startsWith("/api/rides/") && httpMethod === "GET") {
        return true;
    }

    if (normalizedPath.startsWith("/api/vehicles") && httpMethod === "GET") {
        return true;
    }

    return false;
};

// This runs BEFORE every backend request
axiosClient.interceptors.request.use(
    async (config) => {
        if (isPublicEndpoint(config.url, config.method)) {
            return config;
        }

        try {
            const { data } = await supabase.auth.getSession();

            if (data?.session?.access_token) {
                config.headers.Authorization =
                    `Bearer ${data.session.access_token}`;
            }
        } catch (error) {
            console.warn("Session fetch failed in interceptor:", error);
            // Proceed without token if session check fails (e.g. AbortError)
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosClient;
