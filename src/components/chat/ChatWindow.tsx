'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import chatService from '@/services/ChatService';
import { X, Send, User, Building2, Check, CheckCheck, Smile, Paperclip, FileIcon } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

interface Message {
  id: string;
  senderId: string;
  senderType: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
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
    role: "user" | "company" | "admin";
  };
  otherParticipant: {
    id: string;
    name: string;
    role: "user" | "company" | "admin";
  };
  className?: string;
}

export default function ChatWindow({ isOpen, onClose, currentUser, otherParticipant, className }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false); // Default to false, wait for check
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchConversation = useCallback(async () => {
    try {
      setIsLoading(true);
      const conversations = await chatService.getConversations(currentUser.id, currentUser.role);
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
  }, [currentUser.id, currentUser.role, otherParticipant.id]);

  useEffect(() => {
    if (isOpen && currentUser.id) {
      const socket = chatService.connect(currentUser.id);

      // Listen for incoming messages
      socket?.on("new_message", (message: Message) => {
        setMessages((prev) => {
          // If message is already from us, check if it's already there (via optimistic temp ID)
          if (message.senderId === currentUser.id) {
             const existingIdx = prev.findIndex(m => m.id === message.id || (m.id.startsWith('temp-') && m.content === message.content));
             if (existingIdx !== -1) {
                // If it's already there but with temp ID, update it with real ID and data
                const updated = [...prev];
                updated[existingIdx] = message;
                return updated;
             }
          } else {
             // If message is from someone else, only add if not already there
             if (prev.find(m => m.id === message.id)) return prev;
          }
          
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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { url, key, type } = await chatService.uploadAttachment(file);
      
      const senderRole = currentUser.role || "user";
      const receiverRole = otherParticipant.role || "company";

      const messageData = {
        senderId: currentUser.id,
        senderType: senderRole,
        receiverId: otherParticipant.id,
        receiverType: receiverRole,
        content: `Attached ${type}: ${file.name}`,
        attachmentUrl: url,
        attachmentKey: key,
        attachmentType: type
      };

      await chatService.sendMessage(messageData);
      
      // We don't need optimistic update for file because sendMessage will broadcast 
      // but maybe a small notification is good.
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload attachment");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
    <div className={className || "fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden animate-fade-in-up"}>
      {/* Header */}
      <div 
        className="p-4 text-white flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #020D2E 0%, #0F2FA8 50%, #020D2E 100%)' }}
      >
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
                  {msg.attachmentUrl ? (
                    <div className="mb-2">
                       {msg.attachmentType === 'image' ? (
                          <div className="relative w-full aspect-auto min-h-[100px] rounded-lg overflow-hidden border border-gray-500/10">
                             <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                               <Image 
                                 src={msg.attachmentUrl} 
                                 alt="Attachment" 
                                 width={500}
                                 height={300}
                                 className="max-w-full h-auto cursor-zoom-in object-contain" 
                                 unoptimized
                               />
                             </a>
                          </div>
                       ) : (
                          <a 
                            href={msg.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2 rounded-lg border ${isMe ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-200 text-blue-600'}`}
                          >
                             <FileIcon size={20} />
                             <span className="truncate max-w-[150px]">{msg.content || 'File'}</span>
                          </a>
                       )}
                    </div>
                  ) : (
                    <p className={isMe ? 'text-white' : 'text-gray-800'}>{msg.content}</p>
                  )}
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
      <div className="relative">
        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-4 z-50 bg-white rounded-3xl shadow-2xl border-4 border-blue-50 overflow-hidden flex flex-col w-72 animate-fade-in-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
               <div className="flex items-center gap-2">
                  <Smile size={16} className="text-blue-600" />
                  <span className="text-[11px] font-black text-blue-900 uppercase tracking-[0.2em]">Select Emoji</span>
               </div>
               <button 
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                title="Close Emoji Picker"
               >
                 <X size={18} strokeWidth={3} />
               </button>
            </div>
            <div className="max-h-72 overflow-y-auto">
               <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" />
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
        <button 
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <Smile size={20} />
        </button>
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2 transition-colors ${isUploading ? 'text-blue-500 animate-pulse' : 'text-gray-400 hover:text-blue-600'}`}
          disabled={isUploading}
        >
          <Paperclip size={20} />
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
        />
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onFocus={() => setShowEmojiPicker(false)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder:text-gray-500"
          style={{ color: '#1f2937' }} 
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className={`p-2.5 rounded-full transition-all duration-300 shadow-xl active:scale-95 flex items-center justify-center ${
            newMessage.trim() 
              ? 'text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={newMessage.trim() ? { background: 'linear-gradient(135deg, #020D2E 0%, #0F2FA8 50%, #020D2E 100%)' } : {}}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}