'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import chatService from '@/services/ChatService';
import { format } from 'date-fns';
import { Search, User, Send, Building2, Check, CheckCheck, Smile, Paperclip, FileIcon } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { toast } from 'react-toastify';

interface Conversation {
  id: string;
  participants: Array<{
    participantId: string;
    participantType: string;
  }>;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  otherParticipantName?: string;
  otherParticipantImage?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: string;
  content: string;
  attachmentUrl?: string; // Add attachmentUrl
  attachmentType?: 'image' | 'file'; // Add attachmentType
  createdAt: string;
  status?: 'sent' | 'delivered' | 'read';
}

export default function CompanyMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedConversationRef = useRef<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchConversations = useCallback(async (userId: string) => {
    try {
      setIsConversationsLoading(true);
      const data = await chatService.getConversations(userId, 'company');
      const enriched = data.map((c: Conversation) => ({
        ...c,
        otherParticipantName: c.otherParticipantName || "User",
        otherParticipantImage: c.otherParticipantImage
      }));
      setConversations(enriched);
      
      // Auto-select the first conversation if none is selected
      if (enriched.length > 0 && !selectedConversationRef.current) {
        setSelectedConversation(enriched[0]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsConversationsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setIsMessagesLoading(true);
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (!currentUser || currentUser.id !== user.id) {
        console.log("CompanyMessages: Setting currentUser", user);
        setCurrentUser(user);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      console.log("CompanyMessages: Connecting to socket with ID", currentUser.id);
      chatService.connect(currentUser.id, 'company');
      
      fetchConversations(currentUser.id);

      const socket = chatService.getSocket();
      
      const handleNewMessage = (message: Message) => {
        const currentConv = selectedConversationRef.current;
        if (currentConv && message.conversationId === currentConv.id) {
          setMessages((prev) => {
            if (message.senderId === currentUser.id) {
               const existingIdx = prev.findIndex(m => m.id === message.id || (m.id.startsWith('temp-') && m.content === message.content));
               if (existingIdx !== -1) {
                  const updated = [...prev];
                  updated[existingIdx] = message;
                  return updated;
               }
            } else {
               if (prev.find(m => m.id === message.id)) return prev;
            }
            return [...prev, message];
          });
          scrollToBottom();
        }
        fetchConversations(currentUser.id);
      };

      socket?.off("new_message");
      socket?.on("new_message", handleNewMessage);

      return () => {
        socket?.off("new_message", handleNewMessage);
      }
    }
  }, [fetchConversations, currentUser?.id]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (currentUser?.id) {
       chatService.onTyping((userId) => {
         if (selectedConversationRef.current && 
             selectedConversationRef.current.participants.some(p => p.participantId === userId)) {
             setIsTyping(true);
             scrollToBottom();
         }
       });

       chatService.onStopTyping((userId) => {
         if (selectedConversationRef.current && 
             selectedConversationRef.current.participants.some(p => p.participantId === userId)) {
             setIsTyping(false);
         }
       });

       chatService.onUserStatus(({ userId, status }) => {
          if (selectedConversationRef.current && 
             selectedConversationRef.current.participants.some(p => p.participantId === userId)) {
             setIsOtherUserOnline(status === 'online');
          }
       });

       chatService.onOnlineUsers((userIds) => {
          if (selectedConversationRef.current) {
             const other = selectedConversationRef.current.participants.find(p => p.participantId !== currentUser.id);
             if (other && userIds.includes(other.participantId)) {
                 setIsOtherUserOnline(true);
             }
          }
       });

       return () => {
         chatService.off("typing");
         chatService.off("stop_typing");
         chatService.off("user_status");
         chatService.off("online_users");
       }
    }
  }, [currentUser]);

  useEffect(() => {
     if (selectedConversation && currentUser && messages.length > 0) {
         const otherParticipant = selectedConversation.participants.find(p => p.participantId !== currentUser.id);
         if (otherParticipant) {
             chatService.markAsRead(selectedConversation.id, currentUser.id, otherParticipant.participantId);
         }
     }
  }, [selectedConversation, currentUser, messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (selectedConversation && currentUser) {
        const otherParticipant = selectedConversation.participants.find(p => p.participantId !== currentUser.id);
        if (otherParticipant) {
             chatService.sendTyping(currentUser.id, otherParticipant.participantId);

             if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
             
             typingTimeoutRef.current = setTimeout(() => {
                chatService.stopTyping(currentUser.id, otherParticipant.participantId);
             }, 2000);
        }
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
      
      const otherParticipant = selectedConversation?.participants.find(p => p.participantId !== currentUser?.id);
      if (!otherParticipant || !currentUser) return;

      const messageData = {
        senderId: currentUser.id,
        senderType: "company" as const,
        receiverId: otherParticipant.participantId,
        receiverType: otherParticipant.participantType as "user" | "company",
        content: `Attached ${type}: ${file.name}`,
        attachmentUrl: url,
        attachmentKey: key,
        attachmentType: type as 'image' | 'file'
      };

      chatService.sendMessage(messageData);
      scrollToBottom();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload attachment");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (selectedConversation && currentUser) {
           const otherParticipant = selectedConversation.participants.find(p => p.participantId !== currentUser.id);
           if (otherParticipant) {
             chatService.stopTyping(currentUser.id, otherParticipant.participantId);
             if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
           }
      }
      handleSendMessage(e);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || !selectedConversation || !currentUser) return;

    const otherParticipantId = selectedConversation.participants.find(p => p.participantId !== (currentUser.id as string))?.participantId;

    if (!otherParticipantId) return;

    // Validation: Prevent sending to yourself
    if (currentUser.id === otherParticipantId) {
      console.error("Cannot send message to yourself");
      alert("Error: Cannot send message to yourself");
      return;
    }

    const otherParticipant = selectedConversation.participants.find(p => p.participantId === otherParticipantId);
    const receiverType = otherParticipant?.participantType || "user";

    const tempId = `temp-${Date.now()}`;
    const messageData = {
      senderId: currentUser.id as string,
      senderType: "company" as const,
      receiverId: otherParticipantId,
      receiverType: receiverType as "user" | "company",
      content: content,
    };

    console.log("CompanyMessages: Sending message", messageData);

    // Optimistic update
    const tempMsg: Message = {
        id: tempId,
        conversationId: selectedConversation.id,
        senderId: currentUser.id,
        senderType: "company",
        content: content,
        createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage('');
    scrollToBottom();

    try {
      chatService.sendMessage(messageData);
    } catch (error) {
      console.error("Error sending message:", error);
      // Mark as failed
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: `${m.content} (Failed to send)` } : m));
      alert("Failed to send message. Please try again.");
    }
  };



  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isConversationsLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-all border-l-4 ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50 border-blue-600' : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 truncate">{conv.otherParticipantName}</h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {conv.lastMessageAt && format(new Date(conv.lastMessageAt), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedConversation.otherParticipantName}</h3>
                  <span className={`text-xs font-medium ${isOtherUserOnline ? 'text-green-500' : 'text-gray-400'}`}>
                    {isOtherUserOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isMessagesLoading && messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isMe = currentUser && msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                          isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
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
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          )}
                          <div className={`flex items-center gap-1 mt-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] opacity-70">
                              {msg.createdAt && format(new Date(msg.createdAt), 'HH:mm')}
                            </span>
                            {isMe && (
                              <span className="opacity-70">
                                {msg.status === 'read' ? (
                                  <CheckCheck size={14} className="text-blue-500" />
                                ) : msg.status === 'delivered' ? (
                                  <CheckCheck size={14} />
                                ) : (
                                  <Check size={14} />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                   {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100 p-4 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="relative">
              {showEmojiPicker && (
                <div className="absolute bottom-full left-4 mb-2 z-50">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
            <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Smile size={24} />
              </button>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 transition-colors ${isUploading ? 'text-blue-500 animate-pulse' : 'text-gray-400 hover:text-blue-600'}`}
                disabled={isUploading}
              >
                <Paperclip size={24} />
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
                placeholder="Type your message here..."
                className="flex-1 px-6 py-3 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building2 size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Your Conversations</h3>
            <p className="max-w-xs">Select a conversation from the sidebar to start chatting with your customers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
