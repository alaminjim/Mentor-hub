# MentorHub Backend Deployment Guide (Vercel)

This guide outlines the steps to deploy your Node.js/Express backend to **Vercel**.

## 1. Environment Variables Configuration

You must set these variables in the Vercel Dashboard (**Project Settings > Environment Variables**):

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Your PostgreSQL connection string (e.g., Neon/Supabase) |
| `BETTER_AUTH_SECRET` | A long random string (generate one) |
| `BETTER_AUTH_URL` | Your live Vercel backend URL (e.g., `https://mentor-hub-server.vercel.app`) |
| `CLIENT_URL` | Your live Netlify frontend URL |
| `PROD_CLIENT_URL` | Your live Netlify frontend URL |
| `NODE_ENV` | Set to `production` |
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `EMAIL_SENDER_SMTP_HOST` | e.g., `smtp.gmail.com` |
| `EMAIL_SENDER_SMTP_PORT` | e.g., `465` |
| `EMAIL_SENDER_SMTP_USER` | Your email address |
| `EMAIL_SENDER_SMTP_PASS` | Your email app password |
| `EMAIL_SENDER_SMTP_FROM` | `MentorHub <your-email@gmail.com>` |
| `GOOGLE_CLIENT_ID` | For Google Auth |
| `GOOGLE_CLIENT_SECRET` | For Google Auth |

## 2. Deployment Steps

1.  **Push your code** to GitHub.
2.  **Log in to Vercel** and select **Add New > Project**.
3.  **Import your repository**.
4.  **Configure Project**:
    *   **Framework Preset**: Other (it will detect `vercel.json`)
    *   **Root Directory**: `MentorHub_server`
5.  **Add Environment Variables** (as listed above).
6.  **Deploy**.

## 3. Important Note

Vercel will use the `vercel.json` and `api/index.ts` files I created to route all requests to your Express app. The `prisma generate` command will run automatically during the installation phase.

## 4. Final Connection Step

Once Vercel gives you a live URL, update your **Frontend (Netlify)** environment variables:
*   `NEXT_PUBLIC_BACKEND_URL`: Your new Vercel URL.
*   `NEXT_PUBLIC_AUTH_URL`: Your new Vercel URL + `/api/auth`.
*   `BETTER_AUTH_URL`: Your new Vercel URL.
