import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  ChevronRight, 
  Activity,
  Heart,
  Calendar,
  Home,
  ShieldCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

import { Screen } from '../types';
import { listarMembros, DEFAULT_FAMILY_GROUP_ID, MembroFamilia } from '../lib/api';

interface FamilyHubProps {
  onNavigate: (screen: Screen) => void;
}

export function FamilyHub({ onNavigate }: FamilyHubProps) {
  const [members, setMembers] = useState<MembroFamilia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMembers() {
      try {
        const data = await listarMembros(DEFAULT_FAMILY_GROUP_ID);
        if (!cancelled) {
          setMembers(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar membros da família.');
          setLoading(false);
        }
      }
    }
    loadMembers();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 size={36} className="animate-spin" />
        <p className="text-sm font-bold">Carregando membros da família...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 max-w-2xl mx-auto mt-10">
        <AlertCircle size={20} />
        <p className="text-sm font-bold">{error}</p>
      </div>
    );
  }

  const totalIncome = members.reduce((sum, m) => sum + (m.rendaMensal ?? 0), 0);
  const totalBudget = members.reduce((sum, m) => sum + (m.orcamentoMensal ?? 0), 0);

  const getRoleLabel = (papel?: string) => {
    if (papel === 'PROVEDOR_PRINCIPAL') return 'Provedor Principal';
    if (papel === 'CO_PROVEDOR') return 'Co-provedor';
    if (papel === 'DEPENDENTE') return 'Dependente';
    return papel || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">Domestic Harmony</p>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Family Coordination</h2>
        </div>
        <div className="flex gap-2">
          <button className="harmony-btn-secondary flex items-center gap-2">
            <Settings size={18} />
            <span>Circle Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hierarchy Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => {
              const contributionPercent = totalIncome > 0 ? Math.round(((member.rendaMensal ?? 0) / totalIncome) * 100) : 0;
              const expensesPercent = totalBudget > 0 ? Math.round(((member.orcamentoMensal ?? 0) / totalBudget) * 100) : 0;
              const isProvider = member.papelFinanceiro === 'PROVEDOR_PRINCIPAL' || member.papelFinanceiro === 'CO_PROVEDOR';
              
              return (
                <div 
                  key={member.id} 
                  onClick={() => onNavigate('providers')}
                  className="harmony-card group hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <div className="p-5 flex items-center gap-4 border-b border-border-subtle bg-slate-50/50">
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 p-0.5 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                        {member.nome ? member.nome[0] : '?'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        {member.nome}
                        {isProvider && <ShieldCheck size={14} className="text-brand-blue" />}
                      </h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{getRoleLabel(member.papelFinanceiro)}</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-brand-blue transition-colors" />
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Contribution</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-blue rounded-full" 
                            style={{ width: `${contributionPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-slate-900">{contributionPercent}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Expenses</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-rose-400 rounded-full" 
                            style={{ width: `${expensesPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-slate-900">{expensesPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button 
              onClick={() => onNavigate('add_family_member')}
              className="harmony-card border-dashed border-2 flex flex-col items-center justify-center p-8 gap-3 text-slate-400 hover:text-brand-blue hover:bg-slate-50 transition-all text-left w-full"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Users size={24} />
              </div>
              <p className="font-bold text-sm tracking-tight">Add Family Member</p>
            </button>
          </div>

          <div className="harmony-card p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Activity size={20} className="text-brand-blue" />
              Domestic Pulse
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Upcoming Bills', value: '4 Pending', status: 'Attention Needed', statusColor: 'bg-rose-100 text-rose-600', icon: Calendar },
                { label: 'Joint Liquidity', value: '$57,450.60', status: 'Balanced', statusColor: 'bg-emerald-100 text-emerald-600', icon: Home },
                { label: 'Family Well-being', value: 'Optimal', status: 'Stable', statusColor: 'bg-brand-light text-brand-blue', icon: Heart },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-light group-hover:text-brand-blue transition-colors">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-400 font-medium">{item.value}</p>
                    </div>
                  </div>
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", item.statusColor)}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Distribution Chart Placeholder */}
        <div className="space-y-6">
          <div className="harmony-card p-6 bg-brand-blue text-white overflow-hidden relative">
            <h3 className="text-white/60 text-xs font-black uppercase tracking-widest mb-2 font-display">Trust Distribution</h3>
            <p className="text-3xl font-display font-extrabold tracking-tight mb-8">Asset Allocation</p>
            <div className="space-y-6 relative z-10">
              {members.map(member => {
                const contributionPercent = totalIncome > 0 ? Math.round(((member.rendaMensal ?? 0) / totalIncome) * 100) : 0;
                return { ...member, contributionPercent };
              }).filter(f => f.contributionPercent > 0).map(m => (
                <div key={m.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{m.nome}</span>
                    <span>{m.contributionPercent}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${m.contributionPercent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <ShieldCheck size={160} className="translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="harmony-card p-6 border-brand-blue/10 bg-brand-light/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Users className="text-brand-blue" size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900 leading-tight">Sync Accounts</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Link family bank accounts to get a unified view of your household's net worth.</p>
                <button className="text-brand-blue text-xs font-bold mt-2 flex items-center gap-1 hover:underline">
                  Initiate Sync <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
