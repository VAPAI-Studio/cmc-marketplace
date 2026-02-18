import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Spinner } from './ui';
import { inquiriesApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToastHelpers } from './ui';

interface InquiryModalProps {
  listingId: string;
  listingTitle: string;
  onClose: () => void;
}

export function InquiryModal({ listingId, listingTitle, onClose }: InquiryModalProps) {
  const { user } = useAuth();
  const toast = useToastHelpers();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.display_name || '');
  const [company, setCompany] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;
    setSubmitting(true);
    try {
      await inquiriesApi.create({
        listing_id: listingId,
        message,
        buyer_contact_email: email,
        buyer_name: name || undefined,
        company_name: company || undefined,
      });
      toast.success('Inquiry sent! The creator will be notified.');
      onClose();
    } catch (err) {
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
    >
      <div className="bg-white rounded-xl max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-warm-gray-200 flex items-center justify-between">
          <div>
            <h2 id="inquiry-modal-title" className="text-xl font-bold text-cmc-navy">Request Info</h2>
            <p className="text-sm text-warm-gray-500 mt-1">{listingTitle}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close dialog">✕</Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Your Name</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="label">Contact Email *</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="label">Company / Studio</label>
            <input
              type="text"
              className="input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Netflix, Amazon, etc."
            />
          </div>
          <div>
            <label className="label">Message *</label>
            <textarea
              className="input min-h-[120px] resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the creator why you're interested in this IP..."
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting || !message.trim() || !email.trim()}>
              {submitting ? <Spinner size="sm" /> : 'Send Inquiry'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
