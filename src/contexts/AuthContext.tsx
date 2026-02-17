
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'user';

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    loading: boolean;
    signIn: (email: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    signIn: async () => ({ error: null }),
    signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        if (!supabase) {
            setLoading(false);
            return;
        }

        // Safety fallback: force loading false after 3s to prevent eternal white screen
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Auth check timed out, forcing app load");
                setLoading(false);
            }
        }, 3000);

        // Check active sessions
        const getSession = async () => {
            try {
                if (!supabase) return;
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (mounted && session?.user) {
                    setUser(session.user);
                    // Wrap fetchRole in a way that doesn't block critical loading path forever
                    await fetchRole(session.user.id).catch(e => console.error("Role fetch failed", e));
                }
            } catch (error) {
                console.error("Auth session check failed", error);
                if (mounted) {
                    setUser(null);
                    setRole(null);
                }
            } finally {
                if (mounted) setLoading(false);
                clearTimeout(safetyTimeout);
            }
        };
        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;

            if (session?.user) {
                setUser(session.user);
                await fetchRole(session.user.id).catch(e => console.error("Role fetch failed on change", e));
            } else {
                setUser(null);
                setRole(null);
            }
            // Always stop loading when auth state changes/settles
            setLoading(false);
        });

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const fetchRole = async (userId: string) => {
        if (!supabase) return;
        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (data) {
            setRole(data.role as UserRole);
        } else {
            // Default to user if not found
            setRole('user');
        }
    };

    const signIn = async (email: string) => {
        if (!supabase) return { error: new Error("Supabase not initialized") };
        // Use Magic Link for simplicity
        const { error } = await supabase.auth.signInWithOtp({ email });
        return { error };
    };

    const signOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        // Explicitly clear state to ensure immediate UI response
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signIn, signOut }}>
            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3498db',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p>กำลังโหลดข้อมูล...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
