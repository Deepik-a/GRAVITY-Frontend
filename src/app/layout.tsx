"use client";

import { useAxiosInterceptor } from "@/services/api/useAxiosInterceptor";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useAxiosInterceptor(); // Enables JWT interceptor globally

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
          {/* ToastContainer renders at the root level */}
          <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"/>
      </body>
    </html>
  );
}


