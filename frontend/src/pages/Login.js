import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedPage from '../components/AnimatedPage';
import RippleButton from '../components/RippleButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageAnimationClasses, getStaggerDelay, showNotification, triggerSuccessAnimation } from '../utils/animationUtils';
import { useLanguage } from '../context/LanguageContext';

function Login({ setAuth }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const token = response.data.access_token;
      const user = response.data.user || { email: formData.email };
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('loginTime', new Date().toISOString());
      
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🌸 {t('common.appName')}</h1>
        <h2>{t('auth.loginTitle')}</h2>
        <p className="subtitle">{t('auth.trackHealthPredict')}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('auth.email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label>{t('auth.password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>

        <p className="auth-footer">
          {t('auth.dontHaveAccount')} <Link to="/register">{t('auth.registerHere')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
