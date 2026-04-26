# Language System Usage Guide

## For End Users

### How to Change Language

1. **Locate the Language Selector**
   - Look for the Globe icon (🌐) in the navigation bar
   - Usually found in the top-right corner or settings area

2. **Open Language Menu**
   - Click on the Globe icon
   - A dropdown menu will appear showing all available languages

3. **Select Your Language**
   - Top 3 options are local languages:
     - తెలుగు (Telugu)
     - हिंदी (Hindi)
     - English
   - Click on your preferred language
   - The app will instantly switch to that language

4. **Automatic Save**
   - Your language choice is saved automatically
   - Next time you open the app, it will remember your preference

### Language Display Format
```
TE తెలుగు          ← Telugu (Local script)
HI हिंदी           ← Hindi (Local script)
EN English         ← English
ES Español         ← Spanish
FR Français        ← French
...and 8 more languages
```

---

## For Developers

### Using Translations in Components

#### 1. Import the Language Hook
```javascript
import { useLanguage } from '../context/LanguageContext';
```

#### 2. Use in Your Component
```javascript
function MyComponent() {
  const { t, language, changeLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.overview')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

#### 3. Translation Key Format
```javascript
t('section.key')

Examples:
t('common.save')           → "Save" / "సేవ్ చేయండి" / "सहेजें"
t('dashboard.welcome')     → "Welcome to Aura" / "ఆరాకు స్వాగతం"
t('symptoms.cramps')       → "Cramps" / "క్రాంప్స్" / "ऐंठन"
```

### Available Translation Sections

```javascript
common          // Buttons, actions, common UI elements
nav             // Navigation menu items
auth            // Login, register, authentication
dashboard       // Dashboard page content
cycles          // Cycle tracking page
symptoms        // Symptom logger page
insights        // Health insights page
wellness        // Wellness hub page
settings        // Settings page
footer          // Footer disclaimers
advanced        // Advanced features page
```

### Adding New Translation Keys

1. **Open translations file**
   ```
   frontend/src/i18n/translations.js
   ```

2. **Add key to ALL languages**
   ```javascript
   te: {
     mySection: {
       myKey: 'తెలుగు వచనం'
     }
   },
   en: {
     mySection: {
       myKey: 'English text'
     }
   },
   hi: {
     mySection: {
       myKey: 'हिंदी पाठ'
     }
   }
   // ... add to all 13 languages
   ```

3. **Use in component**
   ```javascript
   {t('mySection.myKey')}
   ```

### Checking Current Language

```javascript
const { language } = useLanguage();

if (language === 'te') {
  // Telugu-specific logic
} else if (language === 'hi') {
  // Hindi-specific logic
}
```

### Programmatically Changing Language

```javascript
const { changeLanguage } = useLanguage();

// Change to Telugu
changeLanguage('te');

// Change to Hindi
changeLanguage('hi');

// Change to English
changeLanguage('en');
```

### Complete Example Component

```javascript
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function WelcomeMessage() {
  const { t, language } = useLanguage();
  
  return (
    <div className="welcome-section">
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.overview')}</p>
      
      <div className="stats">
        <div className="stat-card">
          <h3>{t('dashboard.nextPeriod')}</h3>
          <p>5 {t('dashboard.daysUntil')}</p>
        </div>
        
        <div className="stat-card">
          <h3>{t('dashboard.healthScore')}</h3>
          <p>85/100</p>
        </div>
      </div>
      
      <button className="primary-button">
        {t('common.save')}
      </button>
      
      <p className="current-lang">
        Current Language: {language.toUpperCase()}
      </p>
    </div>
  );
}

export default WelcomeMessage;
```

### Best Practices

✅ **DO:**
- Always use `t()` function for user-facing text
- Add translations for all 13 languages when adding new keys
- Test with different languages to ensure layout doesn't break
- Use semantic translation keys (e.g., `dashboard.welcome` not `text1`)

❌ **DON'T:**
- Hardcode text strings in components
- Skip languages when adding new keys
- Use translation keys for dynamic data (user names, dates, etc.)
- Forget to handle longer text in some languages

### Testing Your Translations

```javascript
// Test all languages
const languages = ['te', 'hi', 'en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ko', 'ar', 'ru', 'it'];

languages.forEach(lang => {
  changeLanguage(lang);
  console.log(`${lang}: ${t('dashboard.welcome')}`);
});
```

### Fallback Behavior

If a translation key is missing:
```javascript
t('nonexistent.key')  // Returns: 'nonexistent.key'
```

The system returns the key itself, making it easy to spot missing translations.

---

## Language Codes Reference

| Code | Language | Native Name | Script |
|------|----------|-------------|--------|
| te   | Telugu   | తెలుగు      | Telugu |
| hi   | Hindi    | हिंदी       | Devanagari |
| en   | English  | English     | Latin |
| es   | Spanish  | Español     | Latin |
| fr   | French   | Français    | Latin |
| de   | German   | Deutsch     | Latin |
| pt   | Portuguese | Português | Latin |
| zh   | Chinese  | 中文        | Chinese |
| ja   | Japanese | 日本語      | Japanese |
| ko   | Korean   | 한국어      | Hangul |
| ar   | Arabic   | العربية     | Arabic (RTL) |
| ru   | Russian  | Русский     | Cyrillic |
| it   | Italian  | Italiano    | Latin |

---

## Troubleshooting

### Issue: Language not changing
**Solution:** Check browser console for errors, ensure LanguageProvider wraps your app

### Issue: Text showing as keys (e.g., "dashboard.welcome")
**Solution:** Translation key doesn't exist, add it to translations.js

### Issue: Layout breaking with long text
**Solution:** Use CSS `overflow-wrap: break-word` and test with German/Russian

### Issue: Language not persisting
**Solution:** Check localStorage is enabled in browser

---

## Support

For issues or questions about the language system:
1. Check this guide first
2. Review `frontend/src/i18n/translations.js` for available keys
3. Test with different languages to isolate the issue
4. Ensure all components use the `t()` function properly
