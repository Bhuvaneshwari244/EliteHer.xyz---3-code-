import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shield } from 'lucide-react';
import Navigation from '../components/Navigation';
import { AnimatedBackground } from '../components/AnimatedBackground';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import VoiceSymptomLogger from '../components/VoiceSymptomLogger';
import PainHeatMap from '../components/PainHeatMap';
import HormoneHoroscope from '../components/HormoneHoroscope';
import EmergencyLocator from '../components/EmergencyLocator';
import FertilityWindowCalculator from '../components/FertilityWindowCalculator';
import SupplementTracker from '../components/SupplementTracker';
import BreastSelfExamReminder from '../components/BreastSelfExamReminder';
import PCODDietPlanner from '../components/PCODDietPlanner';
import PCODSymptomTracker from '../components/PCODSymptomTracker';
import PCODExercisePlanner from '../components/PCODExercisePlanner';
import PCODWeightTracker from '../components/PCODWeightTracker';

function AdvancedFeatures() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSymptomLogged = (symptomData) => {
    console.log('Voice symptom logged:', symptomData);
    
    // Save to localStorage in the same format as SymptomLogger
    try {
      const existingSymptoms = JSON.parse(localStorage.getItem('symptoms') || '[]');
      
      // Convert voice symptom format to match SymptomLogger format
      const symptomObject = {};
      symptomData.symptoms.forEach(symptom => {
        // Map symptom names to match SymptomLogger keys
        const symptomKey = symptom.replace(/([A-Z])/g, '_$1').toLowerCase();
        symptomObject[symptomKey] = 5; // Default intensity for voice-logged symptoms
      });
      
      const newSymptom = {
        id: Date.now(),
        date: symptomData.date,
        mood: symptomData.mood,
        energy_level: 'normal',
        pain_level: symptomData.painLevel,
        notes: `🎤 Voice: ${symptomData.notes}`,
        symptoms: symptomObject,
        created_at: new Date().toISOString(),
        loggedVia: 'voice'
      };
      
      existingSymptoms.push(newSymptom);
      localStorage.setItem('symptoms', JSON.stringify(existingSymptoms));
      
      console.log('✅ Symptom saved to localStorage:', newSymptom);
      
      // Show success message with what was detected
      const detectedItems = [];
      if (symptomData.symptoms.length > 0) {
        detectedItems.push(`Symptoms: ${symptomData.symptoms.join(', ')}`);
      }
      if (symptomData.mood !== 'neutral') {
        detectedItems.push(`Mood: ${symptomData.mood}`);
      }
      if (symptomData.painLevel > 0) {
        detectedItems.push(`Pain level: ${symptomData.painLevel}/10`);
      }
      
      if (detectedItems.length > 0) {
        alert(`✅ Symptoms logged successfully!\n\nDetected:\n• ${detectedItems.join('\n• ')}\n\nView in Symptom Logger page`);
      } else {
        alert('✅ Voice note saved!\n\nNo specific symptoms detected, but your note was saved.\n\nView in Symptom Logger page');
      }
      
      // Also try to save to backend if available
      // symptomsAPI.logSymptom(newSymptom).catch(err => console.log('Backend save failed:', err));
      
    } catch (error) {
      console.error('Error saving symptom:', error);
      alert('❌ Error saving symptom. Please try again.');
    }
  };

  const handlePainLogged = (painData) => {
    console.log('Pain map logged:', painData);
    
    // Save to localStorage
    try {
      const existingPainLogs = JSON.parse(localStorage.getItem('painHeatMapData') || '[]');
      const newPainLog = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        ...painData
      };
      
      existingPainLogs.push(newPainLog);
      localStorage.setItem('painHeatMapData', JSON.stringify(existingPainLogs));
      
      console.log('✅ Pain data saved to localStorage:', newPainLog);
      alert('✅ Pain data logged successfully!\n\nView your pain history in the Pain Heat Map section.');
      
    } catch (error) {
      console.error('Error saving pain data:', error);
      alert('❌ Error saving pain data. Please try again.');
    }
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
            <span className="logo-icon">✨</span>
            <div>
              <h1 className="logo-title">Advanced Features</h1>
              <p className="logo-subtitle">Cutting-edge tools for comprehensive health tracking</p>
            </div>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <div className="privacy-badge">
              <Shield size={16} />
              <span>Private & Secure</span>
            </div>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
            <div className="mobile-language-selector">
              <LanguageSelector />
            </div>
          </div>
          <div className="desktop-language-selector">
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="page-container">
        {/* Voice Symptom Logger */}
        <section className="feature-section">
          <VoiceSymptomLogger onSymptomLogged={handleSymptomLogged} />
        </section>

        {/* Pain Heat Map */}
        <section className="feature-section">
          <PainHeatMap onPainLogged={handlePainLogged} />
        </section>

        {/* Hormone Horoscope */}
        <section className="feature-section">
          <HormoneHoroscope />
        </section>

        {/* Fertility Window Calculator */}
        <section className="feature-section">
          <FertilityWindowCalculator />
        </section>

        {/* Emergency Locator */}
        <section className="feature-section">
          <EmergencyLocator />
        </section>

        {/* Supplement Tracker */}
        <section className="feature-section">
          <SupplementTracker />
        </section>

        {/* Breast Self-Exam Reminder */}
        <section className="feature-section">
          <BreastSelfExamReminder />
        </section>

        {/* PCOD Diet Planner */}
        <section className="feature-section">
          <PCODDietPlanner />
        </section>

        {/* PCOD Symptom Tracker */}
        <section className="feature-section">
          <PCODSymptomTracker />
        </section>

        {/* PCOD Exercise Planner */}
        <section className="feature-section">
          <PCODExercisePlanner />
        </section>

        {/* PCOD Weight Tracker */}
        <section className="feature-section">
          <PCODWeightTracker />
        </section>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <span className="footer-logo">🌸</span>
          <p>For informational purposes only. Always consult a healthcare professional for medical advice.</p>
        </div>
      </footer>
    </div>
  );
}

export default AdvancedFeatures;
