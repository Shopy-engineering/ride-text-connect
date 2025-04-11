
import React from 'react';
import { Message, User } from '@/types/message';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Check, CheckCheck, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  sender: User;
}

const StatusIcon = ({ status }: { status: Message['status'] }) => {
  switch (status) {
    case 'sending':
      return <Clock className="h-3 w-3 text-muted-foreground" />;
    case 'sent':
      return <Check className="h-3 w-3 text-muted-foreground" />;
    case 'delivered':
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    case 'read':
      return <CheckCheck className="h-3 w-3 text-uber-blue" />;
    default:
      return null;
  }
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser, sender }) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-message-appear",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <div className="mr-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender.avatar} alt={sender.name} />
            <AvatarFallback className="bg-uber-blue text-white">
              {sender.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
          isCurrentUser
            ? "bg-uber-blue text-white rounded-br-none"
            : "bg-uber-light-gray text-black rounded-bl-none"
        )}
      >
        <p className="text-sm">{message.text}</p>
        <div className={cn(
          "flex text-xs mt-1",
          isCurrentUser ? "justify-end" : "justify-start"
        )}>
          <span className={cn("mr-1", isCurrentUser ? "text-white/70" : "text-black/50")}>
            {format(new Date(message.timestamp), 'h:mm a')}
          </span>
          
          {isCurrentUser && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
};
