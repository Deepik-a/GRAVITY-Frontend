"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, CreditCard, Calendar, RefreshCcw, AlertCircle, Info, X } from "lucide-react";
import notificationService, { INotification } from "@/services/NotificationService";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import chatService from "@/services/ChatService";

interface NotificationBellProps {
  currentUser: {
    id: string;
    role: "user" | "company";
  };
  scrolled?: boolean;
}

export default function NotificationBell({ currentUser, scrolled }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Fetch existing notifications
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        // The backend now filters by recipientType based on the X-Role header
        setNotifications(data);
        setUnreadCount(data.filter((n: INotification) => !n.isRead).length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (currentUser?.id) {
      fetchNotifications();

      // 2. Connect socket if not already connected
      // This now joins a room named `${role}:${id}` preventing cross-role notifications
      chatService.connect(currentUser.id, currentUser.role);

      // 3. Listen for real-time notifications
      notificationService.onNotification((notification: INotification) => {
        // Only show if it matches current role (redundant safety check)
        if (notification.recipientType === currentUser.role) {
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          // Sound the notification (ring)
          try {
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audio.play().catch(e => console.warn("Audio play failed, likely gesture required", e));
          } catch (e) {
            console.warn("Audio play error", e);
          }

          // Show toast for new notification
          toast.info(notification.title, {
            onClick: () => setIsOpen(true),
            icon: <Bell className="text-blue-500" />
          });
        }
      });
    }

    return () => {
      notificationService.offNotification();
    };
  }, [currentUser]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getNotificationIcon = (type: string, isRead: boolean) => {
    const baseClass = `p-2 rounded-xl shrink-0 ${!isRead ? "bg-opacity-100" : "bg-opacity-10 opacity-60"}`;
    
    switch (type) {
      case "PAYMENT_SUCCESS":
      case "SUBSCRIPTION_SUCCESS":
        return (
          <div className={`${baseClass} bg-green-100 text-green-600`}>
            <CreditCard size={18} />
          </div>
        );
      case "NEW_BOOKING":
        return (
          <div className={`${baseClass} bg-blue-100 text-blue-600`}>
            <Calendar size={18} />
          </div>
        );
      case "BOOKING_RESCHEDULED":
        return (
          <div className={`${baseClass} bg-orange-100 text-orange-600`}>
            <RefreshCcw size={18} />
          </div>
        );
      case "BOOKING_REMINDER":
        return (
          <div className={`${baseClass} bg-amber-100 text-amber-600`}>
            <AlertCircle size={18} />
          </div>
        );
      default:
        return (
          <div className={`${baseClass} bg-gray-100 text-gray-500`}>
            <Info size={18} />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group p-2.5 rounded-2xl transition-all duration-500 relative ${
          isOpen ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : (scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10")
        }`}
      >
        <Bell size={22} className={isOpen ? "animate-none" : "group-hover:rotate-12 transition-transform"} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-85 sm:w-[420px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100/50 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-300 origin-top-right">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="text-[11px] bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Stay updated with your latest alerts</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  title="Mark all as read"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <CheckCheck size={18} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-20 px-8 text-center bg-gray-50/30">
                <div className="w-24 h-24 bg-white rounded-[32px] shadow-sm flex items-center justify-center mx-auto mb-6">
                  <Bell size={40} className="text-gray-200" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">All caught up!</h4>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  No notifications for your <span className="text-blue-600 font-bold">{currentUser.role}</span> account at the moment.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-5 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-all cursor-pointer relative group ${
                    !notification.isRead ? "bg-blue-50/10" : ""
                  }`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-4">
                    {getNotificationIcon(notification.type, notification.isRead)}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-[15px] pr-8 ${!notification.isRead ? "font-black text-gray-900" : "font-semibold text-gray-600"}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight flex items-center gap-1.5 shrink-0 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${!notification.isRead ? "text-gray-600 font-medium" : "text-gray-400"}`}>
                        {notification.message}
                      </p>
                      
                      {!notification.isRead && (
                        <div className="flex items-center gap-2 mt-3 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                          <span>Mark as read</span>
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="absolute top-6 right-6 h-2 w-2 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white text-center border-t border-gray-50">
            <button className="w-full py-3 text-sm font-black text-gray-500 hover:text-blue-600 rounded-2xl border-2 border-transparent hover:border-blue-50 transition-all uppercase tracking-widest">
              View Earlier Alerts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
