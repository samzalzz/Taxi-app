'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Loader } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Message {
  id: string;
  content: string;
  sender: { name: string };
  createdAt: string;
}

interface Conversation {
  id: string;
  type: string;
  messages: Message[];
  participants: Array<{ user: User }>;
  booking?: {
    id: string;
    pickupAddress: string;
    dropoffAddress: string;
    status: string;
  };
  unreadCount: number;
}

interface ConversationListProps {
  href?: (conversationId: string) => string;
  onSelect?: (conversationId: string) => void;
}

/**
 * ConversationList displays a scrollable list of all user's conversations.
 * Shows last message preview and unread count badge.
 */
export function ConversationList({
  href,
  onSelect,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversations');
        if (!response.ok) throw new Error('Failed to fetch conversations');
        const data = await response.json();
        setConversations(data.conversations);
        setError(null);
      } catch (err) {
        console.error('[ConversationList] Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error/10 text-error rounded-lg">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-on-surface-dim">
        <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
        <p>Aucune conversation pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages[0];
        const otherParticipant = conversation.participants.find(
          (p) => p.user.id !== undefined
        )?.user;

        const content = href ? (
          <Link href={href(conversation.id)}>
            <ConversationItem
              conversation={conversation}
              lastMessage={lastMessage}
              otherParticipant={otherParticipant}
            />
          </Link>
        ) : (
          <button
            onClick={() => onSelect?.(conversation.id)}
            className="w-full text-left hover:bg-on-surface/5 transition-colors"
          >
            <ConversationItem
              conversation={conversation}
              lastMessage={lastMessage}
              otherParticipant={otherParticipant}
            />
          </button>
        );

        return (
          <div
            key={conversation.id}
            className="rounded-lg border border-on-surface/10 bg-surface overflow-hidden hover:border-primary/30 transition-colors"
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

function ConversationItem({
  conversation,
  lastMessage,
  otherParticipant,
}: {
  conversation: Conversation;
  lastMessage?: Message;
  otherParticipant?: any;
}) {
  return (
    <div className="p-4 flex gap-3 items-start">
      {otherParticipant?.avatar && (
        <img
          src={otherParticipant.avatar}
          alt={otherParticipant?.name}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-on-surface">
            {otherParticipant?.name || 'Conversation'}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </span>
          )}
        </div>

        {lastMessage && (
          <p className="text-sm text-on-surface-dim truncate">
            {lastMessage.sender.name}: {lastMessage.content}
          </p>
        )}

        {conversation.booking && (
          <p className="text-xs text-on-surface-dim mt-1">
            Course: {conversation.booking.pickupAddress} → {conversation.booking.dropoffAddress}
          </p>
        )}

        {lastMessage && (
          <p className="text-xs text-on-surface-dim mt-1">
            {new Intl.RelativeTimeFormat('fr-FR', { numeric: 'auto' }).format(
              Math.round(
                (new Date(lastMessage.createdAt).getTime() - new Date().getTime()) /
                  1000 /
                  60
              ),
              'minute'
            )}
          </p>
        )}
      </div>
    </div>
  );
}
