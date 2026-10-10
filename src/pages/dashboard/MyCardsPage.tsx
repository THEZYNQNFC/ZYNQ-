import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Plus, Wifi, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card as CardContainer } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { NfcBadge } from '../../components/nfc/NfcBadge';
import { useToast } from '../../hooks/useToast';
import { Card as CardType } from '../../types/card';
import { cardService } from '../../services/cardService';
import { useAuth } from '../../hooks/useAuth';

export const MyCardsPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const currentProfileSlug =
    localStorage.getItem('tapcard_last_saved_username') ||
    user?.username ||
    user?.name?.toLowerCase().replace(/\s+/g, '-') ||
    'profile';

  const [cards, setCards] = useState<CardType[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);

  React.useEffect(() => {
    async function loadCards() {
      setLoadingCards(true);
      try {
        const userId = user?.userId || 'usr_demo_101';
        const fetched = await cardService.getUserCards(userId);
        if (fetched && fetched.length > 0) {
          // Sync profileId to current profile
          const updated = fetched.map((c) => ({
            ...c,
            profileId: currentProfileSlug,
          }));
          setCards(updated);
        } else {
          // Check if local cards exist
          const localSaved = localStorage.getItem('tapcard_cards');
          if (localSaved) {
            try {
              const parsed = JSON.parse(localSaved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setCards(parsed);
                return;
              }
            } catch {}
          }
          setCards([]);
        }
      } catch (err) {
        console.warn('Error loading cards:', err);
      } finally {
        setLoadingCards(false);
      }
    }
    loadCards();
  }, [user?.userId, currentProfileSlug]);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [newCardId, setNewCardId] = useState('');
  const [newCardLabel, setNewCardLabel] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  const handleLinkCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardId.trim()) {
      toast.error('Please enter the hardware card ID.');
      return;
    }

    setIsActivating(true);
    try {
      const formattedCardId = newCardId.trim().toUpperCase();
      const userId = user?.userId || 'usr_demo_101';

      await cardService.activateCard(formattedCardId, userId, currentProfileSlug);

      setCards((prev) => [
        ...prev,
        {
          cardId: formattedCardId,
          userId,
          profileId: currentProfileSlug,
          status: 'active',
          createdAt: new Date().toISOString(),
          activatedAt: new Date().toISOString(),
          label: newCardLabel || `NFC Card #${prev.length + 1}`,
        },
      ]);

      toast.success(`Card ${formattedCardId} successfully linked to your profile!`);
      setIsLinkModalOpen(false);
      setNewCardId('');
      setNewCardLabel('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to activate card.');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            My NFC Hardware Cards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your physical business cards and monitor their dynamic routing.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsLinkModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Link New NFC Card
        </Button>
      </div>

      {/* Cards List Grid or Empty State */}
      {cards.length === 0 ? (
        <CardContainer padding="lg" className="text-center py-12 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No NFC cards linked yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5 leading-relaxed">
            Link your physical NFC hardware card using the hardware ID provided with your card package.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsLinkModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Link Physical Card
            </Button>
          </div>
        </CardContainer>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div key={card.cardId} className="space-y-3">
              <NfcBadge cardId={card.cardId} status={card.status} label={card.label} />

              <CardContainer padding="sm" className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Hardware URL:</span>
                  <span className="font-mono font-medium text-slate-900">
                    https://tapcard.in/c/{card.cardId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Resolved Target:</span>
                  <span className="font-mono text-emerald-700 font-semibold">
                    /u/{card.profileId}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-400">Activated on {new Date(card.createdAt).toLocaleDateString()}</span>
                  <Link
                    to={`/c/${card.cardId}`}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                  >
                    Test Tap <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </CardContainer>
            </div>
          ))}
        </div>
      )}

      {/* Physical Card Order Promotion */}
      <CardContainer padding="lg" className="bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border-slate-800">
        <div>
          <Badge variant="purple" size="sm" className="mb-2">Physical Hardware</Badge>
          <h3 className="text-lg font-bold">Need additional cards for your team or spares?</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Order premium matte black, metallic silver, or laser-engraved bamboo NFC cards pre-encoded with your unique hardware URL.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            toast.info('Hardware store opening soon! For bulk card orders, contact hardware@tapcard.in');
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shrink-0"
        >
          Order New Cards
        </Button>
      </CardContainer>

      {/* Link Card Modal */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        title="Link Physical NFC Card"
        description="Enter the hardware identifier printed on the packaging or back of your card."
      >
        <form onSubmit={handleLinkCard} className="space-y-4">
          <Input
            label="NFC Card Identifier *"
            placeholder="e.g. TC000125"
            value={newCardId}
            onChange={(e) => setNewCardId(e.target.value)}
            helperText="Located on your card box or received via order email."
            required
          />
          <Input
            label="Card Nickname (Optional)"
            placeholder="e.g. My Metal Executive Card"
            value={newCardLabel}
            onChange={(e) => setNewCardLabel(e.target.value)}
          />

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Once linked, tapping this card will instantly resolve to your current profile without exposing personal data on the chip itself.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsLinkModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isActivating}>
              Activate & Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
