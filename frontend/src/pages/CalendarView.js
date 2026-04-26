import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cyclesAPI, symptomsAPI } from '../services/api';
import { Shield, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

function CalendarView() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cycles, setCycles] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [entryType, setEntryType] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cyclesRes, symptomsRes] = await Promise.all([
        cyclesAPI.getCycles(),
        symptomsAPI.getSymptoms()
      ]);
      setCycles(cyclesRes.data.cycles || []);
      setSymptoms(symptomsRes.data.symptoms || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickEntry = (type) => {
    setEntryType(type);
    setShowQuickEntry(true);
  };

  const saveQuickEntry = async (data) => {
    try {
      const dateStr = selectedDay.toISOString().split('T')[0];
      
      if (entryType === 'period') {
        // Create or update cycle
        await cyclesAPI.createCycle({
          start_date: dateStr,
          flow_intensity: data.flow || 'medium'
        });
      } else {
        // Create or update symptom entry
        await symptomsAPI.createSymptom({
          date: dateStr,
          mood: data.mood || 'neutral',
          pain_level: data.pain_level || 0,
          symptoms: data.symptoms || [],
          notes: data.notes || ''
        });
      }
      
      // Refresh data
      await fetchData();
      setShowQuickEntry(false);
      setEntryType(null);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDayType = (date) => {
    if (!date) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if it's a period day
    for (const cycle of cycles) {
      const startDate = new Date(cycle.start_date);
      const endDate = cycle.end_date ? new Date(cycle.end_date) : null;
      
      if (endDate) {
        if (date >= startDate && date <= endDate) {
          return 'period';
        }
      }
    }
    
    // Check if there are symptoms logged
    const hasSymptoms = symptoms.some(s => s.date === dateStr);
    if (hasSymptoms) return 'symptom';
    
    // Check if it's predicted ovulation (day 14 of cycle)
    for (const cycle of cycles) {
      const startDate = new Date(cycle.start_date);
      const daysSinceStart = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceStart >= 12 && daysSinceStart <= 16) {
        return 'ovulation';
      }
      
      if (daysSinceStart >= 8 && daysSinceStart <= 18) {
        return 'fertile';
      }
    }
    
    return null;
  };

  const getDaySymptoms = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return symptoms.filter(s => s.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading) {
    return <div className="loading">Loading calendar...</div>;
  }

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
            <span className="logo-icon">📅</span>
            <div>
              <h1 className="logo-title">Calendar View</h1>
              <p className="logo-subtitle">Visual cycle tracking</p>
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
        {/* Calendar Header */}
        <div className="calendar-header">
          <button onClick={previousMonth} className="calendar-nav-btn">
            <ChevronLeft size={24} />
          </button>
          <h2 className="calendar-month">{monthName}</h2>
          <button onClick={nextMonth} className="calendar-nav-btn">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Legend */}
        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-color period"></span>
            <span>Period</span>
          </div>
          <div className="legend-item">
            <span className="legend-color ovulation"></span>
            <span>Ovulation</span>
          </div>
          <div className="legend-item">
            <span className="legend-color fertile"></span>
            <span>Fertile Window</span>
          </div>
          <div className="legend-item">
            <span className="legend-color symptom"></span>
            <span>Symptoms Logged</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="calendar-day empty"></div>;
            }
            
            const dayType = getDayType(date);
            const isToday = date.toDateString() === today.toDateString();
            const daySymptoms = getDaySymptoms(date);
            
            return (
              <div
                key={index}
                className={`calendar-day ${dayType || ''} ${isToday ? 'today' : ''}`}
                onClick={() => setSelectedDay(date)}
              >
                <span className="day-number">{date.getDate()}</span>
                {daySymptoms.length > 0 && (
                  <span className="symptom-indicator">{daySymptoms.length}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Day Details */}
        {selectedDay && (
          <div className="day-details">
            <h3>{selectedDay.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            
            {/* Quick Entry Buttons */}
            <div className="quick-entry-buttons">
              <button 
                onClick={() => handleQuickEntry('period')} 
                className="quick-entry-btn period-btn"
              >
                📅 Mark Period Day
              </button>
              <button 
                onClick={() => handleQuickEntry('symptoms')} 
                className="quick-entry-btn symptoms-btn"
              >
                🩺 Log Symptoms
              </button>
              <button 
                onClick={() => handleQuickEntry('mood')} 
                className="quick-entry-btn mood-btn"
              >
                😊 Log Mood
              </button>
              <button 
                onClick={() => handleQuickEntry('notes')} 
                className="quick-entry-btn notes-btn"
              >
                📝 Add Notes
              </button>
            </div>

            {/* Existing Data Display */}
            {getDaySymptoms(selectedDay).length > 0 ? (
              <div className="symptoms-list">
                <h4>Logged Data:</h4>
                {getDaySymptoms(selectedDay).map((symptom, idx) => {
                  // Handle different symptom data structures
                  let symptomList = [];
                  if (symptom.symptoms && Array.isArray(symptom.symptoms)) {
                    symptomList = symptom.symptoms;
                  } else if (symptom.symptoms && typeof symptom.symptoms === 'object') {
                    symptomList = Object.keys(symptom.symptoms);
                  } else {
                    // Extract active symptoms from individual properties
                    Object.keys(symptom).forEach(key => {
                      if (symptom[key] && typeof symptom[key] === 'object' && symptom[key].active) {
                        symptomList.push(key.replace(/_/g, ' '));
                      }
                    });
                  }

                  return (
                    <div key={idx} className="symptom-item">
                      <p><strong>Mood:</strong> {symptom.mood}</p>
                      <p><strong>Pain Level:</strong> {symptom.pain_level}/10</p>
                      {symptomList.length > 0 && (
                        <p><strong>Symptoms:</strong> {symptomList.join(', ')}</p>
                      )}
                      {symptom.notes && <p><strong>Notes:</strong> {symptom.notes}</p>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-data">
                <p>No data logged for this day</p>
                <p className="help-text">Click the buttons above to quickly add data</p>
              </div>
            )}
            
            <div className="day-actions">
              <button 
                onClick={() => navigate('/trackers')} 
                className="btn-primary"
              >
                Open All Trackers
              </button>
              <button 
                onClick={() => setSelectedDay(null)} 
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Quick Entry Modal */}
        {showQuickEntry && (
          <QuickEntryModal 
            type={entryType}
            date={selectedDay}
            onSave={saveQuickEntry}
            onClose={() => {
              setShowQuickEntry(false);
              setEntryType(null);
            }}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🌸</span>
            <span className="footer-name">Aura</span>
          </div>
          <p className="footer-disclaimer">
            For informational purposes only. Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Quick Entry Modal Component
function QuickEntryModal({ type, date, onSave, onClose }) {
  const [formData, setFormData] = useState({
    mood: 'neutral',
    pain_level: 0,
    flow: 'medium',
    symptoms: [],
    notes: ''
  });

  const moodOptions = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
    { value: 'irritated', emoji: '😤', label: 'Irritated' }
  ];

  const symptomOptions = [
    'Cramps', 'Headache', 'Bloating', 'Fatigue', 'Nausea', 
    'Breast Tenderness', 'Acne', 'Food Cravings', 'Mood Swings'
  ];

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="quick-entry-modal-overlay" onClick={onClose}>
      <div className="quick-entry-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {type === 'period' && '📅 Mark Period Day'}
            {type === 'symptoms' && '🩺 Log Symptoms'}
            {type === 'mood' && '😊 Log Mood'}
            {type === 'notes' && '📝 Add Notes'}
          </h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-date">
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>

          {type === 'period' && (
            <div className="form-group">
              <label>Flow Intensity:</label>
              <div className="flow-options">
                {['light', 'medium', 'heavy'].map(flow => (
                  <button
                    key={flow}
                    type="button"
                    className={`flow-btn ${formData.flow === flow ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, flow }))}
                  >
                    {flow.charAt(0).toUpperCase() + flow.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(type === 'symptoms' || type === 'mood') && (
            <>
              <div className="form-group">
                <label>Mood:</label>
                <div className="mood-options">
                  {moodOptions.map(mood => (
                    <button
                      key={mood.value}
                      type="button"
                      className={`mood-btn ${formData.mood === mood.value ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, mood: mood.value }))}
                    >
                      <span className="mood-emoji">{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Pain Level: {formData.pain_level}/10</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.pain_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, pain_level: parseInt(e.target.value) }))}
                  className="pain-slider"
                />
              </div>

              <div className="form-group">
                <label>Symptoms:</label>
                <div className="symptoms-grid">
                  {symptomOptions.map(symptom => (
                    <button
                      key={symptom}
                      type="button"
                      className={`symptom-btn ${formData.symptoms.includes(symptom) ? 'active' : ''}`}
                      onClick={() => handleSymptomToggle(symptom)}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Notes:</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary">Save Entry</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CalendarView;
