"use client";
import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import AuthLayout from "../../components/auth/AuthLayout";

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    // Handle arrow keys for navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 5);
    const pasteArray = pasteData.split("").filter(char => /^\d$/.test(char));
    
    if (pasteArray.length > 0) {
      const newOtp = [...otp];
      pasteArray.forEach((char, index) => {
        if (index < 5) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      
      // Focus the next empty input or last input
      const nextEmptyIndex = pasteArray.length < 5 ? pasteArray.length : 4;
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    console.log("OTP Submitted:", otpValue);
    // Add your OTP verification logic here
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#081C45] to-[#1E40AF] bg-clip-text text-transparent mb-4">
          Verify OTP
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Please enter the 5-digit OTP sent to your email.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
              ref={(el) => {
  inputRefs.current[index] = el;
}}

                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => 
                  handleKeyDown(index, e)
                }
                onPaste={handlePaste}
                className="w-14 h-14 text-center rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300 text-xl font-bold tracking-widest"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Verify
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}