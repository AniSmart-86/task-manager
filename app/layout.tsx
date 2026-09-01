import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import UserProvider from "@/context/UserContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskPiloter - Modern Enterprise Task Management Platform",
  description: "Accelerate teamwork and streamline project execution with real-time status tracking, role-based controls, and automated Excel reporting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0b0f19] text-slate-100 font-sans selection:bg-violet-500 selection:text-white">
        <UserProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(15, 23, 42, 0.95)",
                color: "#f8fafc",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                fontSize: "13px",
              },
            }}
          />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
