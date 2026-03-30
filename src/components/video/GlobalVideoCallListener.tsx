"use client";

import React, { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import io, { Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { setIncomingCall } from "@/redux/slices/videoCallSlice";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { Phone } from "lucide-react";

export default function GlobalVideoCallListener() {
  const { user, role, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated && user && (role === "user" || role === "company")) {
      if (pathname === "/VideoCall") {
         // Optionally disable the global listener while on the call page 
         // to avoid duplicate signals if the page also joins
      }
      socketRef.current = io(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000");
      
      socketRef.current.emit("join", { userId: user.id, type: role });

      socketRef.current.on("incoming_call", (data: { callerId: string, callerName: string, offer: RTCSessionDescriptionInit }) => {
        if (pathname === "/VideoCall") return;
        console.log("☎️ Incoming call received:", data);
        
        // Store in Redux
        dispatch(setIncomingCall({
           callerId: data.callerId,
           callerName: data.callerName,
           offer: data.offer,
           receiverId: user.id,
           receiverType: role
        }));

        // Play sound
        try {
           const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/1350/1350-preview.mp3");
            audio.play().catch(() => console.warn("Call sound failed"));
         } catch {
            // ignore
         }

        // Immediate Redirect/Notification
        toast.info(
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-black">
               <Phone className="text-green-500 animate-pulse" size={16} />
               <span>Incoming Video Call</span>
            </div>
            <p className="text-xs font-bold text-gray-600">From: {data.callerName}</p>
            <button 
               onClick={() => router.push("/VideoCall")}
               className="mt-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
             >
               Join Now
            </button>
          </div>,
          { 
             autoClose: 10000, 
             closeOnClick: false,
             toastId: "incoming-call-" + data.callerId 
          }
        );

        // User requested: "immediately go to video call page"
        router.push("/VideoCall");
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [isAuthenticated, user, role, dispatch, router, pathname]);

  return null;
}
