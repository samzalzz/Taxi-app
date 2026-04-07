'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ComplaintCardProps {
  complaint: {
    id: string;
    category: string;
    description: string;
    status: string;
    createdAt: string;
    complainant: { name: string; email: string };
    against?: { name: string };
    replies: Array<{
      id: string;
      content: string;
      author: { name: string };
      createdAt: string;
    }>;
  };
  canReply?: boolean;
  onReply?: (complaintId: string, content: string) => Promise<void>;
}

const CATEGORY_LABELS: Record<string, string> = {
  DRIVER_BEHAVIOR: 'Comportement du chauffeur',
  VEHICLE_CONDITION: 'État du véhicule',
  PRICING_DISPUTE: 'Litige tarifaire',
  LATE_PICKUP: 'Retard à la prise en charge',
  ROUTE_DEVIATION: 'Déviation de trajet',
  TECHNICAL_ISSUE: 'Problème technique',
  OTHER: 'Autre',
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-warning/10 text-warning border-warning/20',
  UNDER_REVIEW: 'bg-info/10 text-info border-info/20',
  RESOLVED: 'bg-success/10 text-success border-success/20',
  DISMISSED: 'bg-error/10 text-error border-error/20',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Ouvert',
  UNDER_REVIEW: 'En examen',
  RESOLVED: 'Résolu',
  DISMISSED: 'Rejeté',
};

/**
 * ComplaintCard displays a complaint with status, replies, and reply form.
 */
export function ComplaintCard({
  complaint,
  canReply = false,
  onReply,
}: ComplaintCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !onReply) return;

    setIsSubmitting(true);
    try {
      await onReply(complaint.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createdDate = new Date(complaint.createdAt).toLocaleDateString('fr-FR');

  return (
    <div className="border border-on-surface/10 rounded-lg overflow-hidden bg-surface">
      {/* Header */}
      <div className="p-4 bg-surface-light border-b border-on-surface/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-on-surface">
              {CATEGORY_LABELS[complaint.category] || complaint.category}
            </p>
            <p className="text-xs text-on-surface-dim mt-1">{createdDate}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              STATUS_COLORS[complaint.status]
            }`}
          >
            {STATUS_LABELS[complaint.status]}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 space-y-4 border-b border-on-surface/10">
        <div>
          <p className="text-sm font-medium text-on-surface mb-2">Détails</p>
          <p className="text-sm text-on-surface-dim whitespace-pre-wrap">
            {complaint.description}
          </p>
        </div>

        {complaint.against && (
          <div className="text-xs text-on-surface-dim">
            Concernant: <span className="font-semibold">{complaint.against.name}</span>
          </div>
        )}
      </div>

      {/* Replies */}
      {complaint.replies.length > 0 && (
        <div className="p-4 space-y-3 border-b border-on-surface/10 bg-on-surface/5">
          <p className="text-sm font-semibold text-on-surface">
            Réponses ({complaint.replies.length})
          </p>
          {complaint.replies.map((reply) => (
            <div key={reply.id} className="bg-surface p-3 rounded-lg">
              <p className="text-xs font-medium text-on-surface mb-1">
                {reply.author.name}
              </p>
              <p className="text-sm text-on-surface mb-1">{reply.content}</p>
              <p className="text-xs text-on-surface-dim">
                {new Date(reply.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {canReply && onReply && (
        <div className="p-4">
          {!isReplying ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsReplying(true)}
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ajouter une réponse
            </Button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                maxLength={5000}
                rows={4}
                placeholder="Écrivez votre réponse..."
                className="w-full px-3 py-2 bg-on-surface/5 border border-on-surface/10 rounded-lg text-on-surface placeholder-on-surface-dim focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  disabled={isSubmitting || !replyContent.trim()}
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  Envoyer
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
