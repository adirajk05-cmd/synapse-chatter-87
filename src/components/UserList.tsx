import { User } from '@/types/chat';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserListProps {
  users: User[];
  currentUser?: User | null;
}

export const UserList = ({ users, currentUser }: UserListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-online';
      case 'blocked': return 'bg-blocked';
      case 'temp': return 'bg-temp';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'blocked': return 'Blocked';
      case 'temp': return 'Temp';
      default: return 'Unknown';
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Users ({users.length})</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                currentUser?.id === user.id 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className={`w-3 h-3 rounded-full ${getStatusColor(user.status)}`}
                  title={getStatusText(user.status)}
                />
                <span className="font-medium text-sm">
                  {user.username}
                  {currentUser?.id === user.id && ' (You)'}
                </span>
              </div>
              
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  user.status === 'active' ? 'border-online text-online' :
                  user.status === 'blocked' ? 'border-blocked text-blocked' :
                  'border-temp text-temp'
                }`}
              >
                {getStatusText(user.status)}
              </Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};