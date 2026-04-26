import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Heart, AlertCircle, Pill, Clock, Check, X } from 'lucide-react';

function SmartReminders() {
  const [reminders, setReminders] = useState([]);
  const [settings, setSettings] = useState({
    periodReminder: true,
    periodDaysBefore: 2,
    ovulationReminder: true,
    fertileWindowReminder: true,
    pmsReminder: true,
    pmsDaysBefore: 3,
    medicationReminders: [],
    reminderTime: '09:00'
  });

  useEffect(() => {
    loadSettings();
    generateReminders();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('reminderSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('reminderSettings', JSON.stringify(newSettings));
    generateReminders();
  };

  const generateReminders = () => {
    const cycles = JSON.parse(localStorage.getItem('cycles') || '[]');
    if (cycles.length === 0) return;

    const sortedCycles = cycles.sort((a, b) => 
      new Date(b.start_date) - new Date(a.start_date)
    );
    const lastCycle = sortedCycles[0];
    const lastStartDate = new Date(lastCycle.start_date);
    
    // Calculate average cycle length
    let avgCycleLength = 28;
    if (sortedCycles.length > 1) {
      let totalLength = 0;
      for (let i = 0; i < sortedCycles.length - 1; i++) {
        const current = new Date(sortedCycles[i].start_date);
        const next = new Date(sortedCycles[i + 1].start_date);
        totalLength += Math.ceil((current - next) / (1000 * 60 * 60 * 24));
      }
      avgCycleLength = Math.round(totalLength / (sortedCycles.length - 1));
    }

    const today = new Date();
    const newReminders = [];

    // Period reminder
    if (settings.periodReminder) {
      const nextPeriod = new Date(lastStartDate);
      nextPeriod.setDate(nextPeriod.getDate() + avgCycleLength);
      const daysUntil = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= settings.periodDaysBefore && daysUntil > 0) {
        newReminders.push({
          id: 'period',
          type: 'period',
          title: 'Period Starting Soon',
          message: `Your period is expected in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`,
          priority: 'high',
          icon: Calendar,
          color: '#ff6b9d',
          daysUntil
        });
      }
    }

    // Ovulation reminder
    if (settings.ovulationReminder) {
      const ovulationDate = new Date(lastStartDate);
      ovulationDate.setDate(ovulationDate.getDate() + 14);
      const daysToOvulation = Math.ceil((ovulationDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysToOvulation === 1) {
        newReminders.push({
          id: 'ovulation',
          type: 'ovulation',
          title: 'Ovulation Tomorrow',
          message: 'Your most fertile day is coming up',
          priority: 'high',
          icon: Heart,
          color: '#10b981',
          daysUntil: 1
        });
      } else if (daysToOvulation === 0) {
        newReminders.push({
          id: 'ovulation-today',
          type: 'ovulation',
          title: 'Ovulation Day',
          message: 'Today is your peak fertility day',
          priority: 'high',
          icon: Heart,
          color: '#10b981',
          daysUntil: 0
        });
      }
    }

    // Fertile window reminder
    if (settings.fertileWindowReminder) {
      const fertileStart = new Date(lastStartDate);
      fertileStart.setDate(fertileStart.getDate() + 9);
      const fertileEnd = new Date(lastStartDate);
      fertileEnd.setDate(fertileEnd.getDate() + 14);
      
      if (today >= fertileStart && today <= fertileEnd) {
        newReminders.push({
          id: 'fertile-window',
          type: 'fertile',
          title: 'Fertile Window',
          message: 'You are in your fertile window',
          priority: 'medium',
          icon: Heart,
          color: '#f59e0b',
          daysUntil: 0
        });
      }
    }

    // PMS reminder
    if (settings.pmsReminder) {
      const nextPeriod = new Date(lastStartDate);
      nextPeriod.setDate(nextPeriod.getDate() + avgCycleLength);
      const daysUntil = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= settings.pmsDaysBefore && daysUntil > 0) {
        newReminders.push({
          id: 'pms',
          type: 'pms',
          title: 'PMS May Start Soon',
          message: 'Be prepared for PMS symptoms in the coming days',
          priority: 'medium',
          icon: AlertCircle,
          color: '#667eea',
          daysUntil
        });
      }
    }

    setReminders(newReminders);
  };

  const dismissReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const addMedicationReminder = () => {
    const newMed = {
      id: Date.now(),
      name: '',
      time: '09:00',
      enabled: true
    };
    saveSettings({
      ...settings,
      medicationReminders: [...settings.medicationReminders, newMed]
    });
  };

  const updateMedicationReminder = (id, field, value) => {
    const updated = settings.medicationReminders.map(med =>
      med.id === id ? { ...med, [field]: value } : med
    );
    saveSettings({ ...settings, medicationReminders: updated });
  };

  const deleteMedicationReminder = (id) => {
    const updated = settings.medicationReminders.filter(med => med.id !== id);
    saveSettings({ ...settings, medicationReminders: updated });
  };

  return (
    <div className="smart-reminders-card">
      <div className="reminders-header">
        <Bell size={28} />
        <div>
          <h3>Smart Reminders</h3>
          <p className="reminders-subtitle">Stay on top of your cycle</p>
        </div>
      </div>

      {/* Active Reminders */}
      {reminders.length > 0 && (
        <div className="active-reminders">
          <h4>Active Reminders</h4>
          <div className="reminders-list">
            {reminders.map((reminder) => {
              const Icon = reminder.icon;
              return (
                <div key={reminder.id} className={`reminder-item reminder-${reminder.priority}`}>
                  <div className="reminder-icon" style={{ color: reminder.color }}>
                    <Icon size={24} />
                  </div>
                  <div className="reminder-content">
                    <h4>{reminder.title}</h4>
                    <p>{reminder.message}</p>
                  </div>
                  <button 
                    className="dismiss-btn"
                    onClick={() => dismissReminder(reminder.id)}
                    title="Dismiss"
                  >
                    <X size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reminder Settings */}
      <div className="reminder-settings">
        <h4>Reminder Settings</h4>
        
        <div className="setting-item">
          <div className="setting-header">
            <label>
              <input
                type="checkbox"
                checked={settings.periodReminder}
                onChange={(e) => saveSettings({ ...settings, periodReminder: e.target.checked })}
              />
              <span>Period Start Reminder</span>
            </label>
          </div>
          {settings.periodReminder && (
            <div className="setting-detail">
              <label>Remind me</label>
              <select
                value={settings.periodDaysBefore}
                onChange={(e) => saveSettings({ ...settings, periodDaysBefore: parseInt(e.target.value) })}
              >
                <option value="1">1 day before</option>
                <option value="2">2 days before</option>
                <option value="3">3 days before</option>
                <option value="5">5 days before</option>
              </select>
            </div>
          )}
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.ovulationReminder}
              onChange={(e) => saveSettings({ ...settings, ovulationReminder: e.target.checked })}
            />
            <span>Ovulation Reminder</span>
          </label>
        </div>

        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.fertileWindowReminder}
              onChange={(e) => saveSettings({ ...settings, fertileWindowReminder: e.target.checked })}
            />
            <span>Fertile Window Notification</span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-header">
            <label>
              <input
                type="checkbox"
                checked={settings.pmsReminder}
                onChange={(e) => saveSettings({ ...settings, pmsReminder: e.target.checked })}
              />
              <span>PMS Warning</span>
            </label>
          </div>
          {settings.pmsReminder && (
            <div className="setting-detail">
              <label>Remind me</label>
              <select
                value={settings.pmsDaysBefore}
                onChange={(e) => saveSettings({ ...settings, pmsDaysBefore: parseInt(e.target.value) })}
              >
                <option value="2">2 days before</option>
                <option value="3">3 days before</option>
                <option value="5">5 days before</option>
                <option value="7">7 days before</option>
              </select>
            </div>
          )}
        </div>

        <div className="setting-item">
          <label>Default Reminder Time</label>
          <input
            type="time"
            value={settings.reminderTime}
            onChange={(e) => saveSettings({ ...settings, reminderTime: e.target.value })}
          />
        </div>
      </div>

      {/* Medication Reminders */}
      <div className="medication-reminders">
        <div className="section-header">
          <h4>Medication Reminders</h4>
          <button className="btn-add" onClick={addMedicationReminder}>
            <Pill size={16} /> Add Medication
          </button>
        </div>

        {settings.medicationReminders.length === 0 ? (
          <p className="empty-message">No medication reminders set</p>
        ) : (
          <div className="medication-list">
            {settings.medicationReminders.map((med) => (
              <div key={med.id} className="medication-reminder-item">
                <input
                  type="checkbox"
                  checked={med.enabled}
                  onChange={(e) => updateMedicationReminder(med.id, 'enabled', e.target.checked)}
                />
                <input
                  type="text"
                  placeholder="Medication name"
                  value={med.name}
                  onChange={(e) => updateMedicationReminder(med.id, 'name', e.target.value)}
                  className="med-name-input"
                />
                <div className="time-input-wrapper">
                  <Clock size={16} />
                  <input
                    type="time"
                    value={med.time}
                    onChange={(e) => updateMedicationReminder(med.id, 'time', e.target.value)}
                  />
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteMedicationReminder(med.id)}
                  title="Delete"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reminder-info">
        <AlertCircle size={16} />
        <p>Reminders are based on your cycle history and predictions. Enable browser notifications for alerts.</p>
      </div>
    </div>
  );
}

export default SmartReminders;
