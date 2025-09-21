-- Create user status enum
CREATE TYPE user_status AS ENUM ('active', 'blocked', 'temp');

-- Create users table with predefined users
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin table
CREATE TABLE public.admin (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  secret_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "No one can insert users directly" ON public.users FOR INSERT WITH CHECK (false);
CREATE POLICY "No one can update users directly" ON public.users FOR UPDATE USING (false);
CREATE POLICY "No one can delete users directly" ON public.users FOR DELETE USING (false);

-- Create policies for messages table
CREATE POLICY "Everyone can view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Users can insert their own messages" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = user_id AND status != 'blocked')
);
CREATE POLICY "No one can update messages" ON public.messages FOR UPDATE USING (false);
CREATE POLICY "No one can delete messages directly" ON public.messages FOR DELETE USING (false);

-- Create policies for admin table
CREATE POLICY "Admin can view themselves" ON public.admin FOR SELECT USING (true);
CREATE POLICY "No one can insert admin directly" ON public.admin FOR INSERT WITH CHECK (false);
CREATE POLICY "No one can update admin directly" ON public.admin FOR UPDATE USING (false);
CREATE POLICY "No one can delete admin directly" ON public.admin FOR DELETE USING (false);

-- Insert predefined users
INSERT INTO public.users (username, password, status) VALUES
  ('user1', 'password1', 'active'),
  ('user2', 'password2', 'active'),
  ('user3', 'password3', 'active'),
  ('user4', 'password4', 'temp'),
  ('user5', 'password5', 'active');

-- Insert admin user
INSERT INTO public.admin (username, password, secret_code) VALUES
  ('admin', 'adminpass', 'SECRET123');

-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-files', 'chat-files', true);

-- Create storage policies
CREATE POLICY "Anyone can view chat files" ON storage.objects FOR SELECT USING (bucket_id = 'chat-files');
CREATE POLICY "Authenticated users can upload chat files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chat-files');

-- Enable realtime for messages table
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.messages;