# Quick Firebase Setup - 5 Minutes

## Step 1: Install Firebase CLI (One-time)

```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase

```bash
firebase login
```

## Step 3: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it: `aura-health-tracker`
4. Click through the wizard
5. Copy your project ID

## Step 4: Update Project ID

Edit `.firebaserc` and replace with your actual project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id-here"
  }
}
```

## Step 5: Build Frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

## Step 6: Deploy

```bash
firebase deploy
```

That's it! Your app will be live at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

## Quick Commands

```bash
# Redeploy after changes
cd frontend && npm run build && cd .. && firebase deploy

# Deploy only frontend
firebase deploy --only hosting

# View logs
firebase functions:log
```

## Troubleshooting

**"Project not found"?**
- Update `.firebaserc` with correct project ID
- Run `firebase use --add` and select your project

**Build fails?**
- Make sure you're in the root directory
- Run `cd frontend && npm install && npm run build`

**Functions not working?**
- Check Firebase Console > Functions for errors
- Ensure Python 3.11 is supported in your region
