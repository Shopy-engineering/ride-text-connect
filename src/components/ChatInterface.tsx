
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { Message, User, Conversation, MessageStatus } from '@/types/message';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PhoneCall } from 'lucide-react';

interface ChatInterfaceProps {
  currentUser: User;
  otherUser: User;
  initialConversation?: Conversation;
  onBack?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUser,
  otherUser,
  initialConversation,
  onBack
}) => {
  const { socket, connected } = useSocket();
  const [conversation, setConversation] = useState<Conversation>(
    initialConversation || {
      id: `${currentUser.id}-${otherUser.id}`,
      participants: [currentUser, otherUser],
      messages: [],
      lastActivity: Date.now()
    }
  );
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // This would be replaced with your actual socket logic
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: Message) => {
      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, msg],
        lastActivity: Date.now()
      }));
      
      // Send read receipt if the message is from the other user
      if (msg.senderId === otherUser.id) {
        socket.emit('message_read', { messageId: msg.id, conversationId: conversation.id });
      }
    };

    const handleStatusUpdate = (update: { messageId: string; status: MessageStatus }) => {
      setConversation(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === update.messageId 
            ? { ...msg, status: update.status } 
            : msg
        )
      }));
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_status', handleStatusUpdate);

    // Join the conversation room
    socket.emit('join_conversation', { conversationId: conversation.id });

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_status', handleStatusUpdate);
      socket.emit('leave_conversation', { conversationId: conversation.id });
    };
  }, [socket, conversation.id, otherUser.id]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const sendMessage = (text: string) => {
    if (!socket || !connected) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: currentUser.id,
      text,
      timestamp: Date.now(),
      status: 'sending'
    };

    // Optimistically add the message to our state
    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastActivity: Date.now()
    }));

    // Send via socket
    socket.emit('send_message', {
      conversationId: conversation.id,
      message: newMessage
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h2 className="font-semibold">{otherUser.name}</h2>
            <p className="text-xs text-muted-foreground capitalize">{otherUser.role}</p>
          </div>
        </div>
        <Button size="icon" variant="ghost">
          <PhoneCall className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-uber-gray">
        {conversation.messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === currentUser.id}
            sender={
              conversation.participants.find(p => p.id === message.senderId) || currentUser
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput 
        onSendMessage={sendMessage} 
        disabled={!connected} 
      />
    </div>
  );
};
