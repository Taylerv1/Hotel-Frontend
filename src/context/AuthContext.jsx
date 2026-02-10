import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getMe()
                .then((res) => {
                    setUser(res.data.data);
                    localStorage.setItem('user', JSON.stringify(res.data.data));
                })
                .catch(() => {
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await loginUser({ email, password });
        const { token: jwt, user: userData } = res.data.data;
        setToken(jwt);
        setUser(userData);
        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(userData));
        return res.data;
    };

    const register = async (data) => {
        const res = await registerUser(data);
        const { token: jwt, user: userData } = res.data.data;
        setToken(jwt);
        setUser(userData);
        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(userData));
        return res.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
