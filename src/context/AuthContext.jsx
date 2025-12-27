import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const response = await fetch('/.netlify/functions/check-session', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.log('No active session');
        } finally {
            setLoading(false);
        }
    };

    const login = async (googleCredential) => {
        try {
            const response = await fetch('/.netlify/functions/verify-google-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: googleCredential }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await fetch('/.netlify/functions/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
