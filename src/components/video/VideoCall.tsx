"use client";

import React, { useEffect, useRef, useState } from "react";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Timer, CheckCircle2 } from "lucide-react";
import io, { Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { completeBooking } from "@/services/UserService";

const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

interface VideoCallProps {
  currentUserId: string;
  currentUserType: "user" | "company";
  currentUserName: string;
  targetUserId: string;
  targetUserType: "user" | "company";
  onClose: () => void;
  isIncoming?: boolean;
  incomingOffer?: RTCSessionDescriptionInit | null;
  bookingId?: string;
  scheduledDuration?: number;
}

const VideoCall: React.FC<VideoCallProps> = ({
  currentUserId,
  currentUserType,
  currentUserName,
  targetUserId,
  targetUserType,
  onClose,
  isIncoming = false,
  incomingOffer = null,
  bookingId = null,
  scheduledDuration = null,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState<"calling" | "ringing" | "connected" | "ended">("calling");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const completionRef = useRef(false);
  
  // Set a default duration if none provided (e.g., 30 mins)
  const totalDurationSeconds = (scheduledDuration || 30) * 60;
  const thresholdSeconds = totalDurationSeconds * 0.5;



  const createPeerConnection = React.useCallback((stream: MediaStream) => {
    const pc = new RTCPeerConnection(configuration);
    
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice_candidate", {
          receiverId: targetUserId,
          receiverType: targetUserType,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      // Set remote stream to video element
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current = pc;
    return pc;
  }, [targetUserId, targetUserType]);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000");

    socketRef.current.emit("join", { userId: currentUserId, type: currentUserType });

    const initCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        if (isIncoming) {
          setCallStatus("ringing");
        } else {
          // startCall is now a callback, but we need to pass the stream
          const pc = createPeerConnection(stream);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socketRef.current?.emit("call_user", {
            callerId: currentUserId,
            callerName: currentUserName,
            receiverId: targetUserId,
            receiverType: targetUserType,
            offer,
            bookingId,
            scheduledDuration,
          });
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        toast.error("Could not access camera/microphone");
        onClose();
      }
    };

    initCall();

    socketRef.current.on("call_answered", async (data: { answer: RTCSessionDescriptionInit }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        setCallStatus("connected");
      }
    });

    socketRef.current.on("call_declined", () => {
      toast.info("Call declined");
      setCallStatus("ended");
      setTimeout(onClose, 2000);
    });

    socketRef.current.on("ice_candidate", async (data: { candidate: RTCIceCandidateInit }) => {
      if (peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error("Error adding ice candidate", e);
        }
      }
    });

    socketRef.current.on("call_ended", () => {
      setCallStatus("ended");
      setTimeout(onClose, 2000);
    });

    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
      socketRef.current?.disconnect();
    };
  }, [currentUserId, currentUserType, currentUserName, targetUserId, targetUserType, isIncoming, incomingOffer, onClose, createPeerConnection, bookingId, scheduledDuration]);

  // Timer and Auto-completion Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (callStatus === "connected") {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  useEffect(() => {
    const handleAutoCompletion = async () => {
      if (bookingId && elapsedSeconds >= thresholdSeconds && !completionRef.current) {
        completionRef.current = true;
        try {
          await completeBooking(bookingId);
          console.log("✅ Consultation auto-completed successfully");
          toast.success("Consultation recorded as completed based on call duration.");
        } catch (error) {
          console.error("❌ Failed to auto-complete consultation:", error);
          completionRef.current = false; // allow retry if needed
        }
      }
    };

    handleAutoCompletion();
  }, [elapsedSeconds, bookingId, thresholdSeconds]);

  const progressPercent = Math.min(100, (elapsedSeconds / thresholdSeconds) * 100);
  const isThresholdMet = elapsedSeconds >= thresholdSeconds;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };



  const acceptCall = async () => {
    if (!localStream) return;
    const pc = createPeerConnection(localStream);
    if (!incomingOffer) return;
    await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current?.emit("answer_call", {
      callerId: targetUserId,
      callerType: targetUserType,
      answer,
    });
    setCallStatus("connected");
  };

  const declineCall = () => {
    socketRef.current?.emit("decline_call", {
      callerId: targetUserId,
      callerType: targetUserType,
    });
    onClose();
  };

  const endCall = () => {
    socketRef.current?.emit("end_call", {
      receiverId: targetUserId,
      receiverType: targetUserType,
    });
    onClose();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-md">
      <div className="relative w-full max-w-5xl aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Local Video Preview */}
        <div className="absolute bottom-6 right-6 w-48 aspect-video bg-gray-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl z-10 transition-transform hover:scale-105">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Call UI Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          {callStatus === "ringing" && (
            <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center mb-4 ring-4 ring-indigo-500/50 animate-bounce">
                <Video className="text-white w-12 h-12" />
              </div>
              <h3 className="text-white text-2xl font-black mb-2">Incoming Call</h3>
              <p className="text-gray-300 font-bold">{targetUserType === "company" ? "Company" : "User"} wants to video chat</p>
              
              <div className="flex gap-6 mt-8">
                <button
                  onClick={acceptCall}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                >
                  <Phone className="text-white fill-white" />
                </button>
                <button
                  onClick={declineCall}
                  className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  <PhoneOff className="text-white fill-white" />
                </button>
              </div>
            </div>
          )}

          {callStatus === "calling" && (
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
              <h3 className="text-white text-xl font-bold">Calling...</h3>
            </div>
          )}

          {callStatus === "connected" && (
            <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
              {/* Progress Tracker */}
              {bookingId && (
                <div className="w-full bg-white/10 rounded-full h-2 mb-2 relative overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 transition-all duration-1000 ${isThresholdMet ? 'bg-green-500' : 'bg-indigo-500'}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                  {isThresholdMet && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-green-500/20 animate-pulse" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 text-white/90 text-sm font-bold bg-black/40 px-4 py-2 rounded-full border border-white/10 mb-4">
                <Timer size={16} className={isThresholdMet ? "text-green-500" : "animate-pulse text-indigo-400"} />
                <span>Session Time: {formatTime(elapsedSeconds)}</span>
                {isThresholdMet && bookingId && (
                  <span className="flex items-center gap-1.5 text-green-400 ml-2 border-l border-white/20 pl-4">
                    <CheckCircle2 size={16} />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex justify-center items-center gap-6">
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all hover:scale-110"
              >
                <PhoneOff size={24} fill="currentColor" />
              </button>
            </div>
          </div>
        )}

          {callStatus === "ended" && (
            <div className="flex flex-col items-center mb-8">
              <h3 className="text-white text-2xl font-black">Call Ended</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
