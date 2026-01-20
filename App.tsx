
import React, { useState, useEffect } from 'react';
import { AuthState, User, AuthMode } from './types';
import { hashPassword, generateMockJWT, decodeJWT } from './services/cryptoUtils';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [error, setError] = useState<string | null>(null);

  // Initialize: check for existing session
  useEffect(() => {
    const token = localStorage.getItem('secure_auth_token');
    const storedUser = localStorage.getItem('secure_auth_user');
    
    if (token && storedUser) {
      try {
        setAuth({
          user: JSON.parse(storedUser),
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (e) {
        localStorage.clear();
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleRegister = async (name: string, email: string, pass: string) => {
    setError(null);
    try {
      const hashedPassword = await hashPassword(pass);
      const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
      
      if (users.find((u: any) => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        createdAt: new Date().toISOString(),
      };

      // Save to mock DB
      users.push({ ...newUser, password: hashedPassword });
      localStorage.setItem('mock_db_users', JSON.stringify(users));

      // Auto-login
      const token = generateMockJWT(newUser);
      setAuth({ user: newUser, token, isAuthenticated: true, isLoading: false });
      localStorage.setItem('secure_auth_token', token);
      localStorage.setItem('secure_auth_user', JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleLogin = async (email: string, pass: string) => {
    setError(null);
    try {
      const hashedPassword = await hashPassword(pass);
      const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === hashedPassword);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const { password, ...userData } = user;
      const token = generateMockJWT(userData);
      
      setAuth({ user: userData, token, isAuthenticated: true, isLoading: false });
      localStorage.setItem('secure_auth_token', token);
      localStorage.setItem('secure_auth_user', JSON.stringify(userData));
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('secure_auth_token');
    localStorage.removeItem('secure_auth_user');
    setAuth({ user: null, token: null, isAuthenticated: false, isLoading: false });
    setMode(AuthMode.LOGIN);
  };

  if (auth.isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Verifying Session...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {auth.isAuthenticated && auth.user ? (
        <Dashboard user={auth.user} onLogout={handleLogout} />
      ) : (
        <div className="w-full max-w-md">
          <AuthForm 
            mode={mode} 
            setMode={setMode} 
            error={error}
            onSubmit={mode === AuthMode.LOGIN ? handleLogin : handleRegister}
          />
        </div>
      )}
    </Layout>
  );
};

export default App;
