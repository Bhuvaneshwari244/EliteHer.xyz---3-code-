# Deploy Aura to Firebase - Complete Guide

## Prerequisites

1. Install Node.js (if not already installed)
2. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

## Step 1: Build the Frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

## Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for you to login with your Google account.

## Step 3: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `aura-health-tracker` (or your choice)
4. Follow the setup wizard
5. Enable Google Analytics (optional)
6. Click "Create project"

## Step 4: Initialize Firebase in Your Project

```bash
# Link to your Firebase project
firebase use --add
```

Select your project from the list and give it an alias (e.g., "default")

## Step 5: Update .firebaserc

Update the `.firebaserc` file with your actual project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 6: Deploy to Firebase

```bash
# Deploy everything (hosting + functions)
firebase deploy
```

Or deploy separately:

```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions
```

## Step 7: Set Environment Variables (Optional)

If you need environment variables for your backend:

```bash
firebase functions:config:set jwt.secret="your-secret-key-here"
```

## Your App URLs

After deployment:
- **Hosting URL**: `https://your-project-id.web.app`
- **Functions URL**: `https://us-central1-your-project-id.cloudfunctions.net/api`

## Testing

1. Visit your hosting URL
2. Try registering and logging in
3. Test all features

## Troubleshooting

### Build Fails?
```bash
cd frontend
npm install
npm run build
```

### Functions Not Working?
- Check Firebase Console > Functions for logs
- Ensure all dependencies are in `functions/requirements.txt`
- Check CORS settings in `backend/app.py`

### Frontend Shows Blank Page?
- Check browser console for errors
- Verify `frontend/build` directory exists
- Run `firebase deploy --only hosting` again

## Update Deployment

When you make changes:

```bash
# Rebuild frontend
cd frontend
npm run build
cd ..

# Redeploy
firebase deploy
```

## Alternative: Simple Hosting Only (No Backend Functions)

If you want to deploy only the frontend and use a separate backend:

1. Update `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

2. Build frontend:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

3. Deploy only hosting:
   ```bash
   firebase deploy --only hosting
   ```

## Cost

Firebase has a generous free tier:
- Hosting: 10 GB storage, 360 MB/day transfer
- Functions: 2M invocations/month, 400K GB-seconds/month

Your app should easily fit within the free tier for development and moderate usage.

## Next Steps

1. Set up custom domain (optional)
2. Enable Firebase Authentication (optional)
3. Add Firebase Analytics (optional)
4. Set up CI/CD with GitHub Actions (optional)

## Commands Reference

```bash
# Login
firebase login

# Initialize project
firebase init

# Deploy everything
firebase deploy

# Deploy hosting only
firebase deploy --only hosting

# Deploy functions only
firebase deploy --only functions

# View logs
firebase functions:log

# Open Firebase console
firebase open
```
