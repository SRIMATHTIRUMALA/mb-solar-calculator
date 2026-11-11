# Deployment Guide — MB Solar Hub Calculator

This guide provides instructions for deploying the **MB Solar Hub Solar Rooftop Calculator** to production cloud platforms.

---

## 1. Backend Deployment (Render / Railway / AWS / DigitalOcean)

### Render Setup
1. Create a new **Web Service** on Render.
2. Connect your Git repository.
3. Configure the service:
   * **Root Directory:** `backend`
   * **Environment:** `Python 3`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   * `PYTHON_VERSION`: `3.12.0` (or `3.13.0`)
   * `CORS_ORIGINS`: `https://your-frontend-domain.vercel.app,https://mbsolarhub.com`

---

## 2. Frontend Deployment (Vercel / Netlify)

### Vercel Setup
1. Create a new project on Vercel.
2. Select your repository.
3. Set **Root Directory** to `frontend`.
4. Build & Output Settings:
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Configure API Proxy / Rewrite in `vercel.json` (or set environment variable `VITE_API_BASE_URL` pointing to your deployed backend URL).

Example `frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-api.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 3. Production Verification Checklist

- [ ] Backend health endpoint `GET /api/health` returns status `healthy`.
- [ ] Swagger API documentation is active at `/docs`.
- [ ] Frontend successfully communicates with backend without CORS errors.
- [ ] Sizing and subsidy results correctly calculate for all 36 states.
- [ ] Dynamic slider smoothly recalculates between 1 kW and 100 kW.
- [ ] Audio synthesis speaks correctly on English and Hindi toggles.
- [ ] Aggregator vendor modal successfully captures leads.
- [ ] Responsive layout verified on mobile, tablet, and desktop screens.

