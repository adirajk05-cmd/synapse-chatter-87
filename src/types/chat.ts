export interface User {
  id: string;
  username: string;
  status: 'active' | 'blocked' | 'temp';
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  content?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
  user?: User;
}

export interface Admin {
  id: string;
  username: string;
  secret_code: string;
  created_at: string;
}

export interface ChatSession {
  user: User | null;
  isAdmin: boolean;
}