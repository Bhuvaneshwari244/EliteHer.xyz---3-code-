# Doctor Consultation - Enhanced Features

## Overview
The Doctor Consultation page includes comprehensive appointment management with payment processing, time slot selection, automatic status updates, and smart reminders.

## Key Features

### 1. Payment Integration
Real doctors charge consultation fees that must be paid during booking:
- **Payment Required**: Users must pay before confirming appointment
- **Multiple Payment Methods**:
  - Credit/Debit Card
  - UPI
  - Net Banking
  - Digital Wallet
- **Secure Processing**: Payment information is encrypted
- **Payment Confirmation**: Receipt shown after successful payment
- **Payment Badge**: Paid status displayed on appointment card

### 2. Time Slot Selection
Doctors have limited availability (not 24/7):
- **Available Hours**: 9:00 AM - 5:00 PM
- **30-Minute Slots**: Appointments every 30 minutes
- **Slot Selection**: Users choose from available time slots
- **No Manual Time Entry**: Prevents booking outside doctor hours

### 3. AI Doctor vs Real Doctor

#### Real Doctor Appointments
- ✅ Paid consultations (fees vary by doctor)
- ✅ Limited time slots (9 AM - 5 PM)
- ✅ Payment required before booking
- ✅ Time-restricted join window
- ✅ Professional medical advice
- ✅ Video or phone call options

#### AI Medical Assistant (Free)
- ✅ Completely FREE
- ✅ Available 24/7
- ✅ No appointment needed
- ✅ Instant responses
- ✅ No payment required
- ✅ Multiple communication options:
  - **Video Call**: Face-to-face AI consultation
  - **Voice Call**: Audio-only AI consultation
  - **Text Chat**: Message-based support
- ✅ General health guidance
- ⚠️ For serious medical issues, consult a real doctor

### 4. Smart Reminder System
Reminders are sent ONLY when appointment time is approaching:
- **1 Hour Before**: First reminder notification
- **15 Minutes Before**: Final reminder notification
- **No Immediate Reminders**: No notifications right after booking
- **One-Time Only**: Each reminder sent only once
- **Browser Notifications**: With user permission
- **In-App Alerts**: Fallback option

### 5. Automatic Status Management
Appointments automatically transition through different statuses:
- **Scheduled**: Initial status when appointment is booked
- **Upcoming**: Shows when appointment is within 1 hour
- **Missed**: Automatically set if appointment time passes by more than 15 minutes without joining
- **Completed**: Manually marked after consultation ends
- **Cancelled**: User-cancelled appointments

### 2. Smart Reminders
The system checks appointments every minute and sends notifications:
- **1 Hour Before**: First reminder notification
- **15 Minutes Before**: Final reminder notification
- Uses browser notifications (with permission) and in-app alerts
- Each reminder is sent only once per appointment

### 3. Time-Window Validation for Joining Calls
Real doctor appointments have time restrictions:
- **Join Window**: 15 minutes before to 15 minutes after scheduled time
- **Button States**:
  - Disabled with "Not Available Yet" before join window
  - Enabled with "Join Call" during join window
  - Automatically marked as "Missed" if not joined within window
- **Countdown Timer**: Shows time remaining until appointment

### 4. AI Chat vs Real Doctor Appointments
Clear distinction between consultation types:

#### AI Medical Assistant (Chat Tab)
- ✅ Always available 24/7
- ✅ Instant responses
- ✅ No time restrictions
- ✅ No appointment needed
- Visual indicator: "● Always Online" badge
- Notice banner explaining AI availability

#### Real Doctor Appointments (Appointments Tab)
- ⏰ Time-restricted based on scheduled appointment
- ⏰ Join window: 15 min before to 15 min after
- ⏰ Automatic status updates
- ⏰ Reminders and notifications
- Shows countdown timer and join availability

### 6. Enhanced Appointment Display
Each appointment card shows:
- Doctor name and specialty
- Date and selected time slot
- Consultation type (video/phone)
- Payment status badge (✓ Paid $XX)
- Status badge with color coding:
  - 🟢 Green: Scheduled
  - 🔵 Blue: Upcoming
  - 🟡 Orange: Missed
  - ⚫ Gray: Completed
  - 🔴 Red: Cancelled
- Countdown timer (for scheduled appointments)
- Join window information
- Reason for consultation

### 7. User Actions
Available actions based on appointment status:

**Scheduled Appointments:**
- Join Call (enabled only during join window)
- Mark Complete (after joining)
- Cancel

**Missed Appointments:**
- Warning message
- Quick link to book new appointment

**Completed Appointments:**
- Confirmation message
- No further actions needed

## Technical Implementation

### Status Update Logic
```javascript
// Runs every minute
- Check all scheduled appointments
- If time passed by >15 minutes → Mark as "Missed"
- If within 1 hour → Show as "Upcoming"
```

### Join Window Validation
```javascript
// Can join if:
- Current time >= (Appointment time - 15 minutes)
- AND Current time <= (Appointment time + 15 minutes)
```

### Reminder System
```javascript
// Checks every minute:
- 1 hour before → Send first reminder
- 15 minutes before → Send final reminder
- Each reminder sent only once (tracked via flags)
```

## User Experience Flow

### Booking Flow
1. Browse available doctors and their fees
2. Click "Book Consultation"
3. Select consultation type (video/phone)
4. Choose date from calendar
5. Select time slot from available options (9 AM - 5 PM)
6. Provide reason for consultation
7. Enter payment details
8. Review total amount
9. Confirm payment and booking
10. Receive booking confirmation
11. Appointment appears in "My Appointments" tab

### Payment Flow
1. Select payment method (Card/UPI/Net Banking/Wallet)
2. Enter payment details based on method:
   - **Card**: Card number, expiry, CVV
   - **UPI**: UPI ID
   - **Net Banking**: Bank selection
   - **Wallet**: Wallet selection
3. Payment processed securely
4. Confirmation message with payment receipt
5. Appointment marked as "Paid"

### Consultation Flow
1. Wait for appointment time (no immediate reminders)
2. Receive 1-hour reminder notification
3. Receive 15-minute reminder notification
4. See countdown timer on appointment card
5. Join button becomes available 15 minutes before
6. Click "Join Call" to start video consultation
7. After consultation, click "Mark Complete"
8. Appointment status updates to "Completed"

### Missed Appointment Flow
1. If join window passes without joining
2. Status automatically changes to "Missed"
3. Warning message displayed
4. Option to book new appointment

### AI Call Flow (FREE)
1. Go to "Chat Support" tab
2. Choose communication method:
   - **Video Call**: Click for face-to-face AI consultation
   - **Voice Call**: Click for audio-only AI consultation
   - **Text Chat**: Type messages for text-based support
3. Instant connection - no waiting
4. Get AI-powered health guidance
5. Available 24/7 with no charges

## Browser Notifications
The system requests notification permission on first reminder:
- If granted: Shows browser notifications
- If denied: Falls back to in-app alerts only
- Notifications include doctor name and time information

## Mobile Responsive
All features work seamlessly on mobile:
- Stacked layouts for better readability
- Touch-friendly buttons
- Responsive countdown timers
- Full-screen chat on mobile devices

## Data Persistence
All appointment data is stored in localStorage:
- Survives page refreshes
- Syncs across tabs
- Includes reminder flags to prevent duplicate notifications
- Status updates persist automatically

## Future Enhancements
Potential improvements for production:
- Backend API integration for real-time updates
- Email/SMS reminders in addition to browser notifications
- Video call integration with WebRTC
- Doctor availability calendar
- Appointment rescheduling
- Payment integration
- Medical records sharing
- Prescription management
