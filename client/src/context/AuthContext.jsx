import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseConfigError } from '../services/supabaseClient';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();
const AUTH_BOOT_TIMEOUT_MS = 4000;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let subscription;

        if (!supabase) {
            setAuthError(supabaseConfigError);
            setLoading(false);
            return undefined;
        }

        // Keep the UI responsive even if auth bootstrap is slow.
        const getSession = async () => {
            const timeoutId = window.setTimeout(() => {
                if (!isMounted) return;
                setAuthError('Authentication is taking longer than expected. Showing the app without blocking.');
                setLoading(false);
            }, AUTH_BOOT_TIMEOUT_MS);

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    throw error;
                }

                if (!isMounted) return;
                setUser(session?.user ?? null);
                setAuthError(null);
            } catch (error) {
                console.error('Failed to restore auth session:', error);

                if (!isMounted) return;
                setUser(null);
                setAuthError(error?.message || 'Unable to verify your session right now.');
            } finally {
                window.clearTimeout(timeoutId);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        getSession();

        // 2. Listen for auth changes (Login, Logout, Auto-refresh)
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isMounted) return;
            setUser(session?.user ?? null);
            setAuthError(null);
            setLoading(false);
        });

        subscription = data.subscription;

        return () => {
            isMounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    const requireSupabase = () => {
        if (!supabase) {
            const error = new Error(supabaseConfigError || 'Authentication is unavailable right now.');
            toast.error(error.message);
            throw error;
        }

        return supabase;
    };

    const login = async (email, password) => {
        const client = requireSupabase();
        const { data, error } = await client.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);
            throw error;
        }

        toast.success("Welcome back!");
        return data.user;
    };

    const register = async (name, email, password) => {
        const client = requireSupabase();
        const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name, // This goes into user_metadata
                },
            },
        });

        if (error) {
            toast.error(error.message);
            throw error;
        }

        toast.success("Account created! Please check your email.");
        return data.user;
    };

    const logout = async () => {
        const client = requireSupabase();
        await client.auth.signOut();
        toast.success("Logged out successfully");
        setUser(null);
    };

    const loginWithGoogle = async () => {
        try {
            const client = requireSupabase();
            const { error } = await client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            });
            if (error) {
                toast.error(error.message);
                throw error;
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to login with Google");
        }
    };

    const value = {
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        loading,
        authError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
