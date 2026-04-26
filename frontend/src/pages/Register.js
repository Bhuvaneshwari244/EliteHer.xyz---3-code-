import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Eye, EyeOff, Mail, Lock, User, Calendar } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedPage from '../components/AnimatedPage';
import RippleButton from '../components/RippleButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageAnimationClasses, getStaggerDelay, showNotification, triggerSuccessAnimation } from '../utils/animationUtils';
import { useLanguage } from '../context/LanguageContext';

function Register({ setAuth }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
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
      console.log('Attempting registration with:', { 
        name: formData.name, 
        email: formData.email, 
        age: formData.age 
      });
      
      const response = await authAPI.register(formData);
      console.log('Registration successful:', response.data);
      
      const token = response.data.access_token;
      const user = response.data.user || { 
        email: formData.email, 
        name: formData.name,
        age: formData.age 
      };
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('loginTime', new Date().toISOString());
      
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        fullError: err
      });
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
      } else if (!err.response) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🌸 {t('common.appName')}</h1>
        <h2>{t('auth.registerTitle')}</h2>
        <p className="subtitle">{t('auth.startJourney')}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('auth.name')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>

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
            <label>{t('auth.age')}</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="10"
              max="100"
              placeholder="25"
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
              minLength="6"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('auth.registering') : t('auth.register')}
          </button>
        </form>

        <p className="auth-footer">
          {t('auth.haveAccount')} <Link to="/login">{t('auth.signIn')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
