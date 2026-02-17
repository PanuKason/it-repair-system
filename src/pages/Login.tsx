
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isPasswordMode, setIsPasswordMode] = useState(false);
    const { user } = useAuth();

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        if (!supabase) {
            setMessage('Supabase client failed to initialize. Check .env');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin, // e.g., http://localhost:5173
            }
        });
        if (error) {
            console.error("Login Error:", error);
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('ส่งลิงก์ล็อกอินไปทางอีเมลแล้ว! (กรุณาเช็คใน Inbox หรือ Spam)');
        }
        setLoading(false);
    };

    const handlePasswordAuth = async (isSignUp: boolean, e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!supabase) return;
        setLoading(true);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.user) setMessage('สมัครสมาชิกสำเร็จ! คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านได้แล้ว');
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.user) setMessage('เข้าสู่ระบบสำเร็จ!');
            }
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };



    if (user) {
        return <div className="container"><h2>You are already logged in!</h2></div>;
    }

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
            <div className="card glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                    <button
                        type="button"
                        onClick={() => setIsPasswordMode(false)}
                        className={`btn ${!isPasswordMode ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1 }}
                    >
                        Magic Link
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPasswordMode(true)}
                        className={`btn ${isPasswordMode ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1 }}
                    >
                        Password
                    </button>
                </div>

                {!isPasswordMode ? (
                    <form onSubmit={handleMagicLink}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                className="form-control"
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
                                {loading ? 'Sending...' : 'Send Magic Link'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={(e) => handlePasswordAuth(false, e)}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                className="form-control"
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                className="form-control"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 1 }}>
                                {loading ? 'Loading...' : 'Login'}
                            </button>
                            <button
                                className="btn btn-secondary"
                                type="button"
                                disabled={loading}
                                style={{ flex: 1 }}
                                onClick={(e) => handlePasswordAuth(true, e as any)}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                )}

                {message && <div style={{ color: message.includes('Error') ? 'var(--error)' : 'var(--success)', marginTop: '1rem', textAlign: 'center' }}>{message}</div>}
            </div>
        </div>
    );
};
