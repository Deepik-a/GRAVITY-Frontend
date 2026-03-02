import api from "./api/useApi";
import chatService from "./ChatService";

export interface INotification {
  id: string;
  recipientId: string;
  recipientType: "user" | "company";
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

class NotificationService {
  async getNotifications() {
    const response = await api.get("/notifications");
    return response.data;
  }

  async markAsRead(notificationId: string) {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllAsRead() {
    const response = await api.patch("/notifications/read-all");
    return response.data;
  }

  onNotification(callback: (notification: INotification) => void) {
    const socket = chatService.getSocket();
    socket?.on("notification", callback);
  }

  offNotification() {
    const socket = chatService.getSocket();
    socket?.off("notification");
  }
}

const notificationService = new NotificationService();
export default notificationService;
