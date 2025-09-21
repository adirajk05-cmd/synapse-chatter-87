import { Button } from '@/components/ui/button';
import { LogOutIcon, ShieldIcon } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { UserList } from './UserList';
import { ChatMessages } from './ChatMessages';
import { MessageInput } from './MessageInput';

export const ChatRoom = () => {
  const { messages, users, session, sendMessage, logout } = useChat();

  const canSendMessages = session.user && session.user.status !== 'blocked';

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">SC</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg">SecureChat</h1>
            <p className="text-xs text-muted-foreground">
              {session.isAdmin ? 'Admin Panel' : `Welcome, ${session.user?.username}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {session.isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/admin'}
            >
              <ShieldIcon className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
          >
            <LogOutIcon className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        <UserList users={users} currentUser={session.user} />
        
        <div className="flex-1 flex flex-col">
          <ChatMessages messages={messages} />
          
          {!canSendMessages && session.user?.status === 'blocked' && (
            <div className="bg-destructive/10 border-t border-destructive/20 p-3 text-center">
              <p className="text-sm text-destructive">
                You are blocked from sending messages
              </p>
            </div>
          )}
          
          <MessageInput 
            onSendMessage={sendMessage}
            disabled={!canSendMessages}
          />
        </div>
      </div>
    </div>
  );
};