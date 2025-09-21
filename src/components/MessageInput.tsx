import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, PaperclipIcon, XIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (content?: string, file?: File) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSendMessage, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !selectedFile) return;
    
    onSendMessage(message.trim() || undefined, selectedFile || undefined);
    setMessage('');
    setSelectedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 25MB",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/zip', 'application/x-zip-compressed',
      'text/plain', 'application/pdf'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "File Type Not Allowed",
        description: "Only images, zip files, text files, and PDFs are allowed",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t border-border bg-card p-4">
      {selectedFile && (
        <div className="mb-3 flex items-center justify-between bg-muted rounded-lg p-2">
          <div className="flex items-center space-x-2">
            <PaperclipIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm truncate max-w-48">
              {selectedFile.name}
            </span>
            <span className="text-xs text-muted-foreground">
              ({formatFileSize(selectedFile.size)})
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={removeSelectedFile}
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
          disabled={disabled}
        />
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.zip,.txt,.pdf"
        />
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <PaperclipIcon className="w-4 h-4" />
        </Button>
        
        <Button 
          type="submit" 
          size="icon"
          disabled={disabled || (!message.trim() && !selectedFile)}
        >
          <SendIcon className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};