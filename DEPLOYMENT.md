# Deployment Guide

This guide details how to deploy the HRMS application. The backend and database will be hosted on **Render**, and the frontend will be hosted on **Vercel**.

## 1. Backend Deployment (Render)

### Step 1: Create a PostgreSQL Database
1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **PostgreSQL**.
3.  **Name**: `hrms-db` (or similar).
4.  **Region**: Choose the one closest to you (e.g., Singapore, Frankfurt).
5.  **Instance Type**: **Free**.
6.  Click **Create Database**.
7.  Once created, copy the **Internal Database URL** (for later if needed) and **External Database URL** (for connecting from your local machine if you want to inspect it). mostly, you will need the connection string provided in the "Connect" dropdown or explicitly shown as `Internal Connection String` for the web service.
    *   *Note: Render creates a `DATABASE_URL` environment variable automatically for linked services.*

### Step 2: Deploy the Web Service (FastAPI)
1.  In Render Dashboard, click **New +** -> **Web Service**.
2.  Connect your GitHub repository `ghans17/HRMS`.
3.  **Name**: `hrms-backend`.
4.  **Region**: Same as your database.
5.  **Branch**: `main`.
6.  **Root Directory**: `backend` (Important! This tells Render where your `main.py` and `requirements.txt` are).
7.  **Runtime**: **Python 3**.
8.  **Build Command**: `pip install -r requirements.txt`.
9.  **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`.
10. **Environment Variables**:
    *   Scroll down to "Environment Variables".
    *   Click **Add from...** -> **DATABASE**, and select the `hrms-db` you just created. This automatically injects `DATABASE_URL`.
    *   Add another variable: `PYTHON_VERSION` = `3.9.0` (Recommended).
11. Click **Create Web Service**.

### Step 3: Verify Backend
Wait for the deployment to finish. Render will provide a URL like `https://hrms-backend.onrender.com`.
Visit `https://hrms-backend.onrender.com/docs` to see if Swagger UI loads.

---

## 2. Frontend Deployment (Vercel)

### Step 1: Create New Project
1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository `ghans17/HRMS`.

### Step 2: Configure Project
1.  **Framework Preset**: Vite (should be auto-detected).
2.  **Root Directory**: Click "Edit" and select `frontend`.
3.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Key: `VITE_API_URL`
    *   Value: The URL of your Render backend (e.g., `https://hrms-backend.onrender.com`). **Do not add a trailing slash**.
4.  Click **Deploy**.

### Step 3: Verify Frontend
Vercel will build and deploy your site. Once done, you will get a URL like `https://hrms-frontend.vercel.app`.
Open it and try to login/load the dashboard.

## 3. Final Checks (Connecting the Dots)

*   **CORS**: If the frontend cannot call the backend (Network Error), check your Backend logs in Render. You might need to update the `allow_origins` in `main.py` if `['*']` was restrictive (though `*` usually works for public). Ideally, set it to your Vercel domain: `['https://hrms-frontend.vercel.app']`.
*   **Database Migrations**:
    *   Render does not automatically run migrations unless you tell it to.
    *   For this simple setup, since we use `Base.metadata.create_all(bind=engine)` in `main.py`, the tables should be created automatically when the app starts.
    *   If using Alembic, you would add `alembic upgrade head` to the **Build Command** (e.g., `pip install -r requirements.txt && alembic upgrade head`).

## Troubleshooting

-   **Frontend shows "Network Error"**: Check the `VITE_API_URL` in Vercel settings. It must match your Render backend URL exactly.
-   **Backend crashes on start**: Check Render logs. Common issues are missing dependencies in `requirements.txt` or incorrect `DATABASE_URL`.
-   **"Method Not Allowed"**: Ensure you aren't mixing up `http` and `https`. Both Vercel and Render use HTTPS.
