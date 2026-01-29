import React, { useState, useEffect } from 'react';
import { Book, Heart, Lock, Globe, X } from 'lucide-react';
import { API_URL } from '../config';
import './QuietTime.css';

const QuietTime = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    // New Entry State
    const [newEntry, setNewEntry] = useState({ scripture: '', reflection: '', is_public: false });

    const fetchEntries = async () => {
        try {
            const res = await fetch(`${API_URL}/api/quiet-times`);
            const data = await res.json();
            setEntries(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleSubmit = async () => {
        if (!newEntry.scripture || !newEntry.reflection) return;

        try {
            const res = await fetch(`${API_URL}/api/quiet-times`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntry)
            });
            if (res.ok) {
                setNewEntry({ scripture: '', reflection: '', is_public: false });
                fetchEntries();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (entryId) => {
        if (!window.confirm('Are you sure you want to delete this reflection? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/quiet-times/${entryId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchEntries(); // Refresh list
            } else {
                alert('Failed to delete entry');
            }
        } catch (error) {
            console.error("Error deleting entry:", error);
            alert('Failed to delete entry');
        }
    };

    return (
        <div className="page-container container fade-in">
            <header className="qt-header text-center">
                <h1>Daily Quiet Time</h1>
                <p className="subtitle">"But his delight is in the law of the Lord, and on his law he meditates day and night." — Psalm 1:2</p>
            </header>

            <div className="qt-layout">
                <aside className="qt-sidebar">
                    <div className="qt-compose-card">
                        <h3>Share Your Reflection</h3>
                        <div className="input-group">
                            <label>Scripture Read</label>
                            <input
                                type="text"
                                placeholder="e.g. John 3:16"
                                value={newEntry.scripture}
                                onChange={e => setNewEntry({ ...newEntry, scripture: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Reflection</label>
                            <textarea
                                rows="4"
                                placeholder="What is God speaking to you today?"
                                value={newEntry.reflection}
                                onChange={e => setNewEntry({ ...newEntry, reflection: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="qt-actions">
                            <div className="visibility-toggle">
                                <button
                                    className={`toggle-btn ${newEntry.is_public ? 'active' : ''}`}
                                    onClick={() => setNewEntry({ ...newEntry, is_public: true })}
                                    title="Public"
                                >
                                    <Globe size={16} />
                                </button>
                                <button
                                    className={`toggle-btn ${!newEntry.is_public ? 'active' : ''}`}
                                    onClick={() => setNewEntry({ ...newEntry, is_public: false })}
                                    title="Private"
                                >
                                    <Lock size={16} />
                                </button>
                            </div>
                            <button className="btn" onClick={handleSubmit}>Post Entry</button>
                        </div>
                    </div>
                </aside>

                <main className="qt-feed">
                    {loading ? (
                        <p className="text-muted">Loading reflections...</p>
                    ) : entries.length === 0 ? (
                        <p className="text-muted">No public reflections yet. Share yours!</p>
                    ) : (
                        entries.map(entry => (
                            <div key={entry.id} className="qt-entry">
                                <div className="qt-meta">
                                    <div className="meta-left">
                                        <span className="qt-date">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                        <span className="qt-user">{entry.User ? entry.User.username : 'Unknown'}</span>
                                    </div>
                                </div>
                                <div className="qt-scripture">
                                    <Book size={16} /> <span>{entry.scripture}</span>
                                </div>
                                <p className="qt-content">{entry.reflection}</p>
                                <div className="qt-footer">
                                    <button className="reaction-btn">
                                        <Heart size={16} /> {entry.reactions}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
};

export default QuietTime;
