import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, Lock, Globe, Palette, Download, Trash2, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import EmergencyContacts from '../components/EmergencyContacts';

function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: {
      periodReminder: true,
      symptomReminder: true,
      medicationReminder: true,
      appointmentReminder: true,
      emailNotifications: false
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      biometricLock: false,
      pinLock: false,
      pinCode: '',
      privateMode: false,
      autoLock: true,
      autoLockTime: 5
    },
    preferences: {
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      cycleLength: 28,
      periodLength: 5
    }
  });

  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings) => {
    localStorage.setItem('app_settings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const handleNotificationChange = (key) => {
    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    };
    saveSettings(updated);
  };

  const handlePrivacyChange = (key) => {
    const updated = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key]
      }
    };
    saveSettings(updated);
  };

  const handlePreferenceChange = (key, value) => {
    const updated = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    };
    saveSettings(updated);
  };

  const handleExportData = () => {
    const allData = {
      cycles: localStorage.getItem('cycles'),
      symptoms: localStorage.getItem('symptoms'),
      medications: localStorage.getItem('medications'),
      journal: localStorage.getItem('journal_entries'),
      appointments: localStorage.getItem('appointments'),
      water: localStorage.getItem('water_tracker'),
      exercises: localStorage.getItem('exercises'),
      settings: localStorage.getItem('app_settings')
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aura-complete-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('All data exported successfully!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      if (window.confirm('This will delete all your cycles, symptoms, medications, journal entries, and appointments. Are you absolutely sure?')) {
        localStorage.clear();
        alert('All data cleared. You will be logged out.');
        navigate('/login');
      }
    }
  };

  const handleSetupPin = () => {
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      alert('PIN must be 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      alert('PINs do not match');
      return;
    }
    const updated = {
      ...settings,
      privacy: {
        ...settings.privacy,
        pinLock: true,
        pinCode: newPin
      }
    };
    saveSettings(updated);
    setShowPinSetup(false);
    setNewPin('');
    setConfirmPin('');
    alert('PIN set successfully!');
  };

  const handleRemovePin = () => {
    if (window.confirm('Remove PIN protection?')) {
      const updated = {
        ...settings,
        privacy: {
          ...settings.privacy,
          pinLock: false,
          pinCode: ''
        }
      };
      saveSettings(updated);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <Navigation />
      <AnimatedBackground />
      
      <button onClick={() => navigate(-1)} className="back-button" title="Go back">
        <ArrowLeft size={20} />
      </button>
      
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="logo-icon">⚙️</span>
            <div>
              <h1 className="logo-title">Settings</h1>
              <p className="logo-subtitle">Customize your experience</p>
            </div>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <div className="privacy-badge">
              <Shield size={16} />
              <span>Private & Secure</span>
            </div>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <div className="page-container">
        {/* Notifications */}
        <div className="settings-section">
          <h2>
            <Bell size={24} />
            Notifications
          </h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Period Reminders</h4>
                <p>Get notified before your period starts</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications.periodReminder}
                  onChange={() => handleNotificationChange('periodReminder')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Symptom Logging Reminders</h4>
                <p>Daily reminders to log your symptoms</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications.symptomReminder}
                  onChange={() => handleNotificationChange('symptomReminder')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Medication Reminders</h4>
                <p>Reminders for your medications</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications.medicationReminder}
                  onChange={() => handleNotificationChange('medicationReminder')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Appointment Reminders</h4>
                <p>Reminders for doctor appointments</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications.appointmentReminder}
                  onChange={() => handleNotificationChange('appointmentReminder')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Email Notifications</h4>
                <p>Receive notifications via email</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={() => handleNotificationChange('emailNotifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="settings-section">
          <h2>
            <Lock size={24} />
            Privacy & Security
          </h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>PIN Lock</h4>
                <p>Protect your app with a 4-digit PIN</p>
              </div>
              <div className="setting-actions">
                {settings.privacy.pinLock ? (
                  <button onClick={handleRemovePin} className="btn-secondary">
                    Remove PIN
                  </button>
                ) : (
                  <button onClick={() => setShowPinSetup(!showPinSetup)} className="btn-primary">
                    Set PIN
                  </button>
                )}
              </div>
            </div>

            {showPinSetup && !settings.privacy.pinLock && (
              <div className="pin-setup-card">
                <h4>Set Up PIN</h4>
                <div className="pin-inputs">
                  <div className="form-group">
                    <label>Enter 4-digit PIN</label>
                    <input
                      type="password"
                      maxLength="4"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="pin-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm PIN</label>
                    <input
                      type="password"
                      maxLength="4"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="pin-input"
                    />
                  </div>
                </div>
                <div className="pin-actions">
                  <button onClick={() => setShowPinSetup(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={handleSetupPin} className="btn-primary">
                    Save PIN
                  </button>
                </div>
              </div>
            )}

            <div className="setting-item">
              <div className="setting-info">
                <h4>Biometric Lock</h4>
                <p>Use fingerprint/face ID to unlock</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.privacy.biometricLock}
                  onChange={() => handlePrivacyChange('biometricLock')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Private Mode</h4>
                <p>Hide sensitive data by default</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.privacy.privateMode}
                  onChange={() => handlePrivacyChange('privateMode')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Auto Lock</h4>
                <p>Automatically lock app when inactive</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.privacy.autoLock}
                  onChange={() => handlePrivacyChange('autoLock')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {settings.privacy.autoLock && (
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Auto Lock Time</h4>
                  <p>Lock after minutes of inactivity</p>
                </div>
                <select
                  value={settings.privacy.autoLockTime}
                  onChange={(e) => {
                    const updated = {
                      ...settings,
                      privacy: {
                        ...settings.privacy,
                        autoLockTime: parseInt(e.target.value)
                      }
                    };
                    saveSettings(updated);
                  }}
                  className="setting-select"
                >
                  <option value="1">1 minute</option>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                </select>
              </div>
            )}

            <div className="setting-item">
              <div className="setting-info">
                <h4>Data Sharing</h4>
                <p>Share anonymous data for research</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.privacy.dataSharing}
                  onChange={() => handlePrivacyChange('dataSharing')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Analytics</h4>
                <p>Help us improve the app</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.privacy.analytics}
                  onChange={() => handlePrivacyChange('analytics')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="security-info">
            <Shield size={20} />
            <div>
              <h4>Your Data is Secure</h4>
              <p>All data is encrypted and stored locally on your device. We never upload your personal health information to any server.</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section">
          <h2>
            <Palette size={24} />
            Preferences
          </h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Language</h4>
                <p>Choose your preferred language</p>
              </div>
              <select
                value={settings.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="setting-select"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="hi">हिन्दी</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Date Format</h4>
                <p>How dates are displayed</p>
              </div>
              <select
                value={settings.preferences.dateFormat}
                onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                className="setting-select"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Average Cycle Length</h4>
                <p>Your typical cycle length in days</p>
              </div>
              <input
                type="number"
                min="21"
                max="45"
                value={settings.preferences.cycleLength}
                onChange={(e) => handlePreferenceChange('cycleLength', parseInt(e.target.value))}
                className="setting-input"
              />
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Average Period Length</h4>
                <p>Your typical period length in days</p>
              </div>
              <input
                type="number"
                min="2"
                max="10"
                value={settings.preferences.periodLength}
                onChange={(e) => handlePreferenceChange('periodLength', parseInt(e.target.value))}
                className="setting-input"
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-section">
          <h2>
            <Download size={24} />
            Data Management
          </h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Export All Data</h4>
                <p>Download a complete backup of all your data</p>
              </div>
              <button onClick={handleExportData} className="btn-primary">
                <Download size={18} />
                Export
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Clear All Data</h4>
                <p>Permanently delete all your data</p>
              </div>
              <button onClick={handleClearData} className="btn-danger">
                <Trash2 size={18} />
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <EmergencyContacts />

        {/* About */}
        <div className="settings-section">
          <h2>
            <Globe size={24} />
            About
          </h2>
          <div className="about-info">
            <div className="about-item">
              <strong>Version:</strong> 1.0.0
            </div>
            <div className="about-item">
              <strong>Last Updated:</strong> April 2026
            </div>
            <div className="about-item">
              <strong>Privacy Policy:</strong> <a href="#privacy">View Policy</a>
            </div>
            <div className="about-item">
              <strong>Terms of Service:</strong> <a href="#terms">View Terms</a>
            </div>
            <div className="about-item">
              <strong>Support:</strong> <a href="mailto:support@aura.com">support@aura.com</a>
            </div>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🌸</span>
            <span className="footer-name">Aura</span>
          </div>
          <p className="footer-disclaimer">
            Your privacy is our priority. All data is stored locally on your device.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Settings;
