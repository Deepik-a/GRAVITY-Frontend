'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import chatService from '@/services/ChatService';
import { X, Send, User, Building2, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  senderType: string;
  content: string;
  createdAt: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  participants: Array<{
    participantId: string;
  }>;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    name: string;
    role: "user" | "company";
  };
  otherParticipant: {
    id: string;
    name: string;
    role: "user" | "company";
  };
}

export default function ChatWindow({ isOpen, onClose, currentUser, otherParticipant }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false); // Default to false, wait for check
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchConversation = useCallback(async () => {
    try {
      setIsLoading(true);
      const conversations = await chatService.getConversations(currentUser.id);
      const conversation = conversations.find((c: Conversation) => 
        c.participants.some((p: { participantId: string }) => p.participantId === otherParticipant.id)
      );

      if (conversation) {
        setConversationId(conversation.id);
        const fetchedMessages = await chatService.getMessages(conversation.id);
        setMessages(fetchedMessages);
        chatService.markAsRead(conversation.id, currentUser.id, otherParticipant.id);
      } else {
        setMessages([]);
        setConversationId(null);
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.id, otherParticipant.id]);

  useEffect(() => {
    if (isOpen && currentUser.id) {
      const socket = chatService.connect(currentUser.id);

      // Listen for incoming messages
      socket?.on("new_message", (message: Message) => {
        setMessages((prev) => {
          if (prev.find(m => m.id === message.id)) return prev;
          
          // If we receive a message from the other participant while chat is open, mark it as read
          if (message.senderId === otherParticipant.id) {
             chatService.markAsRead(conversationId || "", currentUser.id, otherParticipant.id);
          }
          return [...prev, message];
        });
        scrollToBottom();
      });

      // Listen for typing events
      chatService.onTyping((userId) => {
        if (userId === otherParticipant.id) {
            setIsOtherUserTyping(true);
            scrollToBottom();
        }
      });

      chatService.onStopTyping((userId) => {
        if (userId === otherParticipant.id) setIsOtherUserTyping(false);
      });

      // Listen for user status (online/offline)
      chatService.onUserStatus(({ userId, status }) => {
        if (userId === otherParticipant.id) setIsOtherUserOnline(status === 'online');
      });

      chatService.onOnlineUsers((userIds) => {
        if (userIds.includes(otherParticipant.id)) {
            setIsOtherUserOnline(true);
        }
      });

      // Fetch conversation and messages
      fetchConversation();

      return () => {
        socket?.off("new_message");
        chatService.off("typing");
        chatService.off("stop_typing");
        chatService.off("user_status");
      };
    }
  }, [isOpen, currentUser.id, otherParticipant.id, conversationId, fetchConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherUserTyping]);

  useEffect(() => {
    // Mark messages as read when conversation opens/loads
    if (messages.length > 0 && conversationId && isOpen) {
        // Find unread messages from other participant? 
        // For simplicity, just trigger markAsRead for the whole conversation
        chatService.markAsRead(conversationId, currentUser.id, otherParticipant.id);
    }
  }, [messages, conversationId, isOpen, currentUser.id, otherParticipant.id]);




  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (conversationId) {
        chatService.sendTyping(currentUser.id, otherParticipant.id);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            chatService.stopTyping(currentUser.id, otherParticipant.id);
        }, 2000);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    chatService.stopTyping(currentUser.id, otherParticipant.id);

    // Validation: Prevent sending to yourself
    if (currentUser.id === otherParticipant.id) {
      console.error("Cannot send message to yourself");
      alert("Error: Cannot send message to yourself");
      return;
    }

    // Ensure roles are set (with defaults)
    const senderRole = currentUser.role || "user";
    const receiverRole = otherParticipant.role || "company";

    const tempMessageId = `temp-${Date.now()}`;
    const messageData = {
      senderId: currentUser.id,
      senderType: senderRole,
      receiverId: otherParticipant.id,
      receiverType: receiverRole,
      content: newMessage.trim(),
    };

    console.log("ChatWindow: Sending message", messageData);

    // Create optimistic message (immediately show it)
    const optimisticMessage: Message = {
      id: tempMessageId,
      senderId: currentUser.id,
      senderType: senderRole,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add optimistic message immediately
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    scrollToBottom();

    try {
      // Send message to server
      await chatService.sendMessage(messageData);
      
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, mark the message as failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessageId 
            ? { ...msg, content: `${msg.content} (Failed to send)` }
            : msg
        )
      );
      alert("Failed to send message. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
            {otherParticipant.role === 'company' ? <Building2 size={20} /> : <User size={20} />}
            {isOtherUserOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-900 rounded-full"></span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none">{otherParticipant.name}</h3>
            <span className="text-[10px] opacity-70">{isOtherUserOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 text-sm">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                  isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                }`}>
                  <p className={isMe ? 'text-white' : 'text-gray-800'}>{msg.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.createdAt ? format(new Date(msg.createdAt), 'HH:mm') : 'Just now'}
                    </span>
                    {isMe && (
                      <span className="text-blue-100">
                        {msg.status === 'read' ? (
                          <CheckCheck size={12} className="text-blue-200" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck size={12} className="opacity-70" />
                        ) : (
                          <Check size={12} className="opacity-70" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {isOtherUserTyping && (
             <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-200 p-3 shadow-sm">
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder:text-gray-500"
          style={{ color: '#1f2937' }} 
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className={`p-2 rounded-full transition-colors shadow-lg active:scale-95 ${
            newMessage.trim() 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}