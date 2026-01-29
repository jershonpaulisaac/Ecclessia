import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Phone, Edit2, Check, X } from 'lucide-react';
import { API_URL } from '../config';
import './Profile.css';

const Profile = () => {
    const { user, login } = useAuth(); // login actually updates user state too
    const [isEditing, setIsEditing] = useState(false);
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
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                intro: user.intro || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`${API_URL}/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const updatedUser = await res.json();

            if (res.ok) {
                login(updatedUser); // Update global context
                setIsEditing(false);
            } else {
                alert("Failed to update profile");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <div className="container py-5">Please logging in to view your profile.</div>;

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
                        <button className="nav-item active">Overview</button>
                        <button className="nav-item">My Posts</button>
                        <button className="nav-item">Settings</button>
                    </div>
                </aside>

                {/* Profile Content */}
                <main className="profile-content">
                    <div className="content-header">
                        <h3>Profile Details</h3>
                        {!isEditing ? (
                            <button className="btn-icon" onClick={() => setIsEditing(true)}>
                                <Edit2 size={16} /> Edit
                            </button>
                        ) : (
                            <div className="action-group">
                                <button className="btn-icon cancel" onClick={() => setIsEditing(false)}>
                                    <X size={16} /> Cancel
                                </button>
                                <button className="btn-icon save" onClick={handleSave}>
                                    <Check size={16} /> Save
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="details-grid">
                        <div className="detail-item">
                            <label>Full Name</label>
                            {isEditing ? (
                                <input name="username" value={formData.username} onChange={handleChange} />
                            ) : (
                                <p className="detail-value"><User size={16} /> {user.username}</p>
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
                                <p className="detail-value">{user.phone ? <><Phone size={16} /> {user.phone}</> : 'Not provided'}</p>
                            )}
                        </div>

                        <div className="detail-item">
                            <label>Location</label>
                            {isEditing ? (
                                <input name="city" value={formData.city} onChange={handleChange} />
                            ) : (
                                <p className="detail-value">{user.city ? <><MapPin size={16} /> {user.city}</> : 'Not provided'}</p>
                            )}
                        </div>

                        <div className="detail-item full-width">
                            <label>About Me</label>
                            {isEditing ? (
                                <textarea name="intro" rows="4" value={formData.intro} onChange={handleChange} />
                            ) : (
                                <p className="detail-bio">{user.intro || "No bio yet."}</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
