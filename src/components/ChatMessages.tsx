import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { FileIcon, DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (fileName: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {message.user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">
                    {message.user?.username || 'Unknown User'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                {message.content && (
                  <p className="text-sm text-foreground whitespace-pre-wrap mb-2">
                    {message.content}
                  </p>
                )}
                
                {message.file_url && (
                  <div className="bg-muted rounded-lg p-3 max-w-md">
                    {isImageFile(message.file_name || '') ? (
                      <div className="space-y-2">
                        <img 
                          src={message.file_url} 
                          alt={message.file_name}
                          className="max-w-full h-auto rounded-md"
                          style={{ maxHeight: '300px' }}
                        />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{message.file_name}</span>
                          {message.file_size && (
                            <span>{formatFileSize(message.file_size)}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <FileIcon className="w-8 h-8 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {message.file_name}
                          </p>
                          {message.file_size && (
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(message.file_size)}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                        >
                          <a 
                            href={message.file_url} 
                            download={message.file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <DownloadIcon className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};