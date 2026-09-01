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
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans selection:bg-violet-500 selection:text-white">
        <UserProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
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
