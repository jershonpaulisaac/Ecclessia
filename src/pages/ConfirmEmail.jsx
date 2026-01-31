import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './ConfirmEmail.css';

const ConfirmEmail = () => {
    return (
        <div className="confirm-container fade-in">
            <div className="confirm-card">
                <div className="icon-wrapper">
                    <CheckCircle size={64} className="success-icon" />
                </div>
                <h1>Email Confirmed!</h1>
                <p>Thank you for verifying your email. Your account for <strong>Ecclesia Community</strong> is now fully active.</p>
                <div className="actions">
                    <Link to="/login" className="btn btn-full">
                        Proceed to Sign In
                    </Link>
                </div>
                <footer className="confirm-footer">
                    <p>Soli Deo Gloria</p>
                </footer>
            </div>
        </div>
    );
};

export default ConfirmEmail;
