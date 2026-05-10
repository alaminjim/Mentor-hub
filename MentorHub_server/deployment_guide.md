# MentorHub Backend Deployment Guide (Render)

This guide outlines the steps to prepare and deploy your Express/Prisma backend to **Render**.

## 1. Environment Variables Configuration

You must set these variables in the Render Dashboard (**Environment** section):

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | The port the server runs on | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | Your production DB URL (Neon/Postgres) | `postgres://user:pass@host/db?sslmode=require` |
| `CLIENT_URL` | Your frontend production URL | `https://your-app.vercel.app` |
| `PROD_CLIENT_URL` | Additional frontend URL (if any) | `https://your-app.vercel.app` |
| `BETTER_AUTH_URL` | The backend base URL | `https://mentor-hub-server.onrender.com` |
| `BETTER_AUTH_SECRET` | A random secure string | `generate_a_random_string` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your_google_client_id` |
| `GOOGLE_CLIENT_SECRET`| Google OAuth Client Secret | `your_google_client_secret` |

> [!IMPORTANT]
> Ensure your `DATABASE_URL` includes `?sslmode=require` if you encounter connection issues on Render.

## 2. Build & Start Settings

Configure these settings in the Render **Settings** tab:

*   **Build Command**: `npm install && npm run build`
*   **Start Command**: `npm start`

## 3. Deployment Steps

1.  **Push your code** to GitHub/GitLab.
2.  **Create a new Web Service** on Render.
3.  **Connect your repository**.
4.  **Add Environment Variables** (see table above).
5.  **Deploy**.

## 4. Post-Deployment Verification

*   Check the Render logs to ensure the database connection is established: `Database connection established`.
*   Visit `https://your-backend.onrender.com/` to see the health check message: `{"message": "SkillBridge API Running"}`.

## 5. Troubleshooting

*   **Prisma Client Error**: If you see "Prisma Client could not find its binary", ensure `npm run build` is running `prisma generate` (which it currently is in your `package.json`).
*   **CORS Error**: Ensure your `CLIENT_URL` in Render matches your frontend URL exactly (no trailing slash).
