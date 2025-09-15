
import { useState, useEffect } from 'react';
import LocalStorageService, { UserData, ChatMessage } from '../services/localStorageService';

export const useLocalStorage = () => {
  const [storageService] = useState(() => LocalStorageService.getInstance());
  
  return storageService;
};

export const useUserData = () => {
  const storageService = useLocalStorage();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const data = storageService.getUserData();
    setUserData(data);
  }, [storageService]);

  const updateUserData = (newData: UserData) => {
    storageService.saveUserData(newData);
    setUserData(newData);
  };

  const refreshUserData = () => {
    const data = storageService.getUserData();
    setUserData(data);
  };

  return { userData, updateUserData, refreshUserData };
};

export const useChatMessages = (room: string) => {
  const storageService = useLocalStorage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const allMessages = storageService.getChatMessages();
    const roomMessages = allMessages.filter(msg => msg.room === room);
    setMessages(roomMessages);
  }, [storageService, room]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    storageService.addChatMessage(newMessage);
    
    // Refresh messages
    const allMessages = storageService.getChatMessages();
    const roomMessages = allMessages.filter(msg => msg.room === room);
    setMessages(roomMessages);
  };

  return { messages, addMessage };
};
