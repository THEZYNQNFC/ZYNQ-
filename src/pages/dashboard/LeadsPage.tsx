import React, { useState, useEffect } from 'react';
import { Users, Download, Mail, Phone, Building, Search, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { Lead } from '../../types/lead';

export const LeadsPage: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tapcard_leads');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setLeads(parsed);
          return;
        }
      }
    } catch {}
    setLeads([]);
  }, [user?.userId]);

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.info('No leads to export.');
      return;
    }
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Email,Phone,Company,Note,Date']
        .concat(
          filteredLeads.map(
            (l) =>
              `"${l.name}","${l.email}","${l.phone || ''}","${l.company || ''}","${l.note || ''}","${l.createdAt}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tapcard_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Exported leads to CSV file.');
  };

  const previewSlug =
    localStorage.getItem('tapcard_last_saved_username')?.replace(/^@+/, '').toLowerCase() ||
    user?.username ||
    'profile';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Captured Leads & Contacts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Every contact collected from people who tapped your card and submitted the exchange form.
          </p>
        </div>

        {leads.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4 text-slate-600" />}
          >
            Export CSV ({leads.length})
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      {leads.length > 0 && (
        <Card padding="sm" className="flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          <input
            type="text"
            placeholder="Search leads by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm outline-none bg-transparent placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2"
            >
              Clear
            </button>
          )}
        </Card>
      )}

      {/* Leads Table or Empty State */}
      {leads.length === 0 ? (
        <Card padding="lg" className="text-center py-12 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No leads captured yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5 leading-relaxed">
            When people tap your card or view your digital profile and submit the "Exchange Contact" form, their information will appear here.
          </p>
          <Link to={`/u/${previewSlug}`}>
            <Button size="sm" variant="outline" leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}>
              Test Lead Exchange on Live Card
            </Button>
          </Link>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 uppercase tracking-wider font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Contact Name</th>
                  <th className="px-6 py-3.5">Company / Role</th>
                  <th className="px-6 py-3.5">Direct Channels</th>
                  <th className="px-6 py-3.5">Context / Note</th>
                  <th className="px-6 py-3.5">Captured Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {lead.company || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-slate-600 font-mono">
                        <a href={`mailto:${lead.email}`} className="text-emerald-700 hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" /> {lead.email}
                        </a>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {lead.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs text-slate-600 truncate">
                      {lead.note || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
