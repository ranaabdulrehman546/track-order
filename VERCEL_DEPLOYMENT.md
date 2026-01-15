# Vercel Deployment Guide

This project has been refactored to work with Vercel's serverless architecture.

## Project Structure Changes

- **Express Server**: Moved from `index.js` to `api/index.js` (Vercel serverless entry point)
- **Original `index.js`**: Kept for local development purposes

## Environment Variables

Set these in your Vercel project settings:

1. **MONGO_URI** (or MongoDB_URL): Your MongoDB connection string

   - Vercel standard: `MONGO_URI`
   - Legacy support: `MongoDB_URL` (also works)

2. **FRONTEND_URL** (optional): Your Vercel deployment URL for CORS

## Local Development

### Backend (Local)

```bash
npm run server
```

Runs on `http://localhost:8000` (or PORT from .env)

### Frontend (Local)

```bash
cd view
npm start
```

Runs on `http://localhost:3000`

### API Calls

- **Development**: Frontend uses `http://localhost:8000` for API calls
- **Production**: Frontend uses relative paths `/api/...` which work with Vercel routing

## Deployment to Vercel

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:

   - Go to Project Settings → Environment Variables
   - Add `MONGO_URI` with your MongoDB connection string
   - Optionally add `FRONTEND_URL` with your Vercel deployment URL

4. **Build Configuration**:
   - Vercel will automatically:
     - Build the React app from `view/package.json`
     - Deploy the Express API from `api/index.js` as serverless functions

## How It Works

### Routing

- `/api/*` → Routes to `api/index.js` (Express serverless function)
- `/*` → Routes to React app (`view/build/index.html`)

### API Calls

All API calls from the frontend use:

- Development: `http://localhost:8000/api/...`
- Production: `/api/...` (relative paths work with Vercel routing)

### CORS

CORS is configured to allow:

- `localhost:3000` and `localhost:3001` (development)
- All `*.vercel.app` domains
- Custom `FRONTEND_URL` if set

## Important Notes

1. **MongoDB Connection**: Uses `MONGO_URI` (Vercel standard) or falls back to `MongoDB_URL`
2. **Serverless Functions**: The Express app is deployed as a serverless function, so `app.listen()` is removed
3. **Static Files**: React build output from `view/build` is served as static files
4. **React Router**: All non-API routes are redirected to `index.html` to support client-side routing
