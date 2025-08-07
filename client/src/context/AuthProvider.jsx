// context/AuthProvider.jsx
import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user')) || null
  );

  // Auto-fetch user if token exists but user is missing
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && token) {
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          localStorage.setItem('user', JSON.stringify(res.data));
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('user');
          setUser(null);
        });
    }
  }, [user]);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    // Convert _id to string before storing
    const userWithStringId = {
      ...userData.user,
      _id: userData.user._id.toString(),
    };
    localStorage.setItem('user', JSON.stringify(userWithStringId));
    setUser(userWithStringId);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
