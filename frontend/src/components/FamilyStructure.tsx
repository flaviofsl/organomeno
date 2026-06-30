import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Map, 
  Shield, 
  ArrowRight,
  TrendingUp,
  UserPlus,
  Briefcase,
  Heart,
  MoreHorizontal,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';
import { listarMembros, DEFAULT_FAMILY_GROUP_ID, MembroFamilia } from '../lib/api';

interface FamilyStructureProps {
  onNavigate: (screen: Screen) => void;
}

const getAvatarUrl = (name: string, id?: number) => {
  const avatars = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop", // Male
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop", // Female
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop", // Male
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop", // Female
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop", // Female
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop", // Male
  ];
  if (!id) return avatars[0];
  return avatars[id % avatars.length];
};

export function FamilyStructure({ onNavigate }: FamilyStructureProps) {
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
      <div className="space-y-8 pb-12">
        <div>
          <h2 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Family Structure</h2>
          <p className="text-slate-500 mt-1">Visualizing roles and financial contributions.</p>
        </div>
        <div className="harmony-card bg-white border border-slate-200 p-12 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 size={36} className="animate-spin" />
            <p className="text-sm font-bold">Carregando estrutura familiar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 pb-12">
        <div>
          <h2 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Family Structure</h2>
          <p className="text-slate-500 mt-1">Visualizing roles and financial contributions.</p>
        </div>
        <div className="harmony-card bg-white border border-slate-200 p-12 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 max-w-2xl mx-auto">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const activeMembers = members.filter(m => m.ativo !== false);
  const providers = activeMembers.filter(m => m.papelFinanceiro === 'PROVEDOR_PRINCIPAL' || m.papelFinanceiro === 'CO_PROVEDOR');
  const dependents = activeMembers.filter(m => m.papelFinanceiro === 'DEPENDENTE');

  const totalIncome = activeMembers.reduce((sum, m) => sum + (m.rendaMensal ?? 0), 0);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Family Structure</h2>
        <p className="text-slate-500 mt-1">Visualizing roles and financial contributions.</p>
      </div>

      <div className="harmony-card bg-white border border-slate-200 p-12 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
        {activeMembers.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-slate-500 font-medium">Nenhum membro cadastrado nesta família.</p>
            <button 
              onClick={() => onNavigate('family')}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm uppercase tracking-widest"
            >
              Ir para Family Hub
            </button>
          </div>
        ) : (
          <div className="w-full max-w-5xl flex flex-col items-center">
            {/* Top Level: Providers */}
            <div className="flex flex-wrap justify-center gap-12 relative z-10">
              {providers.map((m) => {
                const contributionPercent = totalIncome > 0 ? Math.round(((m.rendaMensal ?? 0) / totalIncome) * 100) : 0;
                return (
                  <div key={m.id} className="w-64 harmony-card bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 flex items-center gap-4 border-b border-slate-50">
                      <img 
                        src={getAvatarUrl(m.nome ?? '', m.id)} 
                        alt={m.nome} 
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-display font-bold text-slate-900">{m.nome}</p>
                        <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-md">
                          {m.papelFinanceiro === 'PROVEDOR_PRINCIPAL' ? 'Provedor Principal' : 'Co-provedor'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center bg-slate-50/50">
                      <span className="text-xs font-semibold text-slate-500 tracking-tight">Contribuição:</span>
                      <span className="text-sm font-black text-slate-900">{contributionPercent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connection Lines */}
            {providers.length > 0 && dependents.length > 0 && (
              <div className="w-full h-8 flex justify-center relative">
                <div className="w-0.5 h-full bg-slate-200"></div>
              </div>
            )}

            {/* Bottom Level: Dependents */}
            {dependents.length > 0 && (
              <div className="w-full relative">
                <div className="flex flex-wrap justify-center gap-12 items-start relative">
                  {dependents.map((m, index) => (
                    <div key={m.id} className="relative flex flex-col items-center pt-8">
                      {/* Horizontal connector line segments */}
                      {dependents.length > 1 && (
                        <div 
                          className="absolute top-0 h-0.5 bg-slate-200" 
                          style={{
                            left: index === 0 ? '50%' : '0',
                            right: index === dependents.length - 1 ? '50%' : '0',
                          }} 
                        />
                      )}
                      {/* Vertical connector line up to the horizontal bar */}
                      <div className="absolute top-0 w-0.5 h-8 bg-slate-200"></div>

                      {/* Card */}
                      <div className="w-64 harmony-card bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6 flex flex-col items-center text-center">
                          <img 
                            src={getAvatarUrl(m.nome ?? '', m.id)} 
                            alt={m.nome} 
                            className="w-12 h-12 rounded-lg object-cover mb-3"
                          />
                          <p className="font-display font-bold text-slate-900 mb-1">{m.nome}</p>
                          <span className="inline-block px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-wider rounded-md mb-6">
                            Dependente
                          </span>
                          <div className="w-full flex justify-between items-center pt-4 border-t border-slate-50 uppercase tracking-tighter">
                            <span className="text-[11px] font-bold text-slate-400">Custo Mensal:</span>
                            <span className="text-xs font-black text-rose-600">
                              {m.orcamentoMensal !== undefined && m.orcamentoMensal !== null 
                                ? `R$ ${Number(m.orcamentoMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                                : '—'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
