'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Loader, Clock } from 'lucide-react';
import { ChatBubble } from './ChatBubble';
import { Button } from '@/components/ui/Button';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: User;
  createdAt: string;
  readAt?: string;
}

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser?: User;
  bookingId?: string;
}

/**
 * ChatWindow component with message polling (every 3 seconds).
 * Displays messages and allows sending new ones.
 */
export function ChatWindow({
  conversationId,
  currentUserId,
  otherUser,
  bookingId,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageTimeRef = useRef<Date | null>(null);
  const hasScrolled = useRef(false);

  // Scroll to bottom on initial load only
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages
  const fetchMessages = async (since?: Date) => {
    try {
      const params = new URLSearchParams();
      if (since) {
        params.append('since', since.toISOString());
      }
      const response = await fetch(
        `/api/conversations/${conversationId}/messages?${params.toString()}`
      );

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();

      if (since) {
        // For polling: append new messages
        setMessages((prev) => [...prev, ...data.messages]);
      } else {
        // Initial load: replace all messages
        setMessages(data.messages);
      }

      // Update last fetch time
      if (data.messages.length > 0) {
        lastMessageTimeRef.current = new Date(
          data.messages[data.messages.length - 1].createdAt
        );
      }

      setError(null);
    } catch (err) {
      console.error('[ChatWindow] Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and scroll
  useEffect(() => {
    hasScrolled.current = false;
    fetchMessages().then(() => {
      if (!hasScrolled.current) {
        scrollToBottom();
        hasScrolled.current = true;
      }
    });
  }, [conversationId]);

  // Start polling for new messages every 3 seconds
  useEffect(() => {
    pollIntervalRef.current = setInterval(() => {
      fetchMessages(lastMessageTimeRef.current || undefined);
    }, 3000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      const message = await response.json();
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      lastMessageTimeRef.current = new Date(message.createdAt);
      // Scroll after sending a message
      setTimeout(() => scrollToBottom(), 0);
    } catch (err) {
      console.error('[ChatWindow] Send error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-on-surface/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-surface-light p-4 border-b border-on-surface/10">
        <h3 className="font-semibold text-on-surface">
          {otherUser ? `Chat avec ${otherUser.name}` : 'Conversation'}
        </h3>
        {bookingId && (
          <p className="text-xs text-on-surface-dim mt-1">
            À propos de la course #{bookingId}
          </p>
        )}
      </div>

      {/* Warning banner */}
      <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 border-b border-warning/20 text-xs text-on-surface-dim">
        <Clock className="w-3 h-3 flex-shrink-0" />
        Les messages sont automatiquement supprimés après 30 jours.
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-on-surface-dim">
            <p>Aucun message pour le moment. Commencez la conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-error/10 text-error text-sm border-t border-error/20">
          {error}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-on-surface/10 bg-surface flex gap-2"
      >
        <input
          type="text"
          placeholder="Écrivez votre message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending}
          className="flex-1 px-4 py-2 bg-on-surface/5 border border-on-surface/10 rounded-lg text-on-surface placeholder-on-surface-dim focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isSending || !newMessage.trim()}
          className="px-4"
          size="sm"
        >
          {isSending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
