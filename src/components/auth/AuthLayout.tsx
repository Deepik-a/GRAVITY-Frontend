"use client";
import { ReactNode, useEffect, useState } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 font-['Montserrat']"
      style={{
        backgroundImage: "url('/assets/SignUpBackgroundImage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex flex-col md:flex-row">
          {/* 🎥 Left Side - Video */}
          <div className="md:w-1/2 order-1 flex-shrink-0">
            <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
              <video
                className="w-full h-full object-cover object-bottom"
                style={{
                  // Maximum height for video container
                  minHeight: "clamp(500px, 70vh, 700px)",
                  maxHeight: "clamp(700px, 90vh, 1000px)"
                }}
                src="/assets/SignUpBackgroundVideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                poster="/assets/AlternativeSignUpImage.jpg"
              />
            </div>
          </div>

          {/* 🧩 Right Side - Dynamic Page Content */}
          <div 
            className="md:w-1/2 order-2 p-10 md:p-12 lg:p-16 bg-white/95 backdrop-blur-sm flex flex-col justify-center"
            style={{
              // Maximum height for content area
              minHeight: "clamp(600px, 80vh, 900px)"
            }}
          >
            <div className="w-full max-w-md mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}