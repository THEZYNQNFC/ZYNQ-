import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, CreditCard, Package, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const AdminOverviewPage: React.FC = () => {
  const adminStats = [
    { label: 'Registered Users', value: '2', change: '2 active accounts', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Hardware Cards Provisioned', value: '3', change: 'TC000123-125 batch', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Hardware Orders', value: '0', change: 'All batches dispatched', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Global Field Taps', value: '0', change: 'Awaiting field events', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Platform Administration
            </h1>
            <Badge variant="warning" size="sm" dot>Super Admin</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            System overview of hardware fleet provisioning, customer accounts, and manufacturing orders.
          </p>
        </div>

        <Link to="/admin/cards">
          <Button size="sm" leftIcon={<CreditCard className="w-4 h-4" />}>
            Provision Card Batch
          </Button>
        </Link>
      </div>

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {adminStats.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-8 h-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Grid: Pending Orders Fulfillment + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending NFC Card Physical Orders */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Pending Physical Card Orders
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Cards requiring encoding & shipment.</p>
            </div>
            <Link to="/admin/orders">
              <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                All Orders
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Order #ORD-9821</p>
                <p className="text-slate-500">2x Matte Black NFC • Priya Sharma</p>
              </div>
              <Badge variant="warning" size="sm">Pending Encoding</Badge>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Order #ORD-9820</p>
                <p className="text-slate-500">1x Bamboo Wood NFC • Liam Vance</p>
              </div>
              <Badge variant="info" size="sm">Ready to Ship</Badge>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Order #ORD-9819</p>
                <p className="text-slate-500">5x Custom Corporate Fleet • Vertex Labs</p>
              </div>
              <Badge variant="purple" size="sm">Production</Badge>
            </div>
          </div>
        </Card>

        {/* System Health & Security Architecture */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Infrastructure Status
            </h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Operational
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Firestore Zero-Trust ABAC</p>
                <p className="text-slate-500">Hardened rules enforcement active</p>
              </div>
              <Badge variant="success" size="sm">Enforced</Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">NFC Dynamic Routing Engine</p>
                <p className="text-slate-500">Average resolution latency 42ms</p>
              </div>
              <Badge variant="success" size="sm">Sub-50ms</Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">vCard Contact Generator</p>
                <p className="text-slate-500">RFC 2426 format compliant</p>
              </div>
              <Badge variant="success" size="sm">Active</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
