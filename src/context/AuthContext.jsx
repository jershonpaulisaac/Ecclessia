import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check current session on mount
        const initAuth = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (session?.user) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (profileError) {
                        console.warn("Profile fetch error:", profileError.message);
                        setUser(session.user); // Fallback to basic user data
                    } else {
                        setUser({ ...session.user, ...profile });
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth initialization failed:", err.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            try {
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    setUser({ ...session.user, ...profile });
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth state change error:", err.message);
                setUser(session?.user || null);
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
