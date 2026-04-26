# Missing Translation Keys - Action Plan

## Current Status
The app has partial translation coverage. Many components have hardcoded English text that needs to be converted to use the `t()` translation function.

## Priority Components to Update

### 1. Navigation.js ✅ Partially Done
Missing keys:
- Health Data Hub
- Health Trackers  
- Pregnancy Mode
- Video Library
- Goals & Achievements

### 2. Dashboard.js
Missing keys:
- "Smart period tracking"
- "Explore More Features"
- "Calendar View"
- "Visual cycle tracking"
- "View detailed analytics and patterns"
- "Tips, reminders & AI chatbot"
- "Voice logger, pain map, horoscope & more"
- "Medication, exercise, sleep, nutrition & more"
- "Loading your health dashboard..."
- "Symptoms, Calendar, Insights & Journal - All in One"

### 3. All Other Pages
Need to audit and add translation keys for:
- Register.js - "Start your health journey today"
- Login.js - "Track your health, predict your future"
- SymptomLogger.js - All form labels and buttons
- Settings.js - All section titles and options
- PCODAssessment.js - Form labels and results
- PregnancyMode.js - All pregnancy-related text
- Journal.js - Form labels
- And many more...

## Solution Approach

Since there are 100+ hardcoded strings across 50+ files, the most efficient approach is:

### Option 1: Comprehensive Update (Recommended)
1. Create a complete translation keys file with ALL missing keys
2. Add keys to Telugu, Hindi, and English translations
3. Update each component file to use t() function
4. Test language switching on each page

### Option 2: Gradual Update
1. Update high-priority pages first (Dashboard, Navigation, Auth)
2. Add remaining pages incrementally
3. Test as we go

## Estimated Translation Keys Needed
- Navigation: +6 keys
- Dashboard: +15 keys  
- Auth pages: +10 keys
- Settings: +30 keys
- Symptom Logger: +20 keys
- PCOD Assessment: +25 keys
- Pregnancy Mode: +40 keys
- Advanced Features: +30 keys
- Other components: +50 keys

**Total: ~226 new translation keys needed**

## Next Steps
1. ✅ Added navigation keys (healthDataHub, healthTrackers, etc.)
2. ✅ Added dashboard keys (exploreMoreFeatures, etc.)
3. ⏳ Need to add same keys to Hindi and English
4. ⏳ Update Navigation.js to use new keys
5. ⏳ Update Dashboard.js to use new keys
6. ⏳ Continue with remaining components

## Time Estimate
- Adding all translation keys: 2-3 hours
- Updating all components: 3-4 hours
- Testing: 1 hour
**Total: 6-8 hours of work**

## Recommendation
Given the scope, I recommend:
1. Complete the high-priority pages NOW (Navigation, Dashboard, Auth)
2. Document the pattern for the team to follow
3. Create a checklist for remaining pages
4. Update incrementally over time

This ensures the most-used pages work perfectly with multi-language while allowing systematic completion of the rest.
