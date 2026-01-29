import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        intro: '',
        agreed: false,
        password: '' // Added password field
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

        try {
            const res = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.name, // Mapping name to username
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    city: formData.city,
                    intro: formData.intro
                })
            });

            const data = await res.json();
            if (res.ok) {
                // Auto-login the newly registered user
                login(data.user);
                alert("Registration Successful! Welcome to the community.");
                navigate('/profile'); // Redirect to profile
            } else {
                alert("Error: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Registration Failed");
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

                    <button type="submit" className="btn btn-full" disabled={!formData.agreed}>
                        Create Account
                    </button>
                </form>

                <p className="auth-footer text-center">
                    Already have an account? <a href="#" className="link">Sign in here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
