import React from 'react';
import { Inbox, Download, Mail, Phone } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AdminLeadsPage: React.FC = () => {
  const globalLeads = [
    { id: '1', targetUser: 'alex-morgan', name: 'Sarah Jenkins', email: 'sarah@nexusventures.com', company: 'Nexus Ventures', createdAt: '2026-03-01' },
    { id: '2', targetUser: 'alex-morgan', name: 'David Chen', email: 'david.c@hyperion.tech', company: 'Hyperion Robotics', createdAt: '2026-02-28' },
    { id: '3', targetUser: 'sarah-jenkins', name: 'Michael Scott', email: 'm.scott@dundermifflin.com', company: 'Dunder Mifflin', createdAt: '2026-02-27' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Global Lead Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Audit telemetry of visitor contacts captured across all active cards.
        </p>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Target Profile</th>
                <th className="px-6 py-3.5">Lead Contact</th>
                <th className="px-6 py-3.5">Organization</th>
                <th className="px-6 py-3.5">Date Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {globalLeads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-mono font-semibold text-emerald-700">
                    /u/{l.targetUser}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{l.name}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{l.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{l.company}</td>
                  <td className="px-6 py-4 text-slate-500">{l.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
