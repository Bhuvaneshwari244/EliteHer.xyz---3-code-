# 🚀 Deploy Frontend and Backend Separately (RECOMMENDED)

## Why Deploy Separately?

Vercel works best when frontend and backend are deployed as separate projects. This gives you:
- ✅ Better performance
- ✅ Independent scaling
- ✅ Easier debugging
- ✅ Simpler configuration

---

## 📋 Deployment Steps

### STEP 1: Deploy Backend First

1. **Go to Vercel**: https://vercel.com/new

2. **Import Repository**:
   - Click "Import Git Repository"
   - Select: `Bhuvaneshwari244/EliteHer.xyz---2-code-`
   - Branch: `main`

3. **Configure Backend**:
   - **Project Name**: `aura-backend` (or your choice)
   - **Framework Preset**: **Other**
   - **Root Directory**: Click "Edit" → Select **`backend`** ⚠️ IMPORTANT!
   - **Build Command**: Leave EMPTY
   - **Output Directory**: Leave EMPTY

4. **Environment Variables**:
   ```
   JWT_SECRET_KEY = your-super-secret-key-12345
   ```

5. **Click "Deploy"**

6. **Save Backend URL**: After deployment, copy the URL (e.g., `https://aura-backend.vercel.app`)

---

### STEP 2: Deploy Frontend

1. **Go to Vercel Again**: https://vercel.com/new

2. **Import Same Repository**:
   - Click "Import Git Repository"
   - Select: `Bhuvaneshwari244/EliteHer.xyz---2-code-` (same repo)
   - Branch: `main`

3. **Configure Frontend**:
   - **Project Name**: `aura-frontend` (or your choice)
   - **Framework Preset**: **Create React App**
   - **Root Directory**: Click "Edit" → Select **`frontend`** ⚠️ IMPORTANT!
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `build` (auto-filled)

4. **Environment Variables**:
   ```
   REACT_APP_API_URL = https://aura-backend.vercel.app/api
   ```
   ⚠️ Replace with YOUR backend URL from Step 1!

5. **Click "Deploy"**

---

## ✅ After Deployment

### Your URLs:
- **Frontend**: `https://aura-frontend.vercel.app` (your main app)
- **Backend**: `https://aura-backend.vercel.app` (API only)

### Test Your App:
1. Visit your frontend URL
2. Register a new account
3. Login
4. Test features (cycle tracking, symptoms, PCOD assessment)
5. Test language switching

---

## 🔧 Update Backend CORS (IMPORTANT!)

After deploying, you need to update the backend to allow requests from your frontend domain.

### Update backend/app.py:

Find this line:
```python
CORS(app)
```

Replace with:
```python
CORS(app, origins=[
    "https://aura-frontend.vercel.app",  # Your frontend URL
    "http://localhost:3000"  # For local development
])
```

Then commit and push:
```bash
git add backend/app.py
git commit -m "Update CORS for Vercel deployment"
git push origin main
```

Vercel will automatically redeploy the backend.

---

## 🌐 Custom Domain (Optional)

### For Frontend:
1. Go to Vercel Dashboard → aura-frontend project
2. Settings → Domains
3. Add your domain (e.g., `eliteher.xyz`)

### For Backend:
1. Go to Vercel Dashboard → aura-backend project
2. Settings → Domains
3. Add subdomain (e.g., `api.eliteher.xyz`)

Then update frontend environment variable:
```
REACT_APP_API_URL = https://api.eliteher.xyz/api
```

---

## 📊 Project Structure

```
Vercel Project 1: aura-backend
└── Root Directory: backend/
    ├── app.py
    ├── requirements.txt
    ├── routes/
    └── vercel.json

Vercel Project 2: aura-frontend
└── Root Directory: frontend/
    ├── package.json
    ├── src/
    ├── public/
    └── vercel.json
```

---

## 🐛 Troubleshooting

### Frontend can't connect to Backend
**Solution**: 
1. Check `REACT_APP_API_URL` environment variable in frontend
2. Make sure it points to your backend URL
3. Check CORS settings in backend

### Backend API not working
**Solution**:
1. Check Vercel logs: Dashboard → Backend Project → Deployments → View Logs
2. Verify all Python dependencies in `requirements.txt`
3. Check environment variables

### Build Failed
**Solution**:
1. Make sure Root Directory is set correctly
2. Frontend: Root Directory = `frontend`
3. Backend: Root Directory = `backend`

---

## 📝 Quick Reference

### Backend Deployment:
- Root Directory: **`backend`**
- Framework: **Other**
- Build Command: **Empty**
- Env Vars: `JWT_SECRET_KEY`

### Frontend Deployment:
- Root Directory: **`frontend`**
- Framework: **Create React App**
- Build Command: `npm run build`
- Env Vars: `REACT_APP_API_URL` (backend URL)

---

## 🎉 Success Checklist

- [ ] Backend deployed successfully
- [ ] Backend URL saved
- [ ] Frontend deployed successfully
- [ ] Frontend environment variable updated with backend URL
- [ ] CORS updated in backend
- [ ] Can access frontend URL
- [ ] Can register/login
- [ ] API calls working
- [ ] All features functional

---

**This is the recommended approach for Vercel!** 🚀

Each service is deployed independently, making it easier to manage and debug.
