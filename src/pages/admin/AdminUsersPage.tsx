import React, { useState } from 'react';
import { Users, Search, Shield, UserX, Mail, Calendar } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const AdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 'usr_1', name: 'Alex Morgan', email: 'alex@tapcard.in', role: 'customer', cards: 2, createdAt: '2026-01-10' },
    { id: 'usr_2', name: 'Sarah Jenkins', email: 'sarah@nexusventures.com', role: 'customer', cards: 1, createdAt: '2026-02-14' },
    { id: 'usr_3', name: 'David Chen', email: 'david.c@hyperion.tech', role: 'customer', cards: 3, createdAt: '2026-02-28' },
    { id: 'usr_admin_001', name: 'System Administrator', email: 'anshalkale99@gmail.com', role: 'admin', cards: 5, createdAt: '2026-01-01' },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Registered Users Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View user accounts, assigned roles, and linked physical hardware cards.
          </p>
        </div>
      </div>

      <Card padding="sm" className="flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Filter users by name or email..."
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
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Cards Linked</th>
                <th className="px-6 py-3.5">Registered</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'warning' : 'neutral'} size="sm">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-mono">{user.cards}</td>
                  <td className="px-6 py-4 text-slate-500">{user.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">
                      Manage
                    </button>
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
