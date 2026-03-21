'use client';

import { useState, useEffect, useCallback } from 'react';
import chatService from '@/services/ChatService';
import ChatWindow from '@/components/chat/ChatWindow';
import { format } from 'date-fns';
import { User, Building2, MessageCircle, Search } from 'lucide-react';
import Image from 'next/image';

interface Conversation {
  id: string;
  participants: Array<{
    participantId: string;
    participantType: string;
  }>;
  lastMessage?: string;
  lastMessageAt?: string;
  otherParticipantName: string;
  otherParticipantImage?: string;
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminId, setAdminId] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string>('Admin');

  useEffect(() => {
    const id = localStorage.getItem('adminId');
    const userStr = localStorage.getItem('user');
    if (id) setAdminId(id);
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            setAdminName(user.name || 'Admin');
        } catch (e) { console.error(e); }
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!adminId) return;
    try {
      setIsLoading(true);
      const data = await chatService.getConversations(adminId, 'admin');
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    if (adminId) {
      fetchConversations();
      chatService.connect(adminId, 'admin'); // Admin role
    }
  }, [adminId, fetchConversations]);

  const filteredConversations = conversations.filter(c => 
    c.otherParticipantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 m-4">
      {/* Sidebar - Conversation List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-6 border-b border-gray-100 bg-white">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageCircle className="text-blue-600" />
            Messages
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500">
                <MessageCircle size={48} className="mb-2 opacity-20" />
                <p>No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredConversations.map((conv) => {
                const otherParticipant = conv.participants.find(p => p.participantId !== adminId);
                const isSelected = selectedConversation?.id === conv.id;
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full p-4 flex items-center gap-4 transition-all text-left ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-white bg-transparent'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                        {conv.otherParticipantImage ? (
                          <Image src={conv.otherParticipantImage} alt={conv.otherParticipantName} width={48} height={48} className="object-cover" />
                        ) : (
                          otherParticipant?.participantType === 'company' ? (
                            <Building2 className="text-blue-600" size={24} />
                          ) : (
                            <User className="text-gray-600" size={24} />
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`font-bold truncate text-sm ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
                          {conv.otherParticipantName}
                        </h3>
                        {conv.lastMessageAt && (
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {format(new Date(conv.lastMessageAt), 'HH:mm')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate pr-2">
                        {conv.lastMessage || 'Start a conversation'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        {!selectedConversation ? (
          <div className="text-center p-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={40} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Conversation</h2>
            <p className="text-gray-500 max-w-xs mx-auto">
              Choose a person from the sidebar to view your chat history and start messaging.
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8">
             <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden w-full max-w-5xl h-full flex flex-col relative">
                {/* Embedded version of ChatWindow feel but adjusted for the page */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            {selectedConversation.participants.find(p => p.participantId !== adminId)?.participantType === 'company' 
                                ? <Building2 size={24} className="text-blue-600" /> 
                                : <User size={24} className="text-blue-600" />
                            }
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-gray-800">{selectedConversation.otherParticipantName}</h2>
                            <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Active conversation
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Here we use ChatWindow component but it's fixed position. 
                    Actually, it's better to just use it as a modal overlay for now as per design 
                    OR I should refactor ChatWindow to be used as a component.
                    The current ChatWindow is a fixed modal.
                */}
                <div className="flex-1 relative overflow-hidden bg-gray-50">
                    {adminId && selectedConversation && (
                         <div className="absolute inset-0 z-10">
                            {/* We manually render a customized ChatWindow behavior or just pop it up */}
                            <ChatWindow
                                isOpen={true}
                                onClose={() => setSelectedConversation(null)}
                                currentUser={{
                                    id: adminId,
                                    name: adminName,
                                    role: "user" // Admin role for chat simplified to user?
                                }}
                                otherParticipant={{
                                    id: selectedConversation.participants.find(p => p.participantId !== adminId)?.participantId || "",
                                    name: selectedConversation.otherParticipantName,
                                    role: selectedConversation.participants.find(p => p.participantId !== adminId)?.participantType as "user" | "company" | "admin" || "user"
                                }}
                            />
                         </div>
                    )}
                </div>
             </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .navigation-item {
          transition: all 0.2s ease;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}
