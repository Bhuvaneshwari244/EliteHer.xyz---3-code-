import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

function VoiceSymptomLogger({ onSymptomLogged }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      // Auto-save after transcription
      setTimeout(() => {
        parseSymptoms(speechResult);
      }, 500);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const parseSymptoms = (text) => {
    const lowerText = text.toLowerCase();
    const symptoms = [];
    let mood = 'neutral';
    let painLevel = 0;

    // Detect symptoms
    if (lowerText.includes('cramp') || lowerText.includes('cramping')) symptoms.push('cramps');
    if (lowerText.includes('headache') || lowerText.includes('head pain')) symptoms.push('headache');
    if (lowerText.includes('bloat')) symptoms.push('bloating');
    if (lowerText.includes('acne') || lowerText.includes('pimple')) symptoms.push('acne');
    if (lowerText.includes('tired') || lowerText.includes('fatigue')) symptoms.push('fatigue');
    if (lowerText.includes('back pain') || lowerText.includes('backache')) symptoms.push('backPain');
    if (lowerText.includes('nausea') || lowerText.includes('sick')) symptoms.push('nausea');
    if (lowerText.includes('breast') && (lowerText.includes('tender') || lowerText.includes('sore'))) symptoms.push('breastTenderness');

    // Detect mood
    if (lowerText.includes('happy') || lowerText.includes('good') || lowerText.includes('great')) mood = 'happy';
    if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) mood = 'sad';
    if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) mood = 'anxious';
    if (lowerText.includes('irritable') || lowerText.includes('angry') || lowerText.includes('annoyed')) mood = 'irritable';

    // Detect pain level
    const painMatch = lowerText.match(/pain (?:level |is )?(\d+)/);
    if (painMatch) {
      painLevel = parseInt(painMatch[1]);
    } else if (lowerText.includes('severe') || lowerText.includes('terrible')) {
      painLevel = 8;
    } else if (lowerText.includes('moderate') || lowerText.includes('medium')) {
      painLevel = 5;
    } else if (lowerText.includes('mild') || lowerText.includes('slight')) {
      painLevel = 3;
    }

    const symptomData = {
      symptoms,
      mood,
      painLevel,
      notes: text,
      date: new Date().toISOString().split('T')[0]
    };

    if (onSymptomLogged) {
      onSymptomLogged(symptomData);
    }
  };

  return (
    <div className="voice-symptom-logger">
      <div className="voice-header">
        <Volume2 size={24} />
        <h3>Voice Symptom Logger</h3>
      </div>
      
      <div className="voice-content">
        <p className="voice-instruction">
          {isListening 
            ? "🎤 Listening... Speak now!" 
            : "Tap the microphone and describe your symptoms"}
        </p>
        
        <button 
          className={`voice-button ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? <MicOff size={48} /> : <Mic size={48} />}
        </button>

        {transcript && (
          <div className="voice-transcript">
            <p><strong>You said:</strong></p>
            <p>"{transcript}"</p>
          </div>
        )}

        <div className="voice-examples">
          <p><strong>Try saying:</strong></p>
          <ul>
            <li>"I have cramps and a headache"</li>
            <li>"Feeling tired and bloated today"</li>
            <li>"Severe back pain, level 8"</li>
            <li>"I'm feeling anxious and have acne"</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .voice-symptom-logger {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin: 20px 0;
        }

        .voice-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          color: #ff6b6b;
        }

        .voice-content {
          text-align: center;
        }

        .voice-instruction {
          font-size: 16px;
          color: #666;
          margin-bottom: 24px;
        }

        .voice-button {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .voice-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
        }

        .voice-button.listening {
          animation: pulse 1.5s infinite;
          background: linear-gradient(135deg, #ee5a6f, #ff6b6b);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .voice-transcript {
          background: #fff5f5;
          border-left: 4px solid #ff6b6b;
          padding: 16px;
          margin: 24px 0;
          text-align: left;
          border-radius: 8px;
        }

        .voice-examples {
          text-align: left;
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-top: 24px;
        }

        .voice-examples ul {
          list-style: none;
          padding: 0;
          margin: 12px 0 0 0;
        }

        .voice-examples li {
          padding: 8px 0;
          color: #666;
        }

        .voice-examples li:before {
          content: "💬 ";
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
}

export default VoiceSymptomLogger;
