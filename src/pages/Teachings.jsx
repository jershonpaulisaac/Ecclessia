import React, { useState } from 'react';
import { PlayCircle, FileText, ChevronRight } from 'lucide-react';
import './Teachings.css';

const Teachings = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Salvation', 'Faith', 'Prayer', 'Christian Living'];

    const teachings = [
        {
            id: 1,
            title: "Understanding Grace",
            category: "Salvation",
            duration: "24 min",
            description: "A deep dive into the concept of grace and how it differs from mercy.",
            thumbnail: "#" // Placeholder
        },
        {
            id: 2,
            title: "The Power of Persistent Prayer",
            category: "Prayer",
            duration: "31 min",
            description: "Learning from the parables of Jesus about not giving up in prayer.",
            thumbnail: "#"
        },
        {
            id: 3,
            title: "Walking by Faith",
            category: "Faith",
            duration: "19 min",
            description: "Practical steps to trust God when the path ahead is unclear.",
            thumbnail: "#"
        }
    ];

    const filteredTeachings = activeCategory === 'All'
        ? teachings
        : teachings.filter(t => t.category === activeCategory);

    return (
        <div className="page-container container fade-in">
            <header className="page-header">
                <h1>Teachings & Doctrine</h1>
                <p className="subtitle">"All Scripture is breathed out by God and profitable for teaching." — 2 Timothy 3:16</p>
            </header>

            <div className="category-nav">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="teachings-grid">
                {filteredTeachings.map(item => (
                    <div key={item.id} className="teaching-card card">
                        <div className="video-placeholder">
                            <PlayCircle size={48} className="play-icon" />
                        </div>
                        <div className="teaching-content">
                            <span className="teaching-cat">{item.category}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <div className="teaching-meta">
                                <span>{item.duration}</span>
                                <button className="text-btn">Read Notes <ChevronRight size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Teachings;
