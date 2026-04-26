import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'te', name: 'తెలుగు' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' },
    { code: 'ru', name: 'Русский' },
    { code: 'it', name: 'Italiano' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Language"
      >
        <Globe size={20} className="language-globe-icon" />
        <span className="language-current">{currentLang.code.toUpperCase()} {currentLang.name}</span>
      </button>

      {isOpen && (
        <>
          <div className="language-overlay" onClick={() => setIsOpen(false)} />
          <div className="language-dropdown">
            <div className="language-dropdown-header">
              <Globe size={18} />
              <span>Select Language</span>
            </div>
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`language-option ${language === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="language-flag">{lang.code.toUpperCase()}</span>
                <span className="language-name">{lang.name}</span>
                {language === lang.code && (
                  <span className="language-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageSelector;
