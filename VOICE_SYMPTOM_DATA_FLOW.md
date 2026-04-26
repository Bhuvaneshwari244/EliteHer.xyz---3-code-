# 🎤 Voice Symptom Logger - Data Flow

## Complete Journey: From Voice to Storage

### Step-by-Step Data Flow:

```
1. USER SPEAKS
   ↓
2. BROWSER CAPTURES AUDIO (Web Speech API)
   ↓
3. CONVERTS TO TEXT (Speech Recognition)
   ↓
4. PARSES SYMPTOMS (AI Detection)
   ↓
5. SAVES TO LOCALSTORAGE
   ↓
6. (OPTIONAL) SYNCS TO BACKEND
   ↓
7. SHOWS IN SYMPTOM HISTORY
```

---

## 📍 Where Data is Saved

### 1. **LocalStorage** (Primary Storage)
**Location**: Browser's localStorage  
**Key**: `'symptoms'`  
**Format**: JSON array

**Example Data**:
```json
[
  {
    "id": 1703001234567,
    "date": "2026-04-26",
    "symptoms": ["cramps", "headache"],
    "mood": "neutral",
    "painLevel": 5,
    "notes": "I have cramps and a headache",
    "loggedVia": "voice",
    "timestamp": "2026-04-26T10:30:00.000Z"
  }
]
```

### 2. **Backend Database** (Optional)
**When**: If backend API is available  
**Endpoint**: `/api/symptoms` (POST)  
**Purpose**: Cloud backup and sync across devices

---

## 🔍 What Gets Detected

### Symptoms Detected:
- **cramps** → "cramp", "cramping"
- **headache** → "headache", "head pain"
- **bloating** → "bloat"
- **acne** → "acne", "pimple"
- **fatigue** → "tired", "fatigue"
- **backPain** → "back pain", "backache"
- **nausea** → "nausea", "sick"
- **breastTenderness** → "breast tender", "breast sore"

### Mood Detected:
- **happy** → "happy", "good", "great"
- **sad** → "sad", "down", "depressed"
- **anxious** → "anxious", "worried", "nervous"
- **irritable** → "irritable", "angry", "annoyed"

### Pain Level Detected:
- **Numbers**: "pain level 8" → 8/10
- **Words**: 
  - "mild" → 3/10
  - "moderate" → 5/10
  - "severe" → 8/10

---

## 📊 Where You Can View Saved Data

### 1. **Symptom Logger Page**
**Route**: `/symptoms`  
**Shows**: All logged symptoms (manual + voice)  
**Features**: 
- View history
- Filter by date
- See trends
- Export data

### 2. **Health Data Hub**
**Route**: `/health-data`  
**Shows**: Aggregated health data including symptoms  
**Features**:
- Charts and graphs
- Pattern analysis
- Health insights

### 3. **Dashboard**
**Route**: `/dashboard`  
**Shows**: Recent symptoms summary  
**Features**:
- Quick overview
- Recent entries
- Alerts

---

## 💾 Data Storage Details

### LocalStorage Structure:
```javascript
// Key: 'symptoms'
// Value: Array of symptom objects

localStorage.getItem('symptoms')
// Returns: '[{...}, {...}, {...}]'

JSON.parse(localStorage.getItem('symptoms'))
// Returns: Array of symptom objects
```

### Data Persistence:
- ✅ **Survives page refresh**
- ✅ **Survives browser restart**
- ✅ **Stays on device** (privacy-first)
- ❌ **Not synced across devices** (unless backend enabled)
- ❌ **Lost if browser data cleared**

---

## 🔄 Data Sync Flow

### With Backend (Optional):
```
Voice Input
   ↓
LocalStorage (Immediate)
   ↓
Backend API (Async)
   ↓
Database (Cloud)
   ↓
Sync to Other Devices
```

### Without Backend (Current):
```
Voice Input
   ↓
LocalStorage (Immediate)
   ↓
Stays on Device Only
```

---

## 🔐 Privacy & Security

### Data Protection:
- ✅ **Local-first**: Data stays on your device
- ✅ **No cloud by default**: Optional backend sync
- ✅ **Encrypted**: Can be encrypted in localStorage
- ✅ **User control**: Can delete anytime
- ✅ **No tracking**: No analytics on voice data

### Voice Recording:
- ✅ **Not stored**: Audio is NOT saved
- ✅ **Text only**: Only transcribed text is saved
- ✅ **Browser-based**: Uses browser's speech recognition
- ✅ **No server**: Processing happens on your device

---

## 📱 How to Access Your Data

### Method 1: Through UI
1. Go to **Symptom Logger** page
2. View your symptom history
3. See all voice-logged symptoms (marked with 🎤)

### Method 2: Browser Console
```javascript
// View all symptoms
JSON.parse(localStorage.getItem('symptoms'))

// View voice symptoms only
JSON.parse(localStorage.getItem('symptoms'))
  .filter(s => s.loggedVia === 'voice')

// Count total symptoms
JSON.parse(localStorage.getItem('symptoms')).length
```

### Method 3: Export Data
1. Go to **Settings** page
2. Click **Export Data**
3. Download JSON file with all symptoms

---

## 🔧 Technical Implementation

### Files Involved:

**1. VoiceSymptomLogger.js**
- Captures voice input
- Converts speech to text
- Parses symptoms from text
- Calls callback with data

**2. AdvancedFeatures.js**
- Receives symptom data
- Saves to localStorage
- (Optional) Syncs to backend

**3. SymptomLogger.js**
- Displays all symptoms
- Shows voice-logged entries
- Allows editing/deleting

---

## 📈 Data Usage

### Your voice symptoms are used for:
1. **Personal tracking** - View your symptom history
2. **Pattern analysis** - Identify trends over time
3. **Health insights** - Get personalized recommendations
4. **Doctor visits** - Export and share with healthcare providers
5. **Cycle correlation** - See symptoms vs cycle phase

### Your voice symptoms are NOT used for:
- ❌ Marketing or advertising
- ❌ Selling to third parties
- ❌ Training AI models
- ❌ Tracking or profiling

---

## 🎯 Example Complete Flow

### User Action:
```
User says: "I have severe cramps and feeling anxious, pain level 8"
```

### Processing:
```javascript
// 1. Speech Recognition
transcript = "I have severe cramps and feeling anxious, pain level 8"

// 2. Symptom Detection
symptoms = ["cramps"]
mood = "anxious"
painLevel = 8

// 3. Data Object Created
symptomData = {
  symptoms: ["cramps"],
  mood: "anxious",
  painLevel: 8,
  notes: "I have severe cramps and feeling anxious, pain level 8",
  date: "2026-04-26"
}

// 4. Saved to LocalStorage
localStorage.setItem('symptoms', JSON.stringify([
  ...existingSymptoms,
  {
    id: 1703001234567,
    ...symptomData,
    loggedVia: "voice",
    timestamp: "2026-04-26T10:30:00.000Z"
  }
]))

// 5. Success Alert Shown
alert("✅ Symptoms logged successfully!\n\nDetected:\n• Symptoms: cramps\n• Mood: anxious\n• Pain level: 8/10")
```

### Result:
- ✅ Data saved to localStorage
- ✅ Visible in Symptom Logger page
- ✅ Included in health insights
- ✅ Available for export

---

## 🔍 Troubleshooting

### "Where is my data?"
→ Check localStorage: `localStorage.getItem('symptoms')`

### "Can I see voice-logged symptoms separately?"
→ Yes, they have `loggedVia: "voice"` property

### "Is my voice recorded?"
→ No, only the text transcript is saved

### "Can I edit voice-logged symptoms?"
→ Yes, in the Symptom Logger page

### "What if I clear browser data?"
→ Symptoms will be lost (unless backed up to backend)

---

## 💡 Tips

1. **Regular backups**: Export your data regularly
2. **Enable backend sync**: For cross-device access
3. **Speak clearly**: Better recognition = better detection
4. **Use keywords**: Say "cramps", "headache", "pain level X"
5. **Check history**: Verify symptoms were logged correctly

---

**Your voice symptoms are safe, private, and always under your control! 🔒**

*Last Updated: April 26, 2026*
