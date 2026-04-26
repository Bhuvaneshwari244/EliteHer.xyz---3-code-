# Vercel Deployment Fix - Page Not Found Issue

## Problem
Getting "Page not found" error after deploying to Vercel because of conflicting configurations and incorrect project setup.

## Solution: Deploy Frontend and Backend Separately

### Step 1: Deploy Backend First

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your repository
4. Configure the backend project:
   - **Project Name**: `aura-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `pip install -r requirements.txt`

5. Add Environment Variables (if needed):
   - Any variables from `backend/.env`

6. Click "Deploy"
7. **Copy the deployment URL** (e.g., `https://aura-backend.vercel.app`)

### Step 2: Deploy Frontend

1. In Vercel Dashboard, click "Add New Project" again
2. Import the same repository
3. Configure the frontend project:
   - **Project Name**: `aura-frontend` (or your choice)
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. Add Environment Variables:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://aura-backend.vercel.app/api` (use your backend URL from Step 1)
   - **Name**: `DISABLE_ESLINT_PLUGIN`
   - **Value**: `true`
   - **Name**: `CI`
   - **Value**: `false`
   - **Name**: `GENERATE_SOURCEMAP`
   - **Value**: `false`

5. Click "Deploy"

### Step 3: Update Production Environment File

Update `frontend/.env.production` with your actual backend URL:

```env
DISABLE_ESLINT_PLUGIN=true
CI=false
GENERATE_SOURCEMAP=false
REACT_APP_API_URL=https://your-actual-backend-url.vercel.app/api
```

### Step 4: Configure Backend CORS

Make sure your backend allows requests from your frontend domain. Update `backend/app.py` if needed:

```python
from flask_cors import CORS

# Allow your frontend domain
CORS(app, origins=[
    "http://localhost:3000",
    "https://your-frontend-url.vercel.app"
])
```

### Step 5: Redeploy Frontend

After updating the environment variables in Vercel dashboard:
1. Go to your frontend project in Vercel
2. Click "Deployments"
3. Click the three dots on the latest deployment
4. Click "Redeploy"

## Why This Works

1. **Separate Projects**: Frontend and backend are deployed as independent services
2. **Correct Routing**: Each project has its own routing configuration
3. **SPA Support**: The `frontend/vercel.json` rewrites all routes to `index.html` for React Router
4. **Environment Variables**: Frontend knows where to find the backend API

## Testing

1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Try navigating to different pages
3. Test login/register functionality
4. Check browser console for any API errors

## Common Issues

### Still Getting 404?
- Clear browser cache
- Check that `REACT_APP_API_URL` is set correctly in Vercel environment variables
- Verify the backend is deployed and accessible

### API Calls Failing?
- Check CORS configuration in backend
- Verify backend URL in environment variables
- Check backend logs in Vercel dashboard

### Routes Not Working?
- Ensure `frontend/vercel.json` has the rewrite rule
- Check that React Router is properly configured in your app

## Alternative: Single Project Deployment (Not Recommended)

If you must deploy as a single project, you'll need to restructure significantly. The separate deployment approach is cleaner and more maintainable.
