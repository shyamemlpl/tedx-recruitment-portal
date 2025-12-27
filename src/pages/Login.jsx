import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Where to redirect after login
    const from = location.state?.from?.pathname || '/apply';

    useEffect(() => {
        // If already logged in, redirect
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        // Initialize Google Sign-In
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true
            });

            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                {
                    theme: 'outline',
                    size: 'large',
                    width: 300,
                    text: 'signin_with',
                    shape: 'rectangular'
                }
            );
        }
    }, []);

    const handleCredentialResponse = async (response) => {
        const result = await login(response.credential);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            alert('Login failed. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="login-page">
                <div className="login-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-logo">
                            <span className="brand-ted">TED</span>
                            <span className="brand-x">x</span>
                        </div>
                        <h1>Welcome</h1>
                        <p>Sign in with your Google account to continue</p>
                    </div>

                    <div className="login-body">
                        <div id="google-signin-button" className="google-btn-container"></div>

                        <div className="login-divider">
                            <span>or</span>
                        </div>

                        <div className="login-info">
                            <p>
                                <strong>New applicant?</strong><br />
                                Sign in to start your application for TEDxPrahladnagar 2025.
                            </p>
                            <p>
                                <strong>Already applied?</strong><br />
                                Sign in to check your application status.
                            </p>
                        </div>
                    </div>

                    <div className="login-footer">
                        <p>
                            By signing in, you agree to our application terms.
                            Your email will be used for application purposes only.
                        </p>
                    </div>
                </div>

                <div className="login-decoration">
                    <div className="decoration-circle"></div>
                    <div className="decoration-circle"></div>
                    <div className="decoration-circle"></div>
                </div>
            </div>
        </div>
    );
}

export default Login;
