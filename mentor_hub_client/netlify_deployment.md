# MentorHub Frontend Deployment Guide (Netlify)

This guide outlines the steps to deploy your Next.js frontend to **Netlify**.

## 1. Environment Variables Configuration

You must set these variables in the Netlify Dashboard (**Site Settings > Build & deploy > Environment**):

| Variable | Description | Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_BACKEND_URL` | Your live Render backend URL | `https://mentor-hub-server-tov4.onrender.com` |
| `NEXT_PUBLIC_AUTH_URL` | Your backend auth endpoint | `https://mentor-hub-server-tov4.onrender.com/api/auth` |
| `NEXT_PUBLIC_APP_URL` | Your live Netlify frontend URL | `https://your-app.netlify.app` |
| `BETTER_AUTH_URL` | The backend auth base URL | `https://mentor-hub-server-tov4.onrender.com` |

## 2. Build Settings

You MUST configure these in the Netlify Dashboard:

*   **Base Directory**: `mentor_hub_client` (Crucial! Your frontend is in this subfolder)
*   **Build Command**: `npm run build`
*   **Publish Directory**: `.next` (Standard for Next.js)

## 3. Deployment Steps

1.  **Push your code** to GitHub/GitLab.
2.  **Log in to Netlify** and select **Add new site > Import an existing project**.
3.  **Choose your repository**.
4.  **Add Environment Variables** (as listed above).
5.  **Deploy site**.

## 4. Final Connection Step

Once Netlify gives you a live URL (e.g., `https://mentor-hub.netlify.app`), go back to your **Render Backend Dashboard** and update the following variables:

*   `CLIENT_URL`: `https://mentor-hub.netlify.app`
*   `PROD_CLIENT_URL`: `https://mentor-hub.netlify.app` (optional, same as above)

> [!TIP]
> After updating these variables in Render, the backend will restart, and your frontend will be able to communicate with it without CORS issues.
