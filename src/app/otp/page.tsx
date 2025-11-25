"use client";
import { useState, useRef, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOtp, resendOtp } from "../../services/authService";
import { toast } from "react-toastify";
import AuthLayout from "../../components/auth/AuthLayout";

export default function OtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(new Array(5).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer effect with persistence
  // Countdown persistence on mount
  useEffect(() => {
    const savedExpireTime = localStorage.getItem("otpExpireTime");

    if (savedExpireTime) {
      // There’s already a timer saved (maybe from resend)
      const remaining = Math.floor(
        (Number(savedExpireTime) - Date.now()) / 1000
      );
      if (remaining > 0) {
        setTimeLeft(remaining);
        setCanResend(false);
        return;
      } else {
        setCanResend(true);
        localStorage.removeItem("otpExpireTime");
      }
    }

    // 🟡 If no timer is saved, this is the FIRST OTP send — set it now!
    const expireTime = Date.now() + 30 * 1000; // 30 seconds
    localStorage.setItem("otpExpireTime", expireTime.toString());
    setTimeLeft(30);
    setCanResend(false);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            localStorage.removeItem("otpExpireTime");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

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
    const pasteArray = pasteData.split("").filter((char) => /^\d$/.test(char));

    if (pasteArray.length > 0) {
      const newOtp = [...otp];
      pasteArray.forEach((char, index) => {
        if (index < 5) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);

      const nextEmptyIndex = pasteArray.length < 5 ? pasteArray.length : 4;
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const getFromLocalStorage = (key: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

const roleFromStorage = getFromLocalStorage("role");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const otpValue = otp.join("");

  // Validate OTP is complete
  if (otpValue.length !== 5) {
    toast.error("Please enter the complete 5-digit OTP");
    return;
  }

  setIsLoading(true);

  try {
    // ⭐ Get purpose and email from localStorage
    const purpose = localStorage.getItem("otpPurpose");
    const emailFromStorage = localStorage.getItem("otpEmail");

    if (!purpose || !emailFromStorage) {
      toast.error("OTP session expired. Please try again.");
      return;
    }

    // Use the stored email instead of any other source
    const emailToVerify = emailFromStorage;

    // Call verifyOtp backend function
    await verifyOtp(emailToVerify, otpValue, purpose);

    if (purpose === "forgot-password") {
      toast.success("✅ OTP verified! You can now reset your password.");
      setTimeout(() => {
        router.push(`/ResetPassword?email=${encodeURIComponent(emailToVerify)}`);
      }, 1500);
    } else if (purpose === "signup") {
     toast.success("✅ Email verified successfully!");
  setTimeout(() => {
    if (roleFromStorage === "company") {
       router.push(`/Company/VerificationPage?email=${encodeURIComponent(emailToVerify)}`);
    } else {
      router.push(
        `/signup?verified=true&email=${encodeURIComponent(emailToVerify)}&show=login`
      );
    }
  }, 1500);
    } else {
      toast.error("Invalid OTP purpose.");
    }
  } catch (error) {
    toast.error((error as Error).message);
  } finally {
    setIsLoading(false);
  }
};


  // When resending OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsResending(true);
    try {
      await resendOtp(email);
      toast.success("📧 OTP resent successfully!");

      const newExpireTime = Date.now() + 60 * 1000; // 60 seconds
      localStorage.setItem("otpExpireTime", newExpireTime.toString());
      setTimeLeft(60);
      setCanResend(false);
      setOtp(new Array(5).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#081C45] to-[#1E40AF] bg-clip-text text-transparent mb-4">
          Verify OTP
        </h2>
        <p className="text-gray-600 mb-2 text-sm">
          Please enter the 5-digit OTP sent to your email.
        </p>
        <p className="text-gray-500 mb-6 text-xs">{email}</p>

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

          {/* Timer and Resend Section */}
          <div className="text-center space-y-4">
            {!canResend ? (
              <p className="text-gray-600 text-sm">
                Resend OTP in{" "}
                <span className="font-semibold text-[#1E40AF]">
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Didn&apos;t receive the code?
              </p>
            )}

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isResending}
              className={`w-full py-3 font-bold rounded-xl shadow-lg transition-all duration-300 ${
                canResend
                  ? "bg-gradient-to-r from-[#EAB308] to-[#FACC15] text-white hover:scale-[1.02] cursor-pointer"
                  : "bg-[#FEF3C7] text-[#A16207] cursor-not-allowed"
              } ${isResending ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
