'use client';

import { useState } from 'react';
import { ConversationList } from '@/components/features/chat/ConversationList';
import { ChatWindow } from '@/components/features/chat/ChatWindow';

/**
 * Client messages page showing conversations list and chat window.
 */
export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">Mes messages</h1>
        <p className="text-on-surface-dim">
          Discutez directement avec vos chauffeurs et le support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
            <h2 className="font-semibold text-on-surface mb-4">Conversations</h2>
            <ConversationList
              onSelect={setSelectedConversationId}
            />
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 h-96">
          {selectedConversationId ? (
            <ChatWindow
              conversationId={selectedConversationId}
              currentUserId=""
            />
          ) : (
            <div className="bg-surface border border-on-surface/10 rounded-lg p-8 text-center h-full flex items-center justify-center text-on-surface-dim">
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
