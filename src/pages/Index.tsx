
import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { UserSwitcher } from '@/components/UserSwitcher';
import { SocketProvider } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/message';
import { createMockUsers, createMockConversation } from '@/services/mockData';
import { useToast } from '@/components/ui/use-toast';

// Change this to your Socket.IO server URL
const SOCKET_SERVER_URL = 'https://chat-backend-vkcd.onrender.com';

const Index = () => {
  const [role, setRole] = useState<UserRole>('rider');
  const { toast } = useToast();
  const mockUsers = createMockUsers();

  const currentUser = mockUsers[role];
  const otherUser = role === 'rider' ? mockUsers.driver : mockUsers.rider;

/*  useEffect(() => {
    toast({
      title: "Boda Guy Texting Prototype",
      description: `You are currently in ${role} mode. You can switch roles using the button above.`,
    });
  }, [role, toast]); 
  */

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col shadow-lg overflow-hidden">
        <SocketProvider serverUrl={SOCKET_SERVER_URL}>
          <UserSwitcher 
            currentUser={currentUser} 
            onSwitchUser={setRole} 
          />
          <ChatInterface
            currentUser={currentUser}
            otherUser={otherUser}
          />
        </SocketProvider>
      </div>
      
    </div>
  );
};

export default Index;
