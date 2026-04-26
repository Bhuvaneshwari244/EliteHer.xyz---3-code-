import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Save, Trash2, Calendar, Clock, Volume2 } from 'lucide-react';

const VoiceJournal = () => {
  const [entries, setEntries] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('voiceJournalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentTranscript(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      setCurrentTranscript('');
      recognition.start();
      setIsRecording(true);
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const saveEntry = () => {
    if (!currentTranscript.trim()) {
      alert('Please record something before saving!');
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: selectedDate,
      timestamp: new Date().toISOString(),
      text: currentTranscript,
      mood: detectMood(currentTranscript)
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('voiceJournalEntries', JSON.stringify(updatedEntries));
    setCurrentTranscript('');
    alert('Journal entry saved!');
  };

  const detectMood = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.match(/happy|great|wonderful|amazing|excited|joy/)) return 'happy';
    if (lowerText.match(/sad|down|depressed|cry|upset/)) return 'sad';
    if (lowerText.match(/angry|mad|frustrated|annoyed|irritated/)) return 'angry';
    if (lowerText.match(/anxious|worried|nervous|stress|panic/)) return 'anxious';
    if (lowerText.match(/tired|exhausted|sleepy|fatigue/)) return 'tired';
    if (lowerText.match(/pain|hurt|cramp|ache/)) return 'pain';
    return 'neutral';
  };

  const deleteEntry = (id) => {
    if (window.confirm('Delete this journal entry?')) {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      localStorage.setItem('voiceJournalEntries', JSON.stringify(updatedEntries));
    }
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      tired: '😴',
      pain: '😣',
      neutral: '😐'
    };
    return moodMap[mood] || '😐';
  };

  const getMoodColor = (mood) => {
    const colorMap = {
      happy: '#10b981',
      sad: '#3b82f6',
      angry: '#ef4444',
      anxious: '#f59e0b',
      tired: '#8b5cf6',
      pain: '#ec4899',
      neutral: '#6b7280'
    };
    return colorMap[mood] || '#6b7280';
  };

  const filteredEntries = entries.filter(entry => entry.date === selectedDate);

  return (
    <div className="voice-journal-container">
      <div className="voice-journal-header">
        <h2>🎤 Voice Journal</h2>
        <p>Speak your thoughts, we'll capture them</p>
      </div>

      <div className="voice-recording-section">
        <div className="date-selector">
          <Calendar size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="recording-controls">
          {!isRecording ? (
            <button className="record-btn" onClick={startRecording}>
              <Mic size={24} />
              Start Recording
            </button>
          ) : (
            <button className="stop-btn" onClick={stopRecording}>
              <MicOff size={24} />
              Stop Recording
            </button>
          )}
        </div>

        {isRecording && (
          <div className="recording-indicator">
            <div className="pulse-dot"></div>
            <span>Recording...</span>
          </div>
        )}

        {currentTranscript && (
          <div className="transcript-box">
            <h3>Current Transcript:</h3>
            <p>{currentTranscript}</p>
            <button className="save-transcript-btn" onClick={saveEntry}>
              <Save size={18} />
              Save Entry
            </button>
          </div>
        )}
      </div>

      <div className="journal-entries-section">
        <h3>Journal Entries for {new Date(selectedDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</h3>

        {filteredEntries.length === 0 ? (
          <div className="empty-state">
            <Volume2 size={48} />
            <p>No journal entries for this date</p>
            <p className="empty-hint">Start recording to create your first entry!</p>
          </div>
        ) : (
          <div className="entries-list">
            {filteredEntries.map(entry => (
              <div key={entry.id} className="journal-entry-card">
                <div className="entry-header">
                  <div className="entry-mood" style={{ backgroundColor: getMoodColor(entry.mood) }}>
                    <span className="mood-emoji">{getMoodEmoji(entry.mood)}</span>
                    <span className="mood-label">{entry.mood}</span>
                  </div>
                  <div className="entry-time">
                    <Clock size={14} />
                    {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                <div className="entry-text">
                  {entry.text}
                </div>
                <button className="delete-entry-btn" onClick={() => deleteEntry(entry.id)}>
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="voice-journal-tips">
        <h4>💡 Tips for Voice Journaling:</h4>
        <ul>
          <li>Speak clearly and at a normal pace</li>
          <li>Describe your symptoms, mood, and feelings</li>
          <li>Mention any triggers or patterns you notice</li>
          <li>The app will automatically detect your mood from your words</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceJournal;
