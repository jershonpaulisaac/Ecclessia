import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        intro: '',
        agreed: false,
        password: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agreed) {
            alert("Please agree to the community guidelines.");
            return;
        }

        setLoading(true);
        try {
            // Create a timeout promise to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out. Please check your internet connection.")), 15000)
            );

            // Race the signup against the timeout
            const signUpPromise = supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        username: formData.name,
                        phone: formData.phone,
                        city: formData.city,
                        intro: formData.intro
                    }
                }
            });

            const { data, error } = await Promise.race([signUpPromise, timeoutPromise]);

            if (error) throw error;

            alert("Registration Successful! Please check your email for verification (if enabled) and sign in.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert("Registration Failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container container fade-in">
            <div className="auth-card">
                <header className="auth-header">
                    <h1>Join the Community</h1>
                    <p>We are glad you are here. Please let us know who you are.</p>
                </header>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name / Username</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Min 6 characters"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(Optional)"
                            />
                        </div>
                        <div className="form-group">
                            <label>City / Region</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Seattle, WA"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Short Introduction (Optional)</label>
                        <textarea
                            name="intro"
                            value={formData.intro}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Tell us a little about your spiritual journey..."
                        ></textarea>
                    </div>

                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="agreed"
                            name="agreed"
                            checked={formData.agreed}
                            onChange={handleChange}
                        />
                        <label htmlFor="agreed" className="check-label">
                            I agree to maintain a spirit of humility, respect, and truth in this community.
                        </label>
                    </div>

                    <button type="submit" className="btn btn-full" disabled={!formData.agreed || loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer text-center">
                    Already have an account? <Link to="/login" className="link">Sign in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
