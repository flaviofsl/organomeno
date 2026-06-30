import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  PencilLine, 
  TrendingUp,
  Info,
  ChevronRight,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { 
  listarMembros, 
  atualizarMembro, 
  MembroFamilia, 
  DEFAULT_FAMILY_GROUP_ID 
} from '../lib/api';

export function Dependents() {
  const [members, setMembers] = useState<MembroFamilia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDependentId, setSelectedDependentId] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const loadedMembers = await listarMembros(DEFAULT_FAMILY_GROUP_ID);
        if (!cancelled) {
          setMembers(loadedMembers);
          
          const deps = loadedMembers.filter(m => m.papelFinanceiro === 'DEPENDENTE');
          const initialBudgets: Record<number, number> = {};
          deps.forEach(d => {
            if (d.id !== undefined) initialBudgets[d.id] = d.orcamentoMensal ?? 0;
          });
          setBudgets(initialBudgets);
          
          if (deps.length > 0) {
            setSelectedDependentId(deps[0].id ?? null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados dos dependentes.');
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

  const dependentsList = members.filter(m => m.papelFinanceiro === 'DEPENDENTE');
  const providersList = members.filter(
    m => m.papelFinanceiro === 'PROVEDOR_PRINCIPAL' || m.papelFinanceiro === 'CO_PROVEDOR'
  );

  const totalIncome = providersList.reduce((sum, m) => sum + (m.rendaMensal ?? 0), 0);
  const totalAvailable = totalIncome > 0 ? totalIncome : 8000;

  const selectedDependent = dependentsList.find(d => d.id === selectedDependentId) || dependentsList[0];

  const totalAllocated = (Object.values(budgets) as number[]).reduce((sum, val) => sum + val, 0);
  const unallocated = totalAvailable - totalAllocated;

  const handleReset = () => {
    const initialBudgets: Record<number, number> = {};
    dependentsList.forEach(d => {
      if (d.id !== undefined) initialBudgets[d.id] = d.orcamentoMensal ?? 0;
    });
    setBudgets(initialBudgets);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const promises = dependentsList.map(dep => {
        const newBudget = budgets[dep.id!] ?? 0;
        const { id, ...membroPayload } = dep;
        return atualizarMembro(dep.id!, {
          ...membroPayload,
          orcamentoMensal: newBudget
        });
      });
      const updatedMembers = await Promise.all(promises);
      
      setMembers(prev => prev.map(m => {
        const updated = updatedMembers.find(u => u.id === m.id);
        return updated ? updated : m;
      }));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar alocações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 size={36} className="animate-spin" />
        <p className="text-sm font-bold">Carregando planejamento de dependentes...</p>
      </div>
    );
  }

  if (error && dependentsList.length === 0) {
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
          <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Dependents Planning</h2>
          <p className="text-slate-500 mt-1">Monthly oversight and budget allocation for family dependents.</p>
        </div>
      </div>

      {dependentsList.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-100 rounded-2xl">
          <p className="text-slate-400 font-bold">Nenhum dependente cadastrado no grupo familiar.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dependentsList.map((dep) => {
              const isSelected = selectedDependentId === dep.id;
              const budget = dep.orcamentoMensal ?? 0;
              
              let tag = "DEPENDENTE";
              let subtext = "Membro Dependente";
              let showEducationFund = false;
              
              if (dep.nome.toLowerCase().includes('beatriz')) {
                tag = "UNIVERSITY STUDENT";
                subtext = "BSc Computer Science, Year 2";
                showEducationFund = true;
              } else if (dep.nome.toLowerCase().includes('carlos')) {
                tag = "INDEPENDENT";
                subtext = "Living in Austin, TX";
              } else {
                if (dep.dataNascimento) {
                  const age = new Date().getFullYear() - new Date(dep.dataNascimento).getFullYear();
                  if (age < 18) {
                    tag = "MENOR DE IDADE";
                    subtext = `${age} anos`;
                  } else if (age < 25) {
                    tag = "ESTUDANTE";
                    subtext = `Estudante, ${age} anos`;
                  } else {
                    tag = "DEPENDENTE";
                    subtext = `${age} anos`;
                  }
                }
              }
              
              return (
                <div 
                  key={dep.id} 
                  onClick={() => setSelectedDependentId(dep.id ?? null)}
                  className={cn(
                    "harmony-card p-6 cursor-pointer transition-all hover:scale-[1.01]",
                    isSelected ? "border-brand-blue ring-2 ring-brand-blue/20" : "border-slate-100"
                  )}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center font-display font-black text-slate-400 overflow-hidden shrink-0">
                        <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-black">
                          {dep.nome ? dep.nome[0] : '?'}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-display font-black text-slate-900">{dep.nome}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-light text-brand-blue">
                            {tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{subtext}</p>
                      </div>
                    </div>
                  </div>

                  {showEducationFund ? (
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">EDUCATION FUND</p>
                        <p className="text-sm font-display font-black text-slate-900">
                          {formatCurrency(budget * 0.75 * 12)} / {formatCurrency(budget * 12)}
                        </p>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden mb-3 border border-slate-100">
                        <div className="h-full bg-brand-blue rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-400">75% Funded</span>
                        <span className="text-emerald-600 flex items-center gap-1">
                          <TrendingUp size={10} /> On track
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 h-[100px] flex flex-col justify-center">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">MONTHLY SUPPORT</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-display font-black text-slate-900">{formatCurrency(budget)}</span>
                        <span className="text-slate-400 font-bold text-sm">/mo</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedDependent && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Semester Costs Breakdown */}
              <div className="lg:col-span-7 harmony-card overflow-hidden">
                <div className="p-6 border-b border-border-subtle bg-white">
                  <h3 className="text-lg font-display font-bold text-slate-900">
                    Semester Costs Breakdown — {selectedDependent.nome}
                  </h3>
                </div>
                <div className="divide-y divide-border-subtle">
                  <CostItem icon={<GraduationCap size={18} />} label="Tuition" value={Math.round((selectedDependent.orcamentoMensal ?? 0) * 0.50 * 6)} />
                  <CostItem icon={<BookOpen size={18} />} label="Books & Materials" value={Math.round((selectedDependent.orcamentoMensal ?? 0) * 0.05 * 6)} />
                  <CostItem icon={<Building2 size={18} />} label="Dormitory" value={Math.round((selectedDependent.orcamentoMensal ?? 0) * 0.25 * 6)} />
                </div>
              </div>

              {/* Living Expenses */}
              <div className="lg:col-span-5 harmony-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-display font-bold text-slate-900">
                    Living Expenses — {selectedDependent.nome}
                  </h3>
                  <button className="text-brand-blue hover:bg-brand-light p-1 rounded-lg transition-colors">
                    <PencilLine size={18} />
                  </button>
                </div>
                <div className="space-y-6">
                  <ExpenseItem label="Rent Contribution" subtext="Shared apartment" amount={Math.round((selectedDependent.orcamentoMensal ?? 0) * 0.40)} />
                  <ExpenseItem label="Groceries" subtext="Estimated" amount={Math.round((selectedDependent.orcamentoMensal ?? 0) * 0.20)} />
                  <ExpenseItem label="Utilities & Internet" subtext="Fixed monthly" amount={Math.round((selectedDependent.orcamentoMensal ?? 0) * 0.10)} />
                  <ExpenseItem label="Miscellaneous" subtext="Discretionary" amount={Math.round((selectedDependent.orcamentoMensal ?? 0) * 0.15)} />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Support Allocation Tool */}
      <div className="harmony-card p-6 bg-white">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">Support Allocation Tool</h3>
            <p className="text-xs text-slate-500 font-medium">Adjust monthly distributions from the central family fund.</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">TOTAL AVAILABLE</p>
            <p className="text-2xl font-display font-black text-slate-900">{formatCurrency(totalAvailable)} / mo</p>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {saveSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold">
              <CheckCircle2 size={16} />
              <span>Alocações de orçamento salvas com sucesso!</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            {dependentsList.map((dep) => {
              const budget = budgets[dep.id!] ?? 0;
              const pct = totalAvailable > 0 ? Math.round((budget / totalAvailable) * 100) : 0;
              return (
                <span key={dep.id}>{dep.nome} ({pct}%)</span>
              );
            })}
            <span>Unallocated ({totalAvailable > 0 ? Math.round((unallocated / totalAvailable) * 100) : 0}%)</span>
          </div>

          <div className="h-8 w-full flex rounded-lg overflow-hidden shadow-inner bg-slate-100 mb-6">
            {dependentsList.map((dep, idx) => {
              const budget = budgets[dep.id!] ?? 0;
              const pct = totalAvailable > 0 ? (budget / totalAvailable) * 100 : 0;
              if (pct <= 0) return null;
              
              const bgColors = [
                'bg-brand-blue',
                'bg-indigo-400',
                'bg-rose-400',
                'bg-emerald-400',
                'bg-amber-400'
              ];
              const bgColor = bgColors[idx % bgColors.length];
              
              return (
                <div
                  key={dep.id}
                  className={cn("h-full flex items-center justify-center text-[10px] font-black text-white px-2 overflow-hidden truncate", bgColor)}
                  style={{ width: `${pct}%` }}
                  title={`${dep.nome}: ${formatCurrency(budget)}`}
                >
                  {dep.nome}
                </div>
              );
            })}
            {unallocated > 0 && (
              <div 
                className="h-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 px-2 overflow-hidden truncate"
                style={{ width: `${(unallocated / totalAvailable) * 100}%` }}
                title={`Unallocated: ${formatCurrency(unallocated)}`}
              >
                Unallocated
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {dependentsList.map((dep) => {
              const budget = budgets[dep.id!] ?? 0;
              return (
                <div key={dep.id} className="space-y-2 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>{dep.nome}</span>
                    <span className="font-mono">{formatCurrency(budget)} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={totalAvailable}
                    step="50"
                    value={budget}
                    disabled={saving}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const otherSum = (Object.entries(budgets) as [string, number][])
                        .filter(([id]) => Number(id) !== dep.id)
                        .reduce((sum, [_, val]) => sum + val, 0);
                      
                      if (otherSum + value <= totalAvailable) {
                        setBudgets({
                          ...budgets,
                          [dep.id!]: value
                        });
                      } else {
                        setBudgets({
                          ...budgets,
                          [dep.id!]: totalAvailable - otherSum
                        });
                      }
                    }}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button 
              onClick={handleReset} 
              disabled={saving}
              className="harmony-btn-secondary py-2 px-6"
            >
              Reset
            </button>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="harmony-btn-primary bg-slate-900 hover:bg-black py-2 px-6 border-none shadow-none flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              <span>{saving ? 'Saving...' : 'Save Allocation'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CostItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
          {icon}
        </div>
        <span className="font-bold text-slate-900 text-sm">{label}</span>
      </div>
      <span className="font-display font-black text-slate-900">{formatCurrency(value)}</span>
    </div>
  );
}

function ExpenseItem({ label, subtext, amount }: { label: string, subtext: string, amount: number }) {
  return (
    <div className="flex justify-between items-start group">
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtext}</p>
      </div>
      <span className="font-display font-black text-slate-900">{formatCurrency(amount)}</span>
    </div>
  );
}
