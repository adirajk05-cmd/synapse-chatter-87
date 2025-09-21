import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOutIcon, MessageSquareIcon, TrashIcon, ShieldCheckIcon, XIcon } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const AdminPanel = () => {
  const { users, messages, updateUserStatus, clearAllMessages, logout } = useChat();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-online text-online';
      case 'blocked': return 'border-blocked text-blocked';
      case 'temp': return 'border-temp text-temp';
      default: return 'border-muted-foreground text-muted-foreground';
    }
  };

  const getUserMessageCount = (userId: string) => {
    return messages.filter(msg => msg.user_id === userId).length;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users and chat system</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              <MessageSquareIcon className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
            
            <Button
              variant="outline"
              onClick={logout}
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blocked">
                {users.filter(u => u.status === 'blocked').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Actions</CardTitle>
            <CardDescription>
              Manage the chat system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Clear All Messages
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Messages</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all messages from the chat.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearAllMessages}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear Messages
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage all users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="font-medium text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{user.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getUserMessageCount(user.id)} messages sent
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                    
                    <div className="flex space-x-2">
                      {user.status !== 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateUserStatus(user.id, 'active')}
                        >
                          <ShieldCheckIcon className="w-3 h-3 mr-1" />
                          Activate
                        </Button>
                      )}
                      
                      {user.status !== 'blocked' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateUserStatus(user.id, 'blocked')}
                        >
                          <XIcon className="w-3 h-3 mr-1" />
                          Block
                        </Button>
                      )}
                      
                      {user.status !== 'temp' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateUserStatus(user.id, 'temp')}
                        >
                          Temp
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};