# Vercel Deployment Guide for Aura App

## ✅ Files Created for Deployment

1. **vercel.json** - Main configuration file for Vercel
2. **.vercelignore** - Files to ignore during deployment
3. **frontend/.vercelignore** - Frontend-specific ignore file
4. **frontend/package.json** - Updated with vercel-build script

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/new

2. **Import Git Repository**:
   - Click "Import Git Repository"
   - Select: `Bhuvaneshwari244/EliteHer.xyz---2-code-`
   - Branch: `main`

3. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: Leave empty (vercel.json handles this)
   - **Output Directory**: Leave empty (vercel.json handles this)

4. **Environment Variables** (Add these in Vercel Dashboard):
   ```
   REACT_APP_API_URL=/api
   JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
   ```

5. **Click "Deploy"**

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## 📋 Important Configuration Details

### vercel.json Structure

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/app.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/app.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/build/index.html"
    }
  ]
}
```

### How It Works

1. **Backend**: Python Flask app deployed as serverless functions
   - All `/api/*` routes go to `backend/app.py`
   - Uses `@vercel/python` builder

2. **Frontend**: React app built and served as static files
   - Built using `react-scripts build`
   - Served from `frontend/build/` directory
   - All other routes serve `index.html` (for React Router)

## 🔧 Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_URL` | `/api` | API base URL for frontend |
| `JWT_SECRET_KEY` | `your-secret-key` | JWT secret for authentication |

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution**: Check that all dependencies are listed in:
- `frontend/package.json`
- `backend/requirements.txt`

### Issue: API Routes Not Working

**Solution**: Ensure all API routes start with `/api/` prefix

### Issue: Frontend Not Loading

**Solution**: 
1. Check that `frontend/build` directory is created
2. Verify `vercel-build` script in `package.json`
3. Check Vercel build logs

### Issue: CORS Errors

**Solution**: Backend already has CORS enabled in `app.py`:
```python
CORS(app)
```

## 📱 After Deployment

1. **Test the Application**:
   - Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Test registration and login
   - Test all features

2. **Custom Domain** (Optional):
   - Go to Vercel Dashboard → Project → Settings → Domains
   - Add your custom domain (e.g., `eliteher.xyz`)

3. **Monitor Logs**:
   - Vercel Dashboard → Project → Deployments → View Logs

## 🎯 Production Checklist

- [ ] All environment variables set in Vercel
- [ ] JWT_SECRET_KEY changed from default
- [ ] Test registration and login
- [ ] Test PCOD assessment
- [ ] Test all 12 languages
- [ ] Test advanced features
- [ ] Check mobile responsiveness
- [ ] Monitor error logs

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Repository**: https://github.com/Bhuvaneshwari244/EliteHer.xyz---2-code-

## 📊 Expected Deployment Time

- **Frontend Build**: ~2-3 minutes
- **Backend Deploy**: ~30 seconds
- **Total**: ~3-4 minutes

## ✨ Features Deployed

- ✅ 94+ features
- ✅ 12 languages (English, Hindi, Spanish, French, German, Portuguese, Chinese, Japanese, Korean, Arabic, Russian, Italian)
- ✅ PCOD risk assessment with ML
- ✅ Advanced health tracking
- ✅ Real-time predictions
- ✅ Multi-theme support
- ✅ Responsive design

---

**Note**: The first deployment might take longer as Vercel sets up the project. Subsequent deployments will be faster.
