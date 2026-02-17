import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { syncUser } from "../api/rideApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const getSession = async () => {
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Session check timed out")), 1000));

            try {
                // Race between supabase check and 5s timeout
                const { data, error } = await Promise.race([
                    supabase.auth.getSession(),
                    timeoutPromise
                ]);

                if (error) throw error;
                if (data?.session?.user) {
                    setUser({ ...data.session.user, role: data.session.user.user_metadata?.role || "RIDER" });
                }
            } catch (error) {
                if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                    console.warn("Session check aborted (clean up):", error);
                } else {
                    console.error("Auth session error:", error);
                }
                // Optional: set global error state if needed
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const role = session.user.user_metadata?.role || "RIDER";
                setUser({ ...session.user, role });

                // Sync with backend on login
                try {
                    // Only sync if role is set (meaning profile is somewhat complete) or let the CompleteProfile page handle the first sync
                    if (role) {
                        await syncUser({
                            id: session.user.id,
                            email: session.user.email,
                            name: session.user.user_metadata?.name || session.user.email,
                            role: role,
                            phoneNumber: session.user.user_metadata?.phoneNumber,
                            profilePhotoUrl: session.user.user_metadata?.avatar_url
                        });
                    }
                } catch (e) {
                    console.error("Failed to sync user to backend", e);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        console.log("Initiating Google Sign In...");
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            console.error("Google Sign In Error:", error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            // Race Supabase signOut with a 1s timeout
            await Promise.race([
                supabase.auth.signOut(),
                new Promise(resolve => setTimeout(resolve, 1000))
            ]);
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            setUser(null); // Force local logout
            localStorage.clear(); // Clear any local storage artifacts
        }
    };

    const updateProfile = async (updates) => {
        const { error } = await supabase.auth.updateUser({
            data: updates
        });
        if (error) throw error;

        // Update local user state immediately
        setUser(prev => ({ ...prev, user_metadata: { ...prev.user_metadata, ...updates }, role: updates.role || prev.role }));
    };

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        return { data, error };
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, signInWithGoogle, updateProfile, signUp }}>
            {loading ? <div className="flex h-screen items-center justify-center">Loading RideWithMe...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
