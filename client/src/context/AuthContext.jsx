import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseConfigError } from '../services/supabaseClient';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

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

        // Detect OAuth callback params so we keep the loading spinner visible
        // until Supabase's `detectSessionInUrl` (configured in supabaseClient.js)
        // finishes exchanging tokens and fires onAuthStateChange('SIGNED_IN').
        const hasAuthParams =
            typeof window !== 'undefined' &&
            (window.location.hash.includes('access_token=') ||
             window.location.search.includes('code=') ||
             window.location.hash.includes('error='));

        // Safety net: if auth bootstrap stalls, unblock the UI after 8s.
        const timeoutId = window.setTimeout(() => {
            if (!isMounted) return;
            if (!hasAuthParams) {
                setAuthError('Authentication is taking longer than expected.');
            }
            setLoading(false);
        }, 8000);

        // 1. Restore existing session (regular page loads, returning users).
        //    For OAuth callbacks, `detectSessionInUrl: true` handles token
        //    exchange automatically — we just need to call getSession() to
        //    trigger it, then onAuthStateChange fires SIGNED_IN.
        const bootstrap = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (!isMounted) return;
                setUser(session?.user ?? null);
                setAuthError(null);

                // Only clear loading here if there are NO auth params.
                // If there ARE auth params, wait for onAuthStateChange('SIGNED_IN')
                // to confirm the token exchange completed before unblocking.
                if (!hasAuthParams) {
                    setLoading(false);
                }
                window.clearTimeout(timeoutId);
            } catch (error) {
                console.error('Failed to restore auth session:', error);
                if (!isMounted) return;
                setUser(null);
                setAuthError(error?.message || 'Unable to verify your session right now.');
                setLoading(false);
                window.clearTimeout(timeoutId);
            }
        };

        bootstrap();

        // 2. Listen for auth state changes (login, logout, token refresh, OAuth callback).
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted) return;
            setUser(session?.user ?? null);
            setAuthError(null);
            setLoading(false); // Always unblock UI after any auth event

            if (event === 'SIGNED_IN' && session?.user) {
                // Clean OAuth hash / query params from the URL bar
                if (
                    typeof window !== 'undefined' &&
                    (window.location.hash.includes('access_token=') ||
                     window.location.search.includes('code='))
                ) {
                    window.history.replaceState(null, '', window.location.pathname);
                }
            }
        });

        subscription = data.subscription;

        return () => {
            isMounted = false;
            window.clearTimeout(timeoutId);
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
                    full_name: name,
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
