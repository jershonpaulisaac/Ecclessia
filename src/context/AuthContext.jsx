import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check current session on mount
        const initAuth = async () => {
            // Safety timeout to prevent stuck loading state
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 5000);

            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (session?.user) {
                    // FAST PATH: Set basic user first
                    setUser(session.user);
                    setLoading(false);

                    // BACKGROUND: Fetch full profile
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (!profileError && profile) {
                        setUser(prev => ({ ...prev, ...profile }));
                    } else if (profileError) {
                        console.warn("Background profile fetch error:", profileError.message);
                    }
                } else {
                    setUser(null);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Auth initialization failed:", err.message);
                setUser(null);
                setLoading(false);
            } finally {
                clearTimeout(timeout);
            }
        };

        initAuth();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
                return;
            }

            if (session?.user) {
                // FAST PATH
                setUser(session.user);

                // BACKGROUND PATH
                try {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (profile) {
                        setUser(prev => ({ ...prev, ...profile }));
                    }
                } catch (err) {
                    // Ignore background fetch errors
                }
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
