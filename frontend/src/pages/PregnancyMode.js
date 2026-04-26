import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Calendar, Heart, Activity, Bell, Clock, ArrowLeft, Shield, Plus, Trash2, AlertCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

function PregnancyMode() {
  const navigate = useNavigate();
  const [pregnancyData, setPregnancyData] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [contractionTimer, setContractionTimer] = useState({
    active: false,
    contractions: [],
    startTime: null
  });
  const [kickCounter, setKickCounter] = useState({
    date: new Date().toISOString().split('T')[0],
    kicks: 0,
    startTime: null
  });
  const [appointments, setAppointments] = useState([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    type: 'checkup',
    notes: ''
  });

  useEffect(() => {
    loadPregnancyData();
    loadAppointments();
  }, []);

  const loadPregnancyData = () => {
    const saved = localStorage.getItem('pregnancy_data');
    if (saved) {
      setPregnancyData(JSON.parse(saved));
    }
  };

  const loadAppointments = () => {
    const saved = localStorage.getItem('prenatal_appointments');
    if (saved) {
      setAppointments(JSON.parse(saved));
    }
  };

  const savePregnancyData = (data) => {
    setPregnancyData(data);
    localStorage.setItem('pregnancy_data', JSON.stringify(data));
  };

  const saveAppointments = (appts) => {
    setAppointments(appts);
    localStorage.setItem('prenatal_appointments', JSON.stringify(appts));
  };

  const handleSetupPregnancy = (e) => {
    e.preventDefault();
    const form = e.target;
    const lmpDate = new Date(form.lmp.value);
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks

    const data = {
      lmp: form.lmp.value,
      dueDate: dueDate.toISOString().split('T')[0],
      startedAt: new Date().toISOString()
    };
    savePregnancyData(data);
    setShowSetup(false);
  };

  const calculateWeeksAndDays = () => {
    if (!pregnancyData) return { weeks: 0, days: 0 };
    const lmp = new Date(pregnancyData.lmp);
    const today = new Date();
    const diffTime = Math.abs(today - lmp);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    return { weeks, days };
  };

  const getDaysUntilDue = () => {
    if (!pregnancyData) return 0;
    const dueDate = new Date(pregnancyData.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTrimester = (weeks) => {
    if (weeks <= 13) return 1;
    if (weeks <= 27) return 2;
    return 3;
  };

  const getBabyDevelopment = (weeks) => {
    const developments = {
      4: { size: 'Poppy seed', length: '2mm', development: 'Embryo implants in uterus' },
      8: { size: 'Raspberry', length: '1.6cm', development: 'All major organs forming' },
      12: { size: 'Lime', length: '5.4cm', development: 'Can make sucking motions' },
      16: { size: 'Avocado', length: '11.6cm', development: 'Can hear sounds' },
      20: { size: 'Banana', length: '25.6cm', development: 'Can sense light' },
      24: { size: 'Corn', length: '30cm', development: 'Lungs developing' },
      28: { size: 'Eggplant', length: '37.6cm', development: 'Can open eyes' },
      32: { size: 'Squash', length: '42.4cm', development: 'Practicing breathing' },
      36: { size: 'Romaine lettuce', length: '47.4cm', development: 'Gaining weight' },
      40: { size: 'Watermelon', length: '51.2cm', development: 'Ready for birth!' }
    };

    const closest = Object.keys(developments)
      .map(Number)
      .reduce((prev, curr) => 
        Math.abs(curr - weeks) < Math.abs(prev - weeks) ? curr : prev
      );

    return developments[closest];
  };

  // Contraction Timer Functions
  const startContraction = () => {
    setContractionTimer({
      ...contractionTimer,
      active: true,
      startTime: new Date()
    });
  };

  const endContraction = () => {
    if (contractionTimer.startTime) {
      const endTime = new Date();
      const duration = Math.floor((endTime - contractionTimer.startTime) / 1000);
      const newContraction = {
        id: Date.now(),
        startTime: contractionTimer.startTime,
        endTime,
        duration
      };
      
      setContractionTimer({
        active: false,
        contractions: [newContraction, ...contractionTimer.contractions].slice(0, 10),
        startTime: null
      });
    }
  };

  const clearContractions = () => {
    setContractionTimer({
      active: false,
      contractions: [],
      startTime: null
    });
  };

  const getContractionFrequency = () => {
    if (contractionTimer.contractions.length < 2) return null;
    const intervals = [];
    for (let i = 0; i < contractionTimer.contractions.length - 1; i++) {
      const diff = contractionTimer.contractions[i].startTime - contractionTimer.contractions[i + 1].startTime;
      intervals.push(Math.floor(diff / 60000)); // minutes
    }
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return Math.round(avg);
  };

  // Kick Counter Functions
  const addKick = () => {
    const today = new Date().toISOString().split('T')[0];
    if (kickCounter.date !== today) {
      setKickCounter({
        date: today,
        kicks: 1,
        startTime: new Date()
      });
    } else {
      setKickCounter({
        ...kickCounter,
        kicks: kickCounter.kicks + 1,
        startTime: kickCounter.startTime || new Date()
      });
    }
  };

  const resetKicks = () => {
    setKickCounter({
      date: new Date().toISOString().split('T')[0],
      kicks: 0,
      startTime: null
    });
  };

  // Appointment Functions
  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    const newAppt = {
      id: Date.now(),
      ...appointmentForm,
      created_at: new Date().toISOString()
    };
    saveAppointments([...appointments, newAppt]);
    setShowAppointmentForm(false);
    setAppointmentForm({ date: '', time: '', type: 'checkup', notes: '' });
  };

  const deleteAppointment = (id) => {
    if (window.confirm('Delete this appointment?')) {
      saveAppointments(appointments.filter(a => a.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const { weeks, days } = calculateWeeksAndDays();
  const daysUntilDue = getDaysUntilDue();
  const trimester = getTrimester(weeks);
  const babyDev = getBabyDevelopment(weeks);
  const contractionFreq = getContractionFrequency();

  if (!pregnancyData && !showSetup) {
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
              <span className="logo-icon">🤰</span>
              <div>
                <h1 className="logo-title">Pregnancy Mode</h1>
                <p className="logo-subtitle">Track your pregnancy journey</p>
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
          <div className="pregnancy-welcome">
            <Baby size={80} color="#ff6b9d" />
            <h2>Welcome to Pregnancy Mode</h2>
            <p>Track your pregnancy week by week with personalized insights, baby development information, and helpful tools.</p>
            <button onClick={() => setShowSetup(true)} className="btn-primary">
              <Plus size={20} /> Start Pregnancy Tracking
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showSetup) {
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
              <span className="logo-icon">🤰</span>
              <div>
                <h1 className="logo-title">Pregnancy Setup</h1>
                <p className="logo-subtitle">Let's get started</p>
              </div>
            </div>
            <div className="header-actions">
              <ThemeToggle />
              <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </div>
            <LanguageSelector />
          </div>
        </header>

        <div className="page-container">
          <div className="pregnancy-setup-card">
            <h3>Set Up Your Pregnancy</h3>
            <form onSubmit={handleSetupPregnancy}>
              <div className="form-group">
                <label>Last Menstrual Period (LMP) Date</label>
                <input
                  type="date"
                  name="lmp"
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
                <small>This helps us calculate your due date and track your progress</small>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowSetup(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Start Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
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
            <span className="logo-icon">🤰</span>
            <div>
              <h1 className="logo-title">Pregnancy Tracker</h1>
              <p className="logo-subtitle">Week {weeks}, Day {days} • Trimester {trimester}</p>
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
        {/* Pregnancy Overview */}
        <div className="pregnancy-overview">
          <div className="overview-card due-date-card">
            <Calendar size={32} color="#ff6b9d" />
            <div>
              <h4>Due Date</h4>
              <p className="due-date">{new Date(pregnancyData.dueDate).toLocaleDateString()}</p>
              <span className="days-remaining">{daysUntilDue} days to go</span>
            </div>
          </div>

          <div className="overview-card trimester-card">
            <Heart size={32} color="#667eea" />
            <div>
              <h4>Current Progress</h4>
              <p className="week-info">{weeks} weeks, {days} days</p>
              <span className="trimester-info">Trimester {trimester}</span>
            </div>
          </div>
        </div>

        {/* Baby Development */}
        <div className="baby-development-card">
          <div className="dev-header">
            <Baby size={28} color="#10b981" />
            <h3>Baby Development</h3>
          </div>
          <div className="dev-content">
            <div className="dev-size">
              <span className="size-emoji">🍎</span>
              <div>
                <h4>Size: {babyDev.size}</h4>
                <p>Length: {babyDev.length}</p>
              </div>
            </div>
            <div className="dev-milestone">
              <Activity size={20} />
              <p>{babyDev.development}</p>
            </div>
          </div>
        </div>

        {/* Contraction Timer */}
        <div className="contraction-timer-card">
          <div className="timer-header">
            <Clock size={28} color="#f59e0b" />
            <h3>Contraction Timer</h3>
          </div>
          
          <div className="timer-controls">
            {!contractionTimer.active ? (
              <button onClick={startContraction} className="btn-start-contraction">
                Start Contraction
              </button>
            ) : (
              <button onClick={endContraction} className="btn-end-contraction">
                End Contraction
              </button>
            )}
            {contractionTimer.contractions.length > 0 && (
              <button onClick={clearContractions} className="btn-secondary">
                Clear All
              </button>
            )}
          </div>

          {contractionFreq && (
            <div className="contraction-alert">
              <AlertCircle size={20} />
              <p>Average frequency: {contractionFreq} minutes apart</p>
              {contractionFreq < 5 && (
                <span className="alert-warning">⚠️ Contact your healthcare provider</span>
              )}
            </div>
          )}

          {contractionTimer.contractions.length > 0 && (
            <div className="contraction-list">
              <h4>Recent Contractions</h4>
              {contractionTimer.contractions.map((c, index) => (
                <div key={c.id} className="contraction-item">
                  <span className="contraction-number">#{index + 1}</span>
                  <span className="contraction-time">
                    {new Date(c.startTime).toLocaleTimeString()}
                  </span>
                  <span className="contraction-duration">{c.duration}s</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kick Counter */}
        <div className="kick-counter-card">
          <div className="kick-header">
            <Activity size={28} color="#3b82f6" />
            <h3>Kick Counter</h3>
          </div>
          
          <div className="kick-display">
            <span className="kick-count">{kickCounter.kicks}</span>
            <span className="kick-label">kicks today</span>
          </div>

          <div className="kick-controls">
            <button onClick={addKick} className="btn-add-kick">
              <Plus size={20} /> Count Kick
            </button>
            <button onClick={resetKicks} className="btn-secondary">
              Reset
            </button>
          </div>

          <div className="kick-info">
            <AlertCircle size={16} />
            <p>Count 10 kicks in 2 hours. Contact your provider if movements decrease.</p>
          </div>
        </div>

        {/* Prenatal Appointments */}
        <div className="appointments-card">
          <div className="appointments-header">
            <Bell size={28} color="#667eea" />
            <h3>Prenatal Appointments</h3>
            <button onClick={() => setShowAppointmentForm(!showAppointmentForm)} className="btn-primary">
              <Plus size={18} /> Add Appointment
            </button>
          </div>

          {showAppointmentForm && (
            <div className="appointment-form">
              <form onSubmit={handleAppointmentSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={appointmentForm.time}
                      onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={appointmentForm.type}
                    onChange={(e) => setAppointmentForm({...appointmentForm, type: e.target.value})}
                  >
                    <option value="checkup">Regular Checkup</option>
                    <option value="ultrasound">Ultrasound</option>
                    <option value="blood_test">Blood Test</option>
                    <option value="specialist">Specialist Visit</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                    rows="2"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowAppointmentForm(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="appointments-list">
            {appointments.length === 0 ? (
              <p className="empty-message">No appointments scheduled</p>
            ) : (
              appointments
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((appt) => (
                  <div key={appt.id} className="appointment-item">
                    <div className="appt-info">
                      <Calendar size={16} />
                      <span className="appt-date">
                        {new Date(appt.date).toLocaleDateString()} at {appt.time}
                      </span>
                      <span className="appt-type">{appt.type.replace('_', ' ')}</span>
                    </div>
                    {appt.notes && <p className="appt-notes">{appt.notes}</p>}
                    <button onClick={() => deleteAppointment(appt.id)} className="delete-btn">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PregnancyMode;
