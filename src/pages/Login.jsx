import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out. Please check your internet connection.")), 15000)
            );

            // Race the login against the timeout
            const loginPromise = supabase.auth.signInWithPassword({
                email,
                password
            });

            const { data, error: authError } = await Promise.race([loginPromise, timeoutPromise]);

            if (authError) throw authError;

            if (data.user) {
                navigate('/'); // Redirect to home
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container container fade-in center-content">
            <div className="login-card shadow-sm">
                <h1 className="text-center">Welcome Back</h1>
                <p className="text-muted text-center mb-4">Sign in to your account</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn-full" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-4 text-small">
                    Don't have an account? <a href="/register" className="link">Register here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
