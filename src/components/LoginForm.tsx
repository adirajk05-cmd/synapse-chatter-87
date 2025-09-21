import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChat } from '@/hooks/useChat';

export const LoginForm = () => {
  const [userCredentials, setUserCredentials] = useState({
    username: '',
    password: ''
  });
  
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: '',
    secretCode: ''
  });

  const [loading, setLoading] = useState(false);
  const { login, adminLogin } = useChat();

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(userCredentials.username, userCredentials.password);
    setLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await adminLogin(adminCredentials.username, adminCredentials.password, adminCredentials.secretCode);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">SecureChat</CardTitle>
          <CardDescription>
            Simple secure real-time messaging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User Login</TabsTrigger>
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user">
              <form onSubmit={handleUserLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={userCredentials.username}
                    onChange={(e) => setUserCredentials(prev => ({
                      ...prev,
                      username: e.target.value
                    }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={userCredentials.password}
                    onChange={(e) => setUserCredentials(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input
                    id="admin-username"
                    type="text"
                    placeholder="Admin username"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials(prev => ({
                      ...prev,
                      username: e.target.value
                    }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Admin password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secret-code">Secret Code</Label>
                  <Input
                    id="secret-code"
                    type="password"
                    placeholder="Enter secret code"
                    value={adminCredentials.secretCode}
                    onChange={(e) => setAdminCredentials(prev => ({
                      ...prev,
                      secretCode: e.target.value
                    }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Admin Sign In'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-sm text-muted-foreground">
            <div className="mb-2 font-medium">Demo Credentials:</div>
            <div className="space-y-1">
              <div>Users: user1/password1, user2/password2, etc.</div>
              <div>Admin: admin/adminpass/SECRET123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};