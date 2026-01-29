import React, { useState } from 'react';
import { Heart, Mail, Hand, DollarSign, BookOpen, Users, Clock, Check } from 'lucide-react';
import { API_URL } from '../config';
import './Contribution.css';

const Contribution = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [amount, setAmount] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const res = await fetch(`${API_URL}/api/contributions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type: selectedType,
                    amount: selectedType === 'support' ? amount : null
                })
            });

            if (res.ok) {
                setStatus({ loading: false, success: true, error: null });
                setFormData({ name: '', email: '', message: '' });
                setAmount('');
                setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
            } else {
                const data = await res.json();
                setStatus({ loading: false, success: false, error: data.error || 'Submission failed' });
            }
        } catch (err) {
            console.error('Contribution submission failed:', err);
            setStatus({ loading: false, success: false, error: 'Could not connect to server' });
        }
    };

    const types = [
        { id: 'content', icon: <Zap size={24} />, label: "Content", desc: "Share devotionals or teachings" },
        { id: 'prayer', icon: <Heart size={24} />, label: "Prayer", desc: "Commit to praying for requests" },
        { id: 'service', icon: <Hand size={24} />, label: "Service", desc: "Volunteer for community needs" },
        { id: 'support', icon: <CreditCard size={24} />, label: "Financial Support", desc: "Help sustain the community" },
    ];

    return (
        <div className="page-container container fade-in">
            <header className="page-header">
                <h1>Contribution</h1>
                <p className="subtitle">"Each of you should use whatever gift you have received to serve others." — 1 Peter 4:10</p>
            </header>

            <section className="contrib-options">
                {types.map(type => (
                    <button
                        key={type.id}
                        className={`contrib-card ${selectedType === type.id ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedType(type.id);
                            setFormData({ name: '', email: '', message: '' });
                            setAmount('');
                            setStatus({ loading: false, success: false, error: null });
                        }}
                    >
                        <div className="contrib-icon">{type.icon}</div>
                        <h3>{type.label}</h3>
                        <p>{type.desc}</p>
                    </button>
                ))}
            </section>

            {selectedType && selectedType !== 'support' && (
                <section className="contrib-form-section fade-in">
                    <h2>Offer your {types.find(t => t.id === selectedType).label}</h2>
                    <form className="contrib-form" onSubmit={handleSubmit}>
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="How would you like to contribute?"
                                required
                            ></textarea>
                        </div>
                        {status.error && <p className="error-message" style={{ color: '#DC2626', marginBottom: '1rem' }}>{status.error}</p>}
                        {status.success && <p className="success-message" style={{ color: '#7A8B74', marginBottom: '1rem' }}>Thank you for your generous heart! Contribution recorded.</p>}
                        <button className="btn" disabled={status.loading}>
                            {status.loading ? 'Submitting...' : 'Submit Offer'}
                        </button>
                    </form>
                </section>
            )}

            {selectedType === 'support' && (
                <section className="payment-section fade-in">
                    <h2>Financial Support</h2>
                    <p className="payment-intro">Your generous giving helps sustain our community and ministry. All contributions are voluntary and prayerfully received.</p>

                    <div className="payment-card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
                            </div>

                            <div className="form-group">
                                <label>Contribution Amount</label>
                                <div className="amount-input-wrapper">
                                    <span className="currency-symbol">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        min="1"
                                        required={selectedType === 'support'}
                                    />
                                </div>
                            </div>

                            <div className="quick-amounts">
                                <button type="button" onClick={() => setAmount('100')} className="amount-btn">₹100</button>
                                <button type="button" onClick={() => setAmount('500')} className="amount-btn">₹500</button>
                                <button type="button" onClick={() => setAmount('1000')} className="amount-btn">₹1000</button>
                                <button type="button" onClick={() => setAmount('2000')} className="amount-btn">₹2000</button>
                            </div>

                            <div className="payment-gateway-placeholder">
                                <div className="gateway-box">
                                    <CreditCard size={32} />
                                    <p><strong>Payment Gateway Integration</strong></p>
                                    <p className="text-muted">Your payment gateway (Razorpay, Stripe, etc.) will be integrated here.</p>
                                </div>
                            </div>

                            {status.error && <p className="error-message" style={{ color: '#DC2626', marginBottom: '1rem' }}>{status.error}</p>}
                            {status.success && <p className="success-message" style={{ color: '#7A8B74', marginBottom: '1rem' }}>Thank you for your generous support! (Recorded as pledge)</p>}

                            <button className="btn btn-payment" disabled={status.loading}>
                                {status.loading ? 'Recording...' : 'Proceed to Payment (Pledge)'}
                            </button>
                            <p className="payment-note">Payment gateway will be activated soon. Currently recording pledges.</p>
                        </form>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Contribution;
