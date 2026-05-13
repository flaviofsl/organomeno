import React from 'react';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Repeat, 
  ChevronRight, 
  CreditCard, 
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { MOCK_FAMILY } from '../constants';
import { Screen } from '../types';

interface ProvidersProps {
  onNavigate: (screen: Screen) => void;
}

export function Providers({ onNavigate }: ProvidersProps) {
  const providersData = [
    { 
      id: 'f1', 
      name: 'João', 
      email: 'joao@harmony.family', 
      role: 'Primary', 
      contribution: 12000, 
      coverage: 49,
      transfers: 'Includes Mortgage ($3,500) and Investment Account ($1,200).',
      transferCount: 4
    },
    { 
      id: 'f2', 
      name: 'Maria', 
      email: 'maria@harmony.family', 
      role: 'Secondary', 
      contribution: 8500, 
      coverage: 35,
      transfers: 'Includes Utilities ($450) and Education Fund ($1,000).',
      transferCount: 5
    },
    { 
      id: 'f3', 
      name: 'Ana', 
      email: 'ana@harmony.family', 
      role: 'Contributor', 
      contribution: 2500, 
      coverage: 10,
      transfers: 'Groceries ($800) and Entertainment Subs ($120).',
      transferCount: 2
    },
    { 
      id: 'f4', 
      name: 'Pedro', 
      email: 'pedro@harmony.family', 
      role: 'Contributor', 
      contribution: 1500, 
      coverage: 6,
      transfers: 'Vehicle Lease Payment ($450).',
      transferCount: 1
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Providers Management</h2>
          <p className="text-slate-500 mt-1">Oversee household income sources and contribution metrics.</p>
        </div>
        <button className="harmony-btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Add Contribution</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="harmony-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <CreditCard size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest leading-none">Total Monthly Income</span>
          </div>
          <div>
            <p className="text-4xl font-display font-black text-slate-900">$24,500</p>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-1">
              <TrendingUp size={14} />
              <span>+3.2% from last month</span>
            </div>
          </div>
        </div>

        <div className="harmony-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <Users size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest leading-none">Active Providers</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-4xl font-display font-black text-slate-900">4</p>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
              ))}
            </div>
          </div>
        </div>

        <div className="harmony-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <Repeat size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest leading-none">Automated Transfers</span>
          </div>
          <div>
            <p className="text-4xl font-display font-black text-slate-900">12</p>
            <p className="text-xs font-bold text-slate-500 mt-1">$8,200 processed automatically</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Individual Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providersData.map((provider) => (
            <div 
              key={provider.id} 
              className="harmony-card overflow-hidden cursor-pointer group hover:border-brand-blue/40 transition-all"
              onClick={() => onNavigate('dependents')}
            >
              <div className="p-6 border-b border-border-subtle bg-white flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center font-display font-black text-slate-400 overflow-hidden shrink-0">
                  {/* Placeholder for Profile Image */}
                  <div className="w-full h-full bg-slate-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg text-slate-900 truncate">{provider.name}</h4>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                      provider.role === 'Primary' ? "bg-slate-900 text-white" :
                      provider.role === 'Secondary' ? "bg-brand-blue text-white" :
                      "bg-brand-light text-brand-blue"
                    )}>
                      {provider.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium truncate">{provider.email}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-end gap-8">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Monthly Contribution</p>
                    <p className="text-xl font-display font-black text-slate-900">{formatCurrency(provider.contribution)}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Budget Coverage</p>
                      <span className="text-[10px] font-black text-slate-900">{provider.coverage}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-blue rounded-full" 
                        style={{ width: `${provider.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-light/30 border border-brand-blue/10 rounded-xl p-4 flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-brand-blue transition-colors">
                    <Repeat size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">{provider.transferCount} Recurring Transfers</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{provider.transfers}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
