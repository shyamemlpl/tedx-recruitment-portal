import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-ted">TED</span>
                    <span className="brand-x">x</span>
                    <span className="brand-city">Prahladnagar</span>
                </Link>

                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/apply"
                        className={`nav-link ${location.pathname === '/apply' ? 'active' : ''}`}
                    >
                        Apply
                    </Link>
                    <Link
                        to="/status"
                        className={`nav-link ${location.pathname === '/status' ? 'active' : ''}`}
                    >
                        Check Status
                    </Link>
                </div>

                <div className="navbar-auth">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <img
                                src={user.picture || '/images/default-avatar.png'}
                                alt={user.name}
                                className="user-avatar"
                            />
                            <span className="user-name">{user.name}</span>
                            <button onClick={logout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
