
import React from 'react';
import { User, UserRole } from '@/types/message';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserSwitcherProps {
  currentUser: User;
  onSwitchUser: (role: UserRole) => void;
}

export const UserSwitcher: React.FC<UserSwitcherProps> = ({ 
  currentUser, 
  onSwitchUser 
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-white border-b">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback className="bg-uber-blue text-white">
            {currentUser.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
        </div>
      </div>
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSwitchUser(currentUser.role === 'driver' ? 'rider' : 'driver')}
        >
          Switch to {currentUser.role === 'driver' ? 'Rider' : 'Driver'}
        </Button>
      </div>
    </div>
  );
};
