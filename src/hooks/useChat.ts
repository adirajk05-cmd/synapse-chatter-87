import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, User, ChatSession } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [session, setSession] = useState<ChatSession>({ user: null, isAdmin: false });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadMessages();
    loadUsers();
    setLoading(false);
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Fetch user info for the new message
          loadMessageWithUser(newMessage);
        }
      )
      .subscribe();

    const usersChannel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users'
        },
        (payload) => {
          const updatedUser = payload.new as User;
          setUsers(prev => prev.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(usersChannel);
    };
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const loadMessageWithUser = async (message: Message) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', message.user_id)
        .single();

      if (error) throw error;

      const messageWithUser = { ...message, user: userData };
      setMessages(prev => [...prev, messageWithUser]);
    } catch (error) {
      console.error('Error loading message user:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('username');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return false;
      }

      setSession({ user: data, isAdmin: false });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive"
      });
      return false;
    }
  };

  const adminLogin = async (username: string, password: string, secretCode: string) => {
    try {
      const { data, error } = await supabase
        .from('admin')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('secret_code', secretCode)
        .single();

      if (error || !data) {
        toast({
          title: "Admin Login Failed",
          description: "Invalid credentials or secret code",
          variant: "destructive"
        });
        return false;
      }

      setSession({ user: null, isAdmin: true });
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Error",
        description: "Admin login failed",
        variant: "destructive"
      });
      return false;
    }
  };

  const sendMessage = async (content?: string, file?: File) => {
    if (!session.user || session.user.status === 'blocked') {
      toast({
        title: "Cannot Send Message",
        description: "You are blocked from sending messages",
        variant: "destructive"
      });
      return;
    }

    try {
      let fileUrl = null;
      let fileName = null;
      let fileSize = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('chat-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('chat-files')
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
        fileName = file.name;
        fileSize = file.size;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: session.user.id,
          content,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'blocked' | 'temp') => {
    if (!session.isAdmin) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const clearAllMessages = async () => {
    if (!session.isAdmin) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      setMessages([]);
      toast({
        title: "Success",
        description: "All messages cleared",
      });
    } catch (error) {
      console.error('Error clearing messages:', error);
      toast({
        title: "Error",
        description: "Failed to clear messages",
        variant: "destructive"
      });
    }
  };

  const logout = () => {
    setSession({ user: null, isAdmin: false });
  };

  return {
    messages,
    users,
    session,
    loading,
    login,
    adminLogin,
    sendMessage,
    updateUserStatus,
    clearAllMessages,
    logout
  };
};