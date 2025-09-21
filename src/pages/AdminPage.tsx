import { useChat } from '@/hooks/useChat';
import { LoginForm } from '@/components/LoginForm';
import { AdminPanel } from '@/components/AdminPanel';

const AdminPage = () => {
  const { session, loading } = useChat();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session.isAdmin) {
    return <LoginForm />;
  }

  return <AdminPanel />;
};

export default AdminPage;