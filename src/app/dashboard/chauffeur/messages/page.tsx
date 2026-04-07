'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ConversationList } from '@/components/features/chat/ConversationList';
import { ChatWindow } from '@/components/features/chat/ChatWindow';
import { NewConversationModal } from '@/components/features/chat/NewConversationModal';
import { Button } from '@/components/ui/Button';
import { useSession } from '@/hooks/useSession';

/**
 * Driver messages page showing conversations with clients and other drivers.
 */
export default function DriverMessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { session } = useSession();

  const handleConversationCreated = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsModalOpen(false);
    // Refresh the conversation list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Mes messages</h1>
          <p className="text-on-surface-dim">
            Communiquez avec vos clients et collègues à propos de vos courses
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-on-surface/10 rounded-lg p-4">
            <h2 className="font-semibold text-on-surface mb-4">Conversations</h2>
            <ConversationList
              key={refreshKey}
              onSelect={setSelectedConversationId}
            />
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 h-96">
          {selectedConversationId && session?.userId ? (
            <ChatWindow
              conversationId={selectedConversationId}
              currentUserId={session.userId}
            />
          ) : (
            <div className="bg-surface border border-on-surface/10 rounded-lg p-8 text-center h-full flex items-center justify-center text-on-surface-dim">
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}
