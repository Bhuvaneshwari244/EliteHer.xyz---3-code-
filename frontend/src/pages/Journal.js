import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BookOpen, Plus, Trash2, Search, Calendar, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

function Journal() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    tags: ''
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const saved = localStorage.getItem('journal_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  };

  const saveEntries = (newEntries) => {
    localStorage.setItem('journal_entries', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    saveEntries([newEntry, ...entries]);
    setFormData({ title: '', content: '', mood: 'neutral', tags: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      saveEntries(entries.filter(e => e.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMoodEmoji = (mood) => {
    const emojis = {
      'happy': '😊',
      'sad': '😢',
      'anxious': '😰',
      'calm': '😌',
      'excited': '🤩',
      'neutral': '😐',
      'grateful': '🙏',
      'tired': '😴'
    };
    return emojis[mood] || '😐';
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
            <span className="logo-icon">📔</span>
            <div>
              <h1 className="logo-title">Journal</h1>
              <p className="logo-subtitle">Your personal health diary</p>
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
        <div className="journal-header">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={20} />
            New Entry
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="journal-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Give your entry a title..."
                required
              />
            </div>

            <div className="form-group">
              <label>How are you feeling? *</label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({...formData, mood: e.target.value})}
                required
              >
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="anxious">😰 Anxious</option>
                <option value="calm">😌 Calm</option>
                <option value="excited">🤩 Excited</option>
                <option value="neutral">😐 Neutral</option>
                <option value="grateful">🙏 Grateful</option>
                <option value="tired">😴 Tired</option>
              </select>
            </div>

            <div className="form-group">
              <label>Your Thoughts *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Write about your day, feelings, observations..."
                rows="8"
                required
              />
            </div>

            <div className="form-group">
              <label>Tags (optional)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="e.g., health, mood, symptoms (comma separated)"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Save Entry</button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {filteredEntries.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} color="#ccc" />
            <p>{searchTerm ? 'No entries found' : 'No journal entries yet'}</p>
            <p className="empty-subtitle">
              {searchTerm ? 'Try a different search term' : 'Start writing your first entry'}
            </p>
          </div>
        ) : (
          <div className="journal-entries">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="journal-entry">
                <div className="entry-header">
                  <div className="entry-title-row">
                    <span className="entry-mood">{getMoodEmoji(entry.mood)}</span>
                    <h3>{entry.title}</h3>
                  </div>
                  <button 
                    onClick={() => handleDelete(entry.id)} 
                    className="delete-btn"
                    aria-label="Delete entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="entry-meta">
                  <span className="entry-date">
                    <Calendar size={14} />
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <p className="entry-content">{entry.content}</p>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="entry-tags">
                    {entry.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🌸</span>
            <span className="footer-name">Aura</span>
          </div>
          <p className="footer-disclaimer">
            Your journal is private and stored locally on your device.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Journal;
