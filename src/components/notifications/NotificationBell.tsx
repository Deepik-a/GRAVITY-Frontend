"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell, Check, CheckCheck, CreditCard, Calendar,
  RefreshCcw, AlertCircle, Info, X,
} from "lucide-react";
import notificationService, { INotification } from "@/services/NotificationService";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import chatService from "@/services/ChatService";

interface NotificationBellProps {
  currentUser: { id: string; role: "user" | "company" };
  scrolled?: boolean;
}

export default function NotificationBell({ currentUser, scrolled }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n: INotification) => !n.isRead).length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (currentUser?.id) {
      fetchNotifications();
      chatService.connect(currentUser.id, currentUser.role);
      notificationService.onNotification((notification: INotification) => {
        if (notification.recipientType === currentUser.role) {
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          try {
            // Using a clearer bell ring sound
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/1350/1350-preview.mp3");
            audio.play().catch((e) => console.warn("Audio play failed", e));
          } catch (e) {
            console.warn("Audio play error", e);
          }
          toast.info(notification.title, {
            onClick: () => setIsOpen(true),
            icon: <Bell className="text-blue-500" />,
          });
        }
      });
    }
    return () => { notificationService.offNotification(); };
  }, [currentUser]);

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
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
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
    const base = `w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${!isRead ? "" : "opacity-50"}`;
    switch (type) {
      case "PAYMENT_SUCCESS":
      case "SUBSCRIPTION_SUCCESS":
        return <div className={`${base} bg-green-100 text-green-600`}><CreditCard size={13} /></div>;
      case "NEW_BOOKING":
        return <div className={`${base} bg-blue-100 text-blue-600`}><Calendar size={13} /></div>;
      case "BOOKING_RESCHEDULED":
        return <div className={`${base} bg-orange-100 text-orange-600`}><RefreshCcw size={13} /></div>;
      case "BOOKING_REMINDER":
        return <div className={`${base} bg-amber-100 text-amber-600`}><AlertCircle size={13} /></div>;
      default:
        return <div className={`${base} bg-blue-100 text-blue-600`}><Info size={13} /></div>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>

      {/* ── Bell button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-300 ${
          isOpen
            ? "bg-blue-600 text-white"
            : scrolled
            ? "text-gray-700 hover:bg-gray-100"
            : "text-white hover:bg-white/10"
        }`}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 border border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Backdrop (prevents homepage interaction) ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          className="fixed sm:absolute right-0 sm:right-0 z-50 sm:mt-3 w-[calc(100vw-24px)] sm:w-[340px] origin-top-right"
          style={{
            top: "calc(100% + 8px)",
            /* on mobile: center below the bell */
          }}
        >
          {/* Card with gradient background */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(to right, #020D2E, #0F2FA8)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
            }}
          >

            {/* ── Header ── */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                {/* Blue icon badge — matches reference */}
                <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <Bell size={12} className="text-white" />
                </div>
                <span className="text-[13px] font-bold text-white tracking-tight">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold leading-none">
                    {unreadCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    title="Mark all as read"
                    className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    <CheckCheck size={14} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* ── Notification list ── */}
            <div className="max-h-[340px] overflow-y-auto bg-white">
              {notifications.length === 0 ? (
                <div className="py-10 px-4 text-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Bell size={18} className="text-gray-300" />
                  </div>
                  <p className="text-[12px] font-semibold text-gray-700">All caught up!</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    No notifications for your{" "}
                    <span className="text-blue-600 font-semibold">{currentUser.role}</span>{" "}
                    account.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                    className={`px-4 py-3 flex gap-3 border-b border-gray-50 last:border-0 cursor-pointer transition-all duration-200 hover:bg-gray-50/80 relative ${
                      !notification.isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                    {/* Icon */}
                    {getNotificationIcon(notification.type, notification.isRead)}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-[12px] leading-snug pr-1 ${
                            !notification.isRead
                              ? "font-bold text-gray-900"
                              : "font-medium text-gray-500"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <span className="text-[9px] text-gray-400 font-medium shrink-0 mt-0.5 whitespace-nowrap">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed mt-0.5 ${
                        !notification.isRead ? "text-gray-500" : "text-gray-400"
                      }`}>
                        {notification.message}
                      </p>

                      {!notification.isRead && (
                        <div className="flex items-center gap-1 mt-1.5">
                          {/* "Learn More" style pill — matches reference */}
                          <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            Mark as read <Check size={9} />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Unread dot */}
                    {!notification.isRead && (
                      <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-4 py-2.5 border-t border-white/10 bg-white/5 backdrop-blur-sm">
              <button className="w-full py-1.5 text-[11px] font-bold text-white/60 hover:text-white rounded-xl transition-colors uppercase tracking-widest">
                View all alerts
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}