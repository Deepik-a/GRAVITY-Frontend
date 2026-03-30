"use client";

import React, { Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import VideoCall from "@/components/video/VideoCall";
import { clearIncomingCall } from "@/redux/slices/videoCallSlice";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function VideoCallContent() {
  const { user, role } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const incomingCall = useSelector((state: RootState) => state.videoCall.incomingCall);
  
  // Check if we are starting a call (outbound)
  const targetId = searchParams.get("targetId");
  const targetName = searchParams.get("targetName");
  const targetType = searchParams.get("targetType") || (role === "user" ? "company" : "user");

  const handleClose = () => {
    dispatch(clearIncomingCall());
    router.back();
  };

  if (!user || (!incomingCall && !targetId)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">No active call session found.</p>
          <button onClick={() => router.back()} className="text-blue-500 hover:underline">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <VideoCall
        currentUserId={user.id}
        currentUserType={role as "user" | "company"}
        currentUserName={user.name}
        targetUserId={incomingCall?.callerId || targetId!}
        targetUserType={(incomingCall ? (role === "user" ? "company" : "user") : targetType) as "user" | "company"}
        onClose={handleClose}
        isIncoming={!!incomingCall}
        incomingOffer={incomingCall?.offer}
      />
    </div>
  );
}

export default function VideoCallPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-black flex items-center justify-center">
          <LoadingSpinner size={48} text="Preparing Video Session..." />
       </div>
    }>
      <VideoCallContent />
    </Suspense>
  );
}
