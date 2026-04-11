import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MentorHub | Elevate Your Learning with Expert Mentors",
  description: "Join MentorHub to connect with world-class tutors, track your progress, and achieve your educational goals with personalized mentoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-white text-gray-900 selection:bg-sky-100 selection:text-sky-900`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

