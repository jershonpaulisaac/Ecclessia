import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Phone, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Profile.css';

const Profile = () => {
    const { user, loading: authLoading } = useAuth();
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
                        <button
                            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Settings
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
