import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Search, ExternalLink } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AdminProfilesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const profiles = [
    { username: 'alex-morgan', fullName: 'Alex Morgan', title: 'Founder & Managing Director', company: 'Aura Venture Labs', theme: 'modern-slate', createdAt: '2026-01-10' },
    { username: 'sarah-jenkins', fullName: 'Sarah Jenkins', title: 'General Partner', company: 'Nexus Ventures', theme: 'emerald', createdAt: '2026-02-14' },
    { username: 'david-chen', fullName: 'David Chen', title: 'VP of Hardware', company: 'Hyperion Robotics', theme: 'onyx', createdAt: '2026-02-28' },
  ];

  const filtered = profiles.filter(
    (p) =>
      p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Customer Digital Profiles
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Public digital business cards published on the platform.
        </p>
      </div>

      <Card padding="sm" className="flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Search profiles by username, name, or company..."
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
                <th className="px-6 py-3.5">Public URL Slug</th>
                <th className="px-6 py-3.5">Display Name</th>
                <th className="px-6 py-3.5">Title & Company</th>
                <th className="px-6 py-3.5">Theme</th>
                <th className="px-6 py-3.5">Created</th>
                <th className="px-6 py-3.5 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.username} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                    /u/{p.username}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{p.fullName}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {p.title} • {p.company}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="purple" size="sm">{p.theme}</Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{p.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/u/${p.username}`}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                    >
                      Open Card <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
