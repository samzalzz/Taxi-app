'use client';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface ChatBubbleProps {
  message: {
    id: string;
    content: string;
    sender: User;
    createdAt: string;
    readAt?: string;
  };
  isOwn: boolean;
}

/**
 * ChatBubble displays a single message in iMessage style.
 * Own messages appear on the right, others on the left.
 */
export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const createdAt = new Date(message.createdAt);
  const timeStr = createdAt.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      {!isOwn && message.sender.avatar && (
        <img
          src={message.sender.avatar}
          alt={message.sender.name}
          className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
        />
      )}

      <div
        className={`max-w-xs lg:max-w-md ${
          isOwn
            ? 'bg-warning text-black rounded-3xl rounded-tr-none'
            : 'bg-on-surface/10 text-on-surface rounded-3xl rounded-tl-none'
        } px-4 py-2`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold opacity-75 mb-1">
            {message.sender.name}
          </p>
        )}
        <p className="text-sm break-words">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? 'text-black/70' : 'text-on-surface-dim'
          }`}
        >
          {timeStr}
          {isOwn && message.readAt && ' ✓✓'}
          {isOwn && !message.readAt && ' ✓'}
        </p>
      </div>
    </div>
  );
}
