import React from 'react';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const AdminOrdersPage: React.FC = () => {
  const orders = [
    { id: 'ORD-9821', customer: 'Priya Sharma', email: 'priya@apex.co', item: '2x Matte Black NFC', amount: '$78.00', status: 'pending', date: '2026-03-02' },
    { id: 'ORD-9820', customer: 'Liam Vance', email: 'liam@vancecap.com', item: '1x Bamboo Wood NFC', amount: '$45.00', status: 'processing', date: '2026-03-01' },
    { id: 'ORD-9819', customer: 'Vertex Labs', email: 'ops@vertexlabs.io', item: '5x Custom Executive Fleet', amount: '$240.00', status: 'shipped', date: '2026-02-28' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Physical Card Orders Fulfillment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Track production, chip encoding, and delivery tracking of customer hardware.
        </p>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Order ID</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Hardware Item</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Fulfillment Status</th>
                <th className="px-6 py-3.5">Order Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{ord.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{ord.customer}</p>
                    <p className="text-slate-500 text-[11px]">{ord.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{ord.item}</td>
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900">{ord.amount}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        ord.status === 'shipped'
                          ? 'success'
                          : ord.status === 'processing'
                          ? 'info'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {ord.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{ord.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer">
                      Encode / Ship
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
