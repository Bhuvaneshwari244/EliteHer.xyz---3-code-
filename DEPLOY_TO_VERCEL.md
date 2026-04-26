# Deploy Aura to Vercel - Single Deployment Guide

## Step 1: Push Code to GitHub

Run these commands in your terminal:

```bash
# Initialize git if not already done
git init

# Add the remote repository
git remote add origin https://github.com/Bhuvaneshwari244/Aura.git

# Or if remote already exists, update it
git remote set-url origin https://github.com/Bhuvaneshwari244/Aura.git

# Add all files
git add .

# Commit changes
git commit -m "Configure for single Vercel deployment"

# Push to GitHub (use main or master branch)
git push -u origin main
```

If you get an error about branch name, try:
```bash
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: `Bhuvaneshwari244/Aura`
4. Configure the project:
   - **Project Name**: `aura` (or your choice)
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave as root)
   - **Build Command**: Leave empty (vercel.json handles it)
   - **Output Directory**: Leave empty
   - **Install Command**: Leave empty

5. Add Environment Variables:
   - `JWT_SECRET_KEY` = `your-secure-random-key-here-change-this`
   - `DISABLE_ESLINT_PLUGIN` = `true`
   - `CI` = `false`

6. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Step 3: Verify Deployment

After deployment completes:

1. Visit your Vercel URL (e.g., `https://aura.vercel.app`)
2. You should see the Aura login/register page
3. Test registration and login
4. Check that all features work

## How It Works

The `vercel.json` configuration:
- Builds the Python backend (`backend/app.py`)
- Builds the React frontend (`frontend/`)
- Routes `/api/*` requests to the backend
- Routes all other requests to the frontend
- Supports React Router with SPA routing

## Troubleshooting

### Build Fails?
- Check Vercel build logs
- Ensure `backend/requirements.txt` has all dependencies
- Ensure `frontend/package.json` is correct

### API Not Working?
- Check that routes start with `/api/`
- Verify CORS is configured correctly
- Check Vercel function logs

### Frontend Shows 404?
- Verify `vercel.json` routes are correct
- Check that build output is in `frontend/build/`

### Environment Variables Not Working?
- Redeploy after adding environment variables
- For React, variables must start with `REACT_APP_`

## Configuration Files

All configuration is ready:
- ✅ `vercel.json` - Deployment configuration
- ✅ `frontend/.env.production` - Frontend environment
- ✅ `backend/app.py` - CORS configured for all origins
- ✅ `.gitignore` - Excludes sensitive files

## Post-Deployment

After successful deployment:
1. Update `JWT_SECRET_KEY` in Vercel environment variables
2. Test all features thoroughly
3. Monitor Vercel function logs for any errors
4. Set up custom domain if needed

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Check deployment logs in Vercel dashboard
- Verify all routes work: `/`, `/register`, `/login`, `/dashboard`, `/api/health`
