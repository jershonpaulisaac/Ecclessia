import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, AlertCircle, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import './QA.css';

const QA = () => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAskForm, setShowAskForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [newQ, setNewQ] = useState({ title: '', context: '', verse_ref: '' });

    // 1. Fetch Questions from Supabase
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('questions')
                .select(`
                    *,
                    profiles (username),
                    answers (id)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setQuestions(data || []);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // 2. Submit New Question
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newQ.title) return;

        if (!user) {
            alert("Please sign in to post a question.");
            return;
        }

        try {
            setSubmitting(true);
            const { error } = await supabase
                .from('questions')
                .insert([{
                    title: newQ.title,
                    context: newQ.context,
                    verse_ref: newQ.verse_ref,
                    user_id: user.id
                }]);

            if (error) throw error;

            setNewQ({ title: '', context: '', verse_ref: '' });
            setShowAskForm(false);
            fetchQuestions(); // Refresh list
            alert("Question posted successfully!");
        } catch (error) {
            console.error("Error posting question:", error);
            alert("Error: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // 3. Delete Question
    const handleDelete = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('questions')
                .delete()
                .eq('id', questionId);

            if (error) throw error;
            fetchQuestions();
        } catch (error) {
            console.error("Error deleting question:", error);
            alert('Failed to delete question: ' + error.message);
        }
    };

    return (
        <div className="page-container container fade-in">
            <header className="page-header">
                <h1>Bible Q&A</h1>
                <p className="subtitle">"Come now, let us reason together, says the Lord." — Isaiah 1:18</p>

                {!showAskForm && (
                    <button className="btn" onClick={() => setShowAskForm(true)}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> Ask a Question
                    </button>
                )}
            </header>

            {showAskForm && (
                <div className="ask-form-card fade-in">
                    <div className="form-header">
                        <h3>Ask the Community</h3>
                        <button className="close-btn" onClick={() => setShowAskForm(false)}><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Question / Topic</label>
                            <input
                                value={newQ.title}
                                onChange={e => setNewQ({ ...newQ, title: e.target.value })}
                                placeholder="e.g. What does it mean to walk in the Spirit?"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Context / Details</label>
                            <textarea
                                value={newQ.context}
                                onChange={e => setNewQ({ ...newQ, context: e.target.value })}
                                rows="3"
                                placeholder="Share a bit more about what you're studying..."
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Related Scripture (Optional)</label>
                            <input
                                value={newQ.verse_ref}
                                onChange={e => setNewQ({ ...newQ, verse_ref: e.target.value })}
                                placeholder="e.g. Galatians 5:16"
                            />
                        </div>
                        <button type="submit" className="btn" disabled={submitting}>
                            {submitting ? 'Posting...' : 'Post Question'}
                        </button>
                    </form>
                </div>
            )}

            <div className="rules-banner">
                <span className="info-icon"><AlertCircle size={18} /></span>
                <p>Keep discussions Bible-focused. Maintain humility and respect. No arguments driven by pride.</p>
            </div>

            <div className="questions-feed">
                {loading ? (
                    <p className="text-center text-muted">Loading discussions...</p>
                ) : questions.length === 0 ? (
                    <div className="text-center empty-state">
                        <p className="text-muted">No questions yet. Be the first to ask!</p>
                    </div>
                ) : (
                    questions.map(q => (
                        <div key={q.id} className="question-card">
                            <div className="question-header">
                                <div className="header-left">
                                    <span className="author-name">{q.profiles ? q.profiles.username : 'Anonymous'}</span>
                                    {q.verse_ref && <span className="verse-tag">{q.verse_ref}</span>}
                                </div>
                            </div>

                            <h2 className="question-title">{q.title}</h2>
                            <p className="question-context">{q.context}</p>

                            <div className="interaction-bar">
                                <button className="action-btn">
                                    <ThumbsUp size={16} /> Amen ({q.amen_count})
                                </button>
                                <button className="action-btn">
                                    <MessageSquare size={16} /> Answer ({q.answers ? q.answers.length : 0})
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default QA;
