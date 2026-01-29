import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessageCircle, Heart } from 'lucide-react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container fade-in">
            <section className="hero-section">
                <div className="container">
                    <div className="verse-container text-center">
                        <span className="verse-label">Verse of the Day</span>
                        <h1 className="scripture-text">
                            "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls."
                        </h1>
                        <p className="verse-reference">— Matthew 11:28-29</p>
                    </div>

                    <div className="reflection-box text-center">
                        <p>
                            True peace is found not in the absence of trouble, but in the presence of Christ.
                            Let us lay down our burdens today and trust in His gentle leading.
                        </p>
                    </div>
                </div>
            </section>

            <section className="access-cards container">
                <Link to="/qa" className="card access-card">
                    <MessageCircle size={32} className="card-icon" />
                    <h3>Bible Q&A</h3>
                    <p>Engage in thoughtful, scripture-based discussions with the community.</p>
                </Link>

                <Link to="/quiet-time" className="card access-card">
                    <Heart size={32} className="card-icon" />
                    <h3>Quiet Time</h3>
                    <p>Share and read daily reflections to encourage one another.</p>
                </Link>

                <Link to="/teachings" className="card access-card">
                    <BookOpen size={32} className="card-icon" />
                    <h3>Teachings</h3>
                    <p>Deepen your faith with solid biblical doctrine and study.</p>
                </Link>
            </section>
        </div>
    );
};

export default Home;
