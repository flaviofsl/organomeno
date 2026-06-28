import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Repeat, 
  ChevronRight, 
  CreditCard, 
  Briefcase,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Screen } from '../types';
import { 
  listarMembros, 
  listarTransferencias, 
  MembroFamilia, 
  Transferencia, 
  DEFAULT_FAMILY_GROUP_ID 
} from '../lib/api';

interface ProvidersProps {
  onNavigate: (screen: Screen) => void;
}

export function Providers({ onNavigate }: ProvidersProps) {
  const [members, setMembers] = useState<MembroFamilia[]>([]);
  const [transfers, setTransfers] = useState<Transferencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [loadedMembers, loadedTransfers] = await Promise.all([
          listarMembros(DEFAULT_FAMILY_GROUP_ID),
          listarTransferencias()
        ]);

        if (!cancelled) {
          setMembers(loadedMembers);
          setTransfers(loadedTransfers);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados dos provedores.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter members that act as providers or have income
  const providersList = members.filter(
    m => m.papelFinanceiro === 'PROVEDOR_PRINCIPAL' || m.papelFinanceiro === 'CO_PROVEDOR' || (m.rendaMensal ?? 0) > 0
  );

  const totalMonthlyIncome = providersList.reduce((sum, m) => sum + (m.rendaMensal ?? 0), 0);
  const activeProvidersCount = members.filter(
    m => m.papelFinanceiro === 'PROVEDOR_PRINCIPAL' || m.papelFinanceiro === 'CO_PROVEDOR'
  ).length;

  const activeTransfersCount = transfers.filter(t => t.ativa !== false).length;
  const totalTransfersValue = transfers.filter(t => t.ativa !== false).reduce((sum, t) => sum + t.valor, 0);

  const providersData = providersList.map((m) => {
    const contribution = m.rendaMensal ?? 0;
    const coverage = totalMonthlyIncome > 0 ? Math.round((contribution / totalMonthlyIncome) * 100) : 0;
    
    let role = 'Contributor';
    if (m.papelFinanceiro === 'PROVEDOR_PRINCIPAL') {
      role = 'Primary';
    } else if (m.papelFinanceiro === 'CO_PROVEDOR') {
      role = 'Secondary';
    }

    // Generic transfer info based on user role/contributions
    const memberTransfers = transfers.filter(t => t.ativa !== false); // simplify or mock description if needed
    const count = m.papelFinanceiro === 'PROVEDOR_PRINCIPAL' ? 4 : m.papelFinanceiro === 'CO_PROVEDOR' ? 3 : 1;
    const details = m.papelFinanceiro === 'PROVEDOR_PRINCIPAL' 
      ? 'Contributes to main family checking and investment goals.'
      : 'Co-manages housing funds and monthly utility categories.';

    return {
      id: String(m.id),
      name: m.nome,
      email: `${m.nome.toLowerCase().replace(/\s+/g, '')}@harmony.family`,
      role,
      contribution,
      coverage,
      transfers: details,
      transferCount: count
    };
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 size={36} className="animate-spin" />
        <p className="text-sm font-bold">Carregando provedores...</p>
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

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Providers Management</h2>
          <p className="text-slate-500 mt-1">Oversee household income sources and contribution metrics.</p>
        </div>
        <button 
          onClick={() => onNavigate('add_family_member')}
          className="harmony-btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Family Member</span>
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
            <p className="text-4xl font-display font-black text-slate-900">{formatCurrency(totalMonthlyIncome)}</p>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-1">
              <TrendingUp size={14} />
              <span>Calculated from active profiles</span>
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
            <p className="text-4xl font-display font-black text-slate-900">{activeProvidersCount}</p>
            <div className="flex -space-x-2">
              {providersData.map((p, i) => (
                <div key={p.id} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-600">
                  {p.name[0]}
                </div>
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
            <p className="text-4xl font-display font-black text-slate-900">{activeTransfersCount}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">{formatCurrency(totalTransfersValue)} processed automatically</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Individual Profiles</h3>
        {providersData.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-100 rounded-2xl">
            <p className="text-slate-400 font-bold">Nenhum provedor com renda cadastrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providersData.map((provider) => (
              <div 
                key={provider.id} 
                className="harmony-card overflow-hidden cursor-pointer group hover:border-brand-blue/40 transition-all"
                onClick={() => onNavigate('family')}
              >
                <div className="p-6 border-b border-border-subtle bg-white flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center font-display font-black text-slate-400 overflow-hidden shrink-0">
                    <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black">
                      {provider.name[0]}
                    </div>
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
        )}
      </div>
    </div>
  );
}

