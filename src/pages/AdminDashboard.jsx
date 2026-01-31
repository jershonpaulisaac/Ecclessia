import React, { useState, useEffect } from 'react';
import { Users, BookOpen, MessageSquare, Heart, Mail, Hand, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [data, setData] = useState({
        users: [],
        questions: [],
        quietTimes: [],
        prayers: [],
        inquiries: [],
        contributions: [],
        communityJoins: []
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [
                { data: users },
                { data: questions },
                { data: quietTimes },
                { data: prayers },
                { data: inquiries },
                { data: contributions },
                { data: communityJoins }
            ] = await Promise.all([
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
                supabase.from('questions').select('*, profiles(username)').order('created_at', { ascending: false }),
                supabase.from('quiet_times').select('*, profiles(username)').order('created_at', { ascending: false }),
                supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }),
                supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
                supabase.from('contribution_records').select('*').order('created_at', { ascending: false }),
                supabase.from('community_joins').select('*').order('created_at', { ascending: false })
            ]);

            setData({
                users: users || [],
                questions: questions || [],
                quietTimes: quietTimes || [],
                prayers: prayers || [],
                inquiries: inquiries || [],
                contributions: contributions || [],
                communityJoins: communityJoins || []
            });
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteItem = async (table, id, label) => {
        if (!window.confirm(`Are you sure you want to delete this ${label}?`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (error) {
            console.error(`Error deleting ${label}:`, error);
            alert(`Error deleting ${label}: ` + error.message);
        }
    };

    const renderContent = () => {
        if (loading) return <div className="loading">Loading database records...</div>;

        if (activeTab === 'users') {
            return (
                <div className="table-responsive fade-in">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td><span className="user-badge">{u.username}</span></td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        if (activeTab === 'questions') {
            return (
                <div className="table-responsive fade-in">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Title</th>
                                <th>Context</th>
                                <th>Verse</th>
                                <th>Amens</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.questions.map(q => (
                                <tr key={q.id}>
                                    <td>{q.id}</td>
                                    <td><strong>{q.profiles ? q.profiles.username : 'Unknown'}</strong></td>
                                    <td className="cell-wrap">{q.title}</td>
                                    <td className="cell-truncate">{q.context}</td>
                                    <td>{q.verse_ref || '-'}</td>
                                    <td>{q.amen_count}</td>
                                    <td>
                                        <button
                                            className="admin-delete-btn"
                                            onClick={() => handleDeleteItem('questions', q.id, 'question')}
                                            title="Delete question"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        if (activeTab === 'quietTimes') {
            return (
                <div className="table-responsive fade-in">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Scripture</th>
                                <th>Reflection</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.quietTimes.map(qt => (
                                <tr key={qt.id}>
                                    <td>{qt.id}</td>
                                    <td><strong>{qt.profiles ? qt.profiles.username : 'Unknown'}</strong></td>
                                    <td className="cell-scripture">{qt.scripture}</td>
                                    <td className="cell-wrap">{qt.reflection}</td>
                                    <td>{new Date(qt.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="admin-delete-btn"
                                            onClick={() => handleDeleteItem('quiet_times', qt.id, 'quiet time')}
                                            title="Delete entry"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        if (activeTab === 'prayers') {
            return (
                <div className="table-responsive fade-in">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Request</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.prayers.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td><strong>{p.name}</strong></td>
                                    <td>{p.email}</td>
                                    <td className="cell-wrap">{p.request}</td>
                                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="admin-delete-btn"
                                            onClick={() => handleDeleteItem('prayer_requests', p.id, 'prayer request')}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        if (activeTab === 'inquiries') {
            return (
                <div className="table-responsive fade-in">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Message</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.inquiries.map(i => (
                                <tr key={i.id}>
                                    <td>{i.id}</td>
                                    <td><strong>{i.name}</strong></td>
                                    <td>{i.email}</td>
                                    <td className="cell-wrap">{i.message}</td>
                                    <td>{new Date(i.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="admin-delete-btn"
                                            onClick={() => handleDeleteItem('inquiries', i.id, 'inquiry')}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        if (activeTab === 'contributions') {
            return (
                <div className="table-responsive fade-in">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Amount / Detail</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.contributions.map(c => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td><strong>{c.name}</strong><br /><small>{c.email}</small></td>
                                    <td><span className={`type-badge ${c.type}`}>{c.type}</span></td>
                                    <td>
                                        {c.amount ? `₹${c.amount}` : '-'}
                                        {c.message && <div className="detail-text">{c.message}</div>}
                                    </td>
                                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="admin-delete-btn"
                                            onClick={() => handleDeleteItem('contribution_records', c.id, 'contribution')}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        if (activeTab === 'joins') {
            return (
                <div className="table-responsive fade-in">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Intro</th>
                                <th>Newsletter</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.communityJoins.map(j => (
                                <tr key={j.id}>
                                    <td>{j.id}</td>
                                    <td><strong>{j.name}</strong></td>
                                    <td>{j.email}</td>
                                    <td>{j.phone || '-'}</td>
                                    <td>{j.city}</td>
                                    <td className="cell-wrap">{j.intro || '-'}</td>
                                    <td>{j.subscribed_newsletter ? 'Yes' : 'No'}</td>
                                    <td>{new Date(j.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="admin-delete-btn"
                                            onClick={() => handleDeleteItem('community_joins', j.id, 'join request')}
                                            title="Delete entry"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    };

    return (
        <div className="admin-container container">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <button onClick={fetchData} className="refresh-btn" title="Refresh Data">
                    <RefreshCw size={20} className={loading ? 'spin' : ''} />
                </button>
            </header>

            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <button
                        className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <Users size={20} /> Users
                        <span className="count-badge">{data.users.length}</span>
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === 'questions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('questions')}
                    >
                        <MessageSquare size={20} /> Questions
                        <span className="count-badge">{data.questions.length}</span>
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === 'quietTimes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('quietTimes')}
                    >
                        <BookOpen size={20} /> Quiet Times
                        <span className="count-badge">{data.quietTimes.length}</span>
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === 'prayers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prayers')}
                    >
                        <Heart size={20} /> Prayers
                        <span className="count-badge">{data.prayers.length}</span>
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inquiries')}
                    >
                        <Mail size={20} /> Inquiries
                        <span className="count-badge">{data.inquiries.length}</span>
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === 'contributions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contributions')}
                    >
                        <Hand size={20} /> Contributions
                        <span className="count-badge">{data.contributions.length}</span>
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'joins' ? 'active' : ''}`}
                        onClick={() => setActiveTab('joins')}
                    >
                        <Users size={20} /> Community Joins
                        <span className="count-badge">{data.communityJoins.length}</span>
                    </button>
                </aside>

                <main className="admin-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
