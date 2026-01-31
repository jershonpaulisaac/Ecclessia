import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './JoinCommunity.css';

const JoinCommunity = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        intro: '',
        agreedGuidelines: false,
        subscribedNewsletter: false
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
        setLoading(true);

        try {
            const { error } = await supabase
                .from('community_joins')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    city: formData.city,
                    intro: formData.intro,
                    subscribed_newsletter: formData.subscribedNewsletter
                }]);

            if (error) throw error;
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            alert("Failed to join: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="page-container container fade-in">
                <div className="success-card">
                    <div className="success-icon">
                        <Check size={48} />
                    </div>
                    <h1>Welcome to the Community!</h1>
                    <p className="success-message">
                        Thank you for joining us, <strong>{formData.name}</strong>!
                        We're blessed to have you as part of our spiritual family.
                    </p>

                    <div className="whatsapp-section">
                        <h3>Join Our WhatsApp Group</h3>
                        <p className="text-muted">Stay connected with daily devotions, prayer requests, and community updates.</p>

                        <div className="whatsapp-options">
                            <div className="qr-placeholder">
                                <div className="qr-box">
                                    <p>QR Code</p>
                                    <small>(To be updated)</small>
                                </div>
                            </div>

                            <div className="link-section">
                                <a href="#" className="whatsapp-link">
                                    Click here to join WhatsApp Group
                                </a>
                                <p className="link-note">(Link will be updated soon)</p>
                            </div>
                        </div>
                    </div>

                    <a href="/" className="btn btn-outline mt-4">Return to Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container container fade-in">
            <div className="join-card">
                <header className="join-header">
                    <h1>Join Our Community</h1>
                    <p>We're glad you're here. Let us know who you are so we can stay connected.</p>
                </header>

                <form onSubmit={handleSubmit} className="join-form">
                    <div className="form-group">
                        <label>Full Name *</label>
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
                        <label>Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
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
                            <label>City / Region *</label>
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
                            id="agreedGuidelines"
                            name="agreedGuidelines"
                            checked={formData.agreedGuidelines}
                            onChange={handleChange}
                        />
                        <label htmlFor="agreedGuidelines" className="check-label">
                            I agree to maintain a spirit of humility, respect, and truth in this community. *
                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="subscribedNewsletter"
                            name="subscribedNewsletter"
                            checked={formData.subscribedNewsletter}
                            onChange={handleChange}
                        />
                        <label htmlFor="subscribedNewsletter" className="check-label">
                            I'd like to receive newsletters and updates via email.
                        </label>
                    </div>

                    <button type="submit" className="btn btn-full" disabled={!formData.agreedGuidelines || loading}>
                        {loading ? 'Joining...' : 'Join the Community'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinCommunity;
