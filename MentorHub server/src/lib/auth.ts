import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { emailOTP } from "better-auth/plugins";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SENDER_SMTP_HOST,
  port: parseInt(process.env.EMAIL_SENDER_SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER_SMTP_USER,
    pass: process.env.EMAIL_SENDER_SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.APP_URL || process.env.BETTER_AUTH_URL || "https://mentor-hub-server.vercel.app",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL!,
    process.env.APP_URL!,
    process.env.PROD_APP_URL!,
    "https://mentor-hub-client-seven.vercel.app",
    "https://mentor-hub-server.vercel.app",
  ].filter(Boolean),
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
          await transporter.sendMail({
            from: process.env.EMAIL_SENDER_SMTP_FROM,
            to: email,
            subject: type === "forget-password" ? "Reset Your MentorHub Password" : "Verify Your MentorHub Account",
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
                <h1 style="color: #0ea5e9;">MentorHub Security</h1>
                <p>You requested an OTP for ${type.replace("-", " ")}.</p>
                <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0369a1;">
                  ${otp}
                </div>
                <p style="color: #64748b; font-size: 14px; margin-top: 20px;">This OTP will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
              </div>
            `,
          });
      },
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        input: true,
      },
      status: {
        type: "string",
        defaultValue: "UnBAN",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});
