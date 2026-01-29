import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, BookOpen, RefreshCw, Trash2, Heart, Mail, Hand } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [data, setData] = useState({
        users: [],
        questions: [],
        quietTimes: [],
        prayers: [],
        inquiries: [],
        contributions: []
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, questionsRes, qtRes, prayersRes, inquiriesRes, contribsRes] = await Promise.all([
                fetch('http://127.0.0.1:3000/api/users'),
                fetch('http://127.0.0.1:3000/api/questions'),
                fetch('http://127.0.0.1:3000/api/quiet-times'),
                fetch('http://127.0.0.1:3000/api/prayer-requests'),
                fetch('http://127.0.0.1:3000/api/inquiries'),
                fetch('http://127.0.0.1:3000/api/contributions')
            ]);

            const users = await usersRes.json();
            const questions = await questionsRes.json();
            const quietTimes = await qtRes.json();
            const prayers = await prayersRes.json();
            const inquiries = await inquiriesRes.json();
            const contributions = await contribsRes.json();

            setData({ users, questions, quietTimes, prayers, inquiries, contributions });
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteItem = async (category, id, label) => {
        if (!window.confirm(`Are you sure you want to delete this ${label}?`)) {
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:3000/api/${category}/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchData();
            } else {
                alert(`Failed to delete ${label}`);
            }
        } catch (error) {
            console.error(`Error deleting ${label}:`, error);
            alert(`Error deleting ${label}`);
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
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
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
                                    <td><strong>{q.User ? q.User.username : 'Unknown'}</strong></td>
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
                                    <td><strong>{qt.User ? qt.User.username : 'Unknown'}</strong></td>
                                    <td className="cell-scripture">{qt.scripture}</td>
                                    <td className="cell-wrap">{qt.reflection}</td>
                                    <td>{new Date(qt.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="admin-delete-btn"
                                            onClick={() => handleDeleteItem('quiet-times', qt.id, 'quiet time')}
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
                                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="admin-delete-btn"
                                            onClick={() => handleDeleteItem('prayer-requests', p.id, 'prayer request')}
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
                                    <td>{new Date(i.createdAt).toLocaleDateString()}</td>
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
                                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="admin-delete-btn"
                                            onClick={() => handleDeleteItem('contributions', c.id, 'contribution')}
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
                </aside>

                <main className="admin-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
