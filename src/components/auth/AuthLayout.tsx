"use client";
import { ReactNode, useEffect, useState } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [hydrated, setHydrated] = useState(false);
  const [role, setRole] = useState<"user" | "company">("user");

  useEffect(() => {
    // After hydration (browser only), read from localStorage
    const storedRole = localStorage.getItem("role") as "user" | "company" | null;
    if (storedRole) {
      setRole(storedRole);
    }
    setHydrated(true);
  }, []);

  // Avoid component rendering on server before localStorage loads
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

          {/* Left Media Section */}
          <div className="md:w-1/2 order-1 flex-shrink-0">
            <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
              {role === "company" ? (
                // Image for company
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/assets/AlternativeSignUpImage.jpg"
                  alt="Company registration illustration"
                  className="w-full h-full object-cover object-center"
                  style={{
                    minHeight: "clamp(500px, 70vh, 700px)",
                    maxHeight: "clamp(700px, 90vh, 1000px)"
                  }}
                />
              ) : (
                // Video for user
                <video
                  className="w-full h-full object-cover object-bottom"
                  style={{
                    minHeight: "clamp(500px, 70vh, 700px)",
                    maxHeight: "clamp(700px, 90vh, 1000px)"
                  }}
                  src="/assets/SignUpBackgroundVideo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/assets/AlternativeSignUpImage.jpg"
                  aria-label="Background video showing platform features"
                />
              )}
            </div>
          </div>

          {/* Right Content Section */}
          <div 
            className="md:w-1/2 order-2 p-10 md:p-12 lg:p-16 bg-white/95 backdrop-blur-sm flex flex-col justify-center"
            style={{
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
