import React, { useState } from 'react';
import { Heart, Mail, MapPin, Phone, Send, Clock, User, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import './Contact.css';

const Contact = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('prayer');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        const table = activeTab === 'prayer' ? 'prayer_requests' : 'inquiries';
        const payload = activeTab === 'prayer'
            ? { name: formData.name, email: formData.email, request: formData.message, user_id: user?.id }
            : { name: formData.name, email: formData.email, message: formData.message, user_id: user?.id };

        try {
            const { error } = await supabase
                .from(table)
                .insert([payload]);

            if (error) throw error;

            setStatus({ loading: false, success: true, error: null });
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
        } catch (err) {
            console.error('Submission failed:', err);
            setStatus({ loading: false, success: false, error: err.message || 'Something went wrong' });
        }
    };

    return (
        <div className="page-container container fade-in">
            <header className="page-header">
                <h1>Contact & Fellowship</h1>
                <p className="subtitle">"Therefore encourage one another and build each other up." — 1 Thessalonians 5:11</p>
            </header>

            <div className="contact-layout">
                <div className="contact-info">
                    <div className="info-block">
                        <h3>Community Email</h3>
                        <p className="info-item"><Mail size={18} /> ecclesiacommunity@gmail.com</p>
                    </div>
                    <div className="info-block">
                        <h3>Phone</h3>
                        <p className="info-item"><Phone size={10} /> 9444679195</p>
                    </div>
                    <div className="info-block">
                        <h3>Response Time</h3>
                        <p>We aim to respond to all inquiries within 24-48 hours. Prayer requests are shared with the intercession team daily.</p>
                    </div>
                </div>

                <div className="contact-form-container">
                    <div className="form-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'prayer' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('prayer');
                                setFormData({ name: '', email: '', message: '' });
                                setStatus({ loading: false, success: false, error: null });
                            }}
                        >
                            Prayer Request
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('general');
                                setFormData({ name: '', email: '', message: '' });
                                setStatus({ loading: false, success: false, error: null });
                            }}
                        >
                            General Inquiry
                        </button>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                {activeTab === 'prayer' ? 'Prayer Request' : 'Message'}
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows="6"
                                placeholder={activeTab === 'prayer' ? "How can we pray for you?" : "How can we help?"}
                                required
                            ></textarea>
                        </div>

                        {status.error && <p className="error-message" style={{ color: '#DC2626', marginBottom: '1rem' }}>{status.error}</p>}
                        {status.success && <p className="success-message" style={{ color: '#7A8B74', marginBottom: '1rem' }}>Message sent successfully! God bless.</p>}

                        <button className="btn" disabled={status.loading}>
                            <Send size={16} style={{ marginRight: '8px' }} />
                            {status.loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
