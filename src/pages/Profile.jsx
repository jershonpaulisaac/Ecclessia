import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, MapPin, Phone, Edit2, Check, X, Moon, Sun, Shield, Bell, Key, LogOut, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Profile.css';

const Profile = () => {
    const { user, loading: authLoading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        city: '',
        intro: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.user_metadata?.username || user.username || '',
                email: user.email || '',
                phone: user.user_metadata?.phone || user.phone || '',
                city: user.user_metadata?.city || user.city || '',
                intro: user.user_metadata?.intro || user.intro || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [activeTab, setActiveTab] = useState('overview');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'posts':
                return (
                    <div className="tab-content text-center py-5">
                        <h3 className="text-muted">No posts yet</h3>
                        <p className="text-muted">When you contribute to Q&A or other sections, your posts will appear here.</p>
                        <button className="btn mt-3" onClick={() => window.location.href = '/qa'}>Go to Q&A</button>
                    </div>
                );
            case 'overview':
            default:
                return (
                    <div className="details-grid">
                        <div className="detail-item">
                            <label>Full Name</label>
                            {isEditing ? (
                                <input name="username" value={formData.username} onChange={handleChange} />
                            ) : (
                                <p className="detail-value"><User size={16} /> {formData.username || user.username || 'Member'}</p>
                            )}
                        </div>

                        <div className="detail-item">
                            <label>Email Address</label>
                            <p className="detail-value text-muted"><Mail size={16} /> {user.email}</p>
                        </div>

                        <div className="detail-item">
                            <label>Phone</label>
                            {isEditing ? (
                                <input name="phone" value={formData.phone} onChange={handleChange} />
                            ) : (
                                <p className="detail-value">
                                    {formData.phone ? <><Phone size={16} /> {formData.phone}</> : 'Not provided'}
                                </p>
                            )}
                        </div>

                        <div className="detail-item">
                            <label>Location</label>
                            {isEditing ? (
                                <input name="city" value={formData.city} onChange={handleChange} />
                            ) : (
                                <p className="detail-value">
                                    {formData.city ? <><MapPin size={16} /> {formData.city}</> : 'Not provided'}
                                </p>
                            )}
                        </div>

                        <div className="detail-item full-width">
                            <label>About Me</label>
                            {isEditing ? (
                                <textarea name="intro" rows="4" value={formData.intro} onChange={handleChange} />
                            ) : (
                                <p className="detail-bio">{formData.intro || "No bio yet."}</p>
                            )}
                        </div>
                    </div>
                );
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: formData.username,
                    phone: formData.phone,
                    city: formData.city,
                    intro: formData.intro
                })
                .eq('id', user.id);

            if (error) throw error;
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) return <div className="container py-5">Loading profile...</div>;
    if (!user) return <div className="container py-5">Please log in to view your profile.</div>;

    return (
        <div className="page-container container fade-in">
            <div className="profile-layout">
                {/* Profile Sidebar / Card */}
                <aside className="profile-sidebar">
                    <div className="user-avatar-large">
                        {formData.username.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="mt-4">{user.username}</h2>
                    <span className="profile-role">{user.role}</span>

                    <div className="profile-nav mt-4">
                        <button
                            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'posts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            My Posts
                        </button>
                    </div>
                </aside>

                {/* Profile Content */}
                <main className="profile-content">
                    <div className="content-header">
                        <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                        {activeTab === 'overview' && (
                            !isEditing ? (
                                <button className="btn-icon" onClick={() => setIsEditing(true)}>
                                    <Edit2 size={16} /> Edit
                                </button>
                            ) : (
                                <div className="action-group">
                                    <button className="btn-icon cancel" onClick={() => setIsEditing(false)}>
                                        <X size={16} /> Cancel
                                    </button>
                                    <button className="btn-icon save" onClick={handleSave} disabled={saving}>
                                        <Check size={16} /> {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            )
                        )}
                    </div>

                    {renderTabContent()}
                </main>
            </div>
        </div>
    );
};

export default Profile;
