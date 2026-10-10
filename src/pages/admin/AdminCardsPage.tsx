import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Plus, Wifi, Search, ShieldCheck, ExternalLink } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';

export const AdminCardsPage: React.FC = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [provisionPrefix, setProvisionPrefix] = useState('TC');
  const [provisionCount, setProvisionCount] = useState(10);

  const [cards, setCards] = useState([
    { cardId: 'TC000123', userId: 'usr_demo_101', profileId: 'alex-morgan', status: 'active', createdAt: '2026-01-10' },
    { cardId: 'TC000124', userId: 'usr_demo_101', profileId: 'alex-morgan', status: 'active', createdAt: '2026-01-12' },
    { cardId: 'TC000125', userId: null, profileId: null, status: 'unassigned', createdAt: '2026-02-01' },
    { cardId: 'TC000126', userId: null, profileId: null, status: 'unassigned', createdAt: '2026-02-01' },
    { cardId: 'TC000127', userId: 'usr_2', profileId: 'sarah-jenkins', status: 'active', createdAt: '2026-02-15' },
    { cardId: 'TC000128', userId: 'usr_3', profileId: 'david-chen', status: 'suspended', createdAt: '2026-02-20' },
  ]);

  const handleBatchProvision = (e: React.FormEvent) => {
    e.preventDefault();
    const newItems = Array.from({ length: Number(provisionCount) }, (_, i) => ({
      cardId: `${provisionPrefix}${String(cards.length + 100 + i).padStart(6, '0')}`,
      userId: null,
      profileId: null,
      status: 'unassigned' as const,
      createdAt: new Date().toISOString().split('T')[0],
    }));

    setCards((prev) => [...prev, ...newItems]);
    toast.success(`Successfully provisioned ${provisionCount} new hardware NFC cards!`);
    setIsProvisionModalOpen(false);
  };

  const filteredCards = cards.filter(
    (c) =>
      c.cardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.profileId && c.profileId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Hardware NFC Fleet Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pre-encode, provision, and track physical NFC cards before and after customer assignment.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsProvisionModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Provision Card Batch
        </Button>
      </div>

      <Card padding="sm" className="flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Search by Card ID (e.g. TC000123) or linked profile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm outline-none bg-transparent placeholder:text-slate-400"
        />
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Hardware Card ID</th>
                <th className="px-6 py-3.5">NFC Hardware URL</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Linked Target</th>
                <th className="px-6 py-3.5">Provisioned</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredCards.map((card) => (
                <tr key={card.cardId} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-bold text-slate-900">{card.cardId}</td>
                  <td className="px-6 py-4 text-slate-500">
                    <Link
                      to={`/c/${card.cardId}`}
                      className="text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      /c/{card.cardId} <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-sans">
                    <Badge
                      variant={
                        card.status === 'active'
                          ? 'success'
                          : card.status === 'unassigned'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {card.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-sans text-slate-600">
                    {card.profileId ? (
                      <Link to={`/u/${card.profileId}`} className="text-sky-600 hover:underline">
                        /u/{card.profileId}
                      </Link>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-sans">{card.createdAt}</td>
                  <td className="px-6 py-4 text-right font-sans">
                    <Link
                      to={`/c/${card.cardId}`}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Simulate Tap
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        title="Batch Provision Hardware Cards"
        description="Generates new unique NFC card identifiers in Firestore ready for factory encoding."
      >
        <form onSubmit={handleBatchProvision} className="space-y-4">
          <Input
            label="ID Prefix"
            value={provisionPrefix}
            onChange={(e) => setProvisionPrefix(e.target.value.toUpperCase())}
            required
          />
          <Input
            label="Batch Quantity"
            type="number"
            min={1}
            max={500}
            value={provisionCount}
            onChange={(e) => setProvisionCount(Number(e.target.value))}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsProvisionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Generate Batch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
