import { io, Socket } from "socket.io-client";
import api from "./api/useApi";
import { API_ROUTES } from "@/shared/constants/routes";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"; // Adjust to your backend port

class ChatService {
  private socket: Socket | null = null;

  connect(userId: string, type: 'user' | 'company' | 'admin' = 'user') {
    if (this.socket) return this.socket;
    this.socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
      this.socket?.emit("join", { userId, type });
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  async getConversations(participantId: string, type: 'user' | 'company' | 'admin' = 'user') {
    const response = await api.get(`${API_ROUTES.CHAT.CONVERSATIONS}/${participantId}`, {
      params: { type }
    });
    return response.data;
  }

  async getMessages(conversationId: string) {
    const response = await api.get(`${API_ROUTES.CHAT.MESSAGES}/${conversationId}`);
    return response.data;
  }

  async uploadAttachment(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(API_ROUTES.CHAT.ATTACHMENTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  sendMessage(data: {
    senderId: string;
    senderType: "user" | "company" | "admin";
    receiverId: string;
    receiverType: "user" | "company" | "admin";
    content: string;
    attachmentUrl?: string;
    attachmentKey?: string; // add this
    attachmentType?: "image" | "file";
  }) {
    if (this.socket) {
      this.socket.emit("send_message", data);
    }
  }

  sendTyping(senderId: string, receiverId: string) {
    this.socket?.emit("typing", { senderId, receiverId });
  }

  stopTyping(senderId: string, receiverId: string) {
    this.socket?.emit("stop_typing", { senderId, receiverId });
  }

  markAsRead(conversationId: string, userId: string, otherUserId: string) {
    this.socket?.emit("mark_read", { conversationId, userId, otherUserId });
  }

  onTyping(callback: (userId: string) => void) {
    this.socket?.on("typing", (data: { userId: string }) => callback(data.userId));
  }

  onStopTyping(callback: (userId: string) => void) {
    this.socket?.on("stop_typing", (data: { userId: string }) => callback(data.userId));
  }

  onUserStatus(callback: (data: { userId: string, status: string }) => void) {
    this.socket?.on("user_status", callback);
  }

  onOnlineUsers(callback: (userIds: string[]) => void) {
    this.socket?.on("online_users", callback);
  }

  onMessagesRead(callback: (data: { conversationId: string }) => void) {
    this.socket?.on("messages_read", callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }
}

const chatService = new ChatService();
export default chatService;
