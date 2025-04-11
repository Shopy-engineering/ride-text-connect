
export type UserRole = 'driver' | 'rider';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  rideId?: string;
  lastActivity: number;
}
