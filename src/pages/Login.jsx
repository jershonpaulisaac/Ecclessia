import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user);
                navigate('/'); // Redirect to home
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to login. Please try again.');
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

                    <button type="submit" className="btn btn-full">Sign In</button>
                </form>

                <p className="text-center mt-4 text-small">
                    Don't have an account? <a href="/register" className="link">Register here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
