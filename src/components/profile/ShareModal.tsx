import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  fullName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  username,
  fullName = 'TapCard',
}) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://tapcard.in';
  const fullUrl = `${currentHost}/u/${username}`;
  const brandedUrl = `https://tapcard.in/u/${username}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    fullUrl
  )}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = fullUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success('Profile URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fullName}'s Digital Business Card`,
          text: `Connect with ${fullName} via TapCard:`,
          url: fullUrl,
        });
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const shareText = encodeURIComponent(`Connect with ${fullName} via TapCard: ${fullUrl}`);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your TapCard"
      description="Share your digital card link or let someone scan your QR code."
    >
      <div className="space-y-5 pt-1">
        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200/90 text-center">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200/80 mb-3">
            <img
              src={qrImageUrl}
              alt={`QR Code for ${username}`}
              className="w-44 h-44 object-contain rounded-lg"
              loading="lazy"
            />
          </div>
          <p className="text-xs font-semibold text-slate-900">{fullName}</p>
          <p className="text-[11px] font-mono text-emerald-600 mt-0.5">{brandedUrl}</p>
          <p className="text-[11px] text-slate-500 mt-1">Point any smartphone camera to view card</p>
        </div>

        {/* Copy Link Input Bar */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Card Link
          </label>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xs focus-within:border-slate-900">
            <input
              type="text"
              readOnly
              value={brandedUrl}
              className="flex-1 px-2.5 py-1 text-xs font-mono text-slate-800 bg-transparent outline-none truncate"
            />
            <Button
              type="button"
              size="sm"
              variant={copied ? 'secondary' : 'primary'}
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* 1-Click Share Channels */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Quick Share
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-colors text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">WhatsApp</span>
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-200 transition-colors text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-1 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">LinkedIn</span>
            </a>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 hover:border-slate-300 transition-colors text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-1 group-hover:bg-black transition-colors text-xs font-bold">
                𝕏
              </div>
              <span className="text-[11px] font-semibold text-slate-700">X (Twitter)</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(`${fullName}'s Digital Business Card`)}&body=${shareText}`}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-purple-50 hover:border-purple-200 transition-colors text-center group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-1 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Email</span>
            </a>
          </div>
        </div>

        {/* Native Share button if supported */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleNativeShare}
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            More Share Options
          </Button>
        )}
      </div>
    </Modal>
  );
};
