import axios from "axios";
import { supabase } from "../supabaseClient";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080", // Spring Boot
});

// This runs BEFORE every backend request
axiosClient.interceptors.request.use(
    async (config) => {
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
