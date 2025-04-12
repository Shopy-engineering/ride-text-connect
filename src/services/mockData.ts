
import { User, UserRole, Message, Conversation } from '@/types/message';

export const createMockUsers = (): Record<UserRole, User> => {
  return {
    driver: {
      id: 'driver-1',
      name: 'Charz Driver',
      role: 'driver',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver'
    },
    rider: {
      id: 'rider-1',
      name: 'Lawrence Rider',
      role: 'rider',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rider'
    }
  };
};

export const createMockConversation = (driver: User, rider: User): Conversation => {
  const now = Date.now();
  
  const messages: Message[] = [
    {
      id: 'msg-1',
      senderId: rider.id,
      text: "Hi, I'm waiting at the pickup location",
      timestamp: now - 1000 * 60 * 15, // 15 minutes ago
      status: 'read'
    },
    {
      id: 'msg-2',
      senderId: driver.id,
      text: "I'll be there in 5 minutes. I'm in a blue sedan.",
      timestamp: now - 1000 * 60 * 14, // 14 minutes ago
      status: 'read'
    },
    {
      id: 'msg-3',
      senderId: rider.id,
      text: "Great, I'm wearing a red jacket.",
      timestamp: now - 1000 * 60 * 13, // 13 minutes ago
      status: 'read'
    },
    {
      id: 'msg-4',
      senderId: driver.id,
      text: "I see you. I'm pulling up now.",
      timestamp: now - 1000 * 60 * 5, // 5 minutes ago
      status: 'read'
    }
  ];
  
  return {
    id: `conversation-${driver.id}-${rider.id}`,
    participants: [driver, rider],
    messages,
    rideId: 'ride-12345',
    lastActivity: messages[messages.length - 1].timestamp
  };
};
