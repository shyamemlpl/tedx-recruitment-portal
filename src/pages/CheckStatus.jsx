import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './CheckStatus.css';

function CheckStatus() {
    const { user } = useAuth();
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatus();
    }, [user]);

    const fetchStatus = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/.netlify/functions/get-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
                credentials: 'include'
            });

            if (response.status === 404) {
                setStatus({ notFound: true });
                return;
            }

            if (response.status === 429) {
                setError('Too many requests. Please try again in a few minutes.');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch status');
            }

            const data = await response.json();
            setStatus(data);
        } catch (err) {
            console.error('Status fetch error:', err);
            setError('Unable to fetch your application status. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusDisplay = () => {
        if (!status || !status.status) return { type: 'pending', label: 'Under Review' };

        const statusLower = status.status.toLowerCase().trim();

        if (statusLower === 'selected' || statusLower === 'accepted') {
            return { type: 'success', label: 'Selected' };
        }
        if (statusLower === 'rejected') {
            return { type: 'rejected', label: 'Not Shortlisted' };
        }
        return { type: 'pending', label: 'Under Review' };
    };

    if (loading) {
        return (
            <div className="status-page">
                <div className="container">
                    <div className="status-card loading">
                        <div className="spinner"></div>
                        <p>Fetching your application status...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="status-page">
                <div className="container">
                    <div className="status-card error-card">
                        <div className="error-icon">⚠️</div>
                        <h2>Something went wrong</h2>
                        <p>{error}</p>
                        <button onClick={fetchStatus} className="btn btn-primary">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (status?.notFound) {
        return (
            <div className="status-page">
                <div className="container">
                    <div className="status-card not-found">
                        <div className="not-found-icon">📝</div>
                        <h2>No Application Found</h2>
                        <p>
                            We couldn't find an application associated with <strong>{user.email}</strong>.
                        </p>
                        <p className="hint">
                            If you've applied, make sure you're signed in with the same Google account
                            you used during the application.
                        </p>
                        <Link to="/apply" className="btn btn-primary">
                            Apply Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const statusDisplay = getStatusDisplay();

    return (
        <div className="status-page">
            <div className="container">
                <div className="status-header">
                    <h1>Application Status</h1>
                    <p>Track the progress of your TEDxPrahladnagar 2025 application</p>
                </div>

                <div className="status-card">
                    {/* User Info */}
                    <div className="applicant-info">
                        <img
                            src={user.picture || '/images/default-avatar.png'}
                            alt={user.name}
                            className="applicant-avatar"
                        />
                        <div className="applicant-details">
                            <h3>{status.name || user.name}</h3>
                            <p>{user.email}</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`status-display ${statusDisplay.type}`}>
                        <div className="status-icon">
                            {statusDisplay.type === 'success' && '✓'}
                            {statusDisplay.type === 'rejected' && '✕'}
                            {statusDisplay.type === 'pending' && '⏳'}
                        </div>
                        <div className="status-info">
                            <span className="status-label">Current Status</span>
                            <span className="status-value">{statusDisplay.label}</span>
                        </div>
                    </div>

                    {/* Application Details */}
                    <div className="application-details">
                        {status.team && (
                            <div className="detail-item">
                                <span className="detail-label">Team Applied For</span>
                                <span className="detail-value">{status.team}</span>
                            </div>
                        )}
                        {status.submittedDate && (
                            <div className="detail-item">
                                <span className="detail-label">Application Date</span>
                                <span className="detail-value">
                                    {new Date(status.submittedDate).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Status-Specific Message */}
                    <div className={`status-message ${statusDisplay.type}`}>
                        {statusDisplay.type === 'pending' && (
                            <>
                                <h4>Your application is being reviewed</h4>
                                <p>
                                    Our team is carefully reviewing all applications.
                                    We'll update your status once a decision has been made.
                                    Check back here for updates.
                                </p>
                            </>
                        )}
                        {statusDisplay.type === 'success' && (
                            <>
                                <h4>🎉 Congratulations!</h4>
                                <p>
                                    You've been selected to join TEDxPrahladnagar 2025!
                                    We're thrilled to have you on board. Our team will contact you
                                    shortly with next steps and onboarding information.
                                </p>
                            </>
                        )}
                        {statusDisplay.type === 'rejected' && (
                            <>
                                <h4>Thank you for applying</h4>
                                <p>
                                    After careful consideration, we are unable to move forward
                                    with your application at this time. We appreciate the time
                                    and effort you put into your application and wish you the
                                    best in your future endeavors.
                                </p>
                                <p className="signature">
                                    Best wishes,<br />
                                    Team TEDxPrahladnagar
                                </p>
                            </>
                        )}
                    </div>

                    {/* Refresh Button */}
                    <button onClick={fetchStatus} className="btn btn-secondary refresh-btn">
                        🔄 Refresh Status
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckStatus;
