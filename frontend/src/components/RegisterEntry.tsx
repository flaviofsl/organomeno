import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Check,
  Utensils,
  CreditCard,
  Zap,
  ShoppingBag,
  Loader2,
  AlertCircle,
  ChevronLeft,
  User
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { Screen } from '../types';
import { 
  listarContas, 
  listarCategorias, 
  listarMembros, 
  listarLancamentos,
  criarLancamento, 
  Conta, 
  Categoria, 
  MembroFamilia, 
  Lancamento,
  DEFAULT_FAMILY_GROUP_ID 
} from '../lib/api';

interface RegisterEntryProps {
  onNavigate: (screen: Screen) => void;
  defaultType?: 'income' | 'expense';
}

export function RegisterEntry({ onNavigate, defaultType = 'expense' }: RegisterEntryProps) {
  const [type, setType] = useState<'income' | 'expense'>(defaultType);
  const [amount, setAmount] = useState('125.50');
  const [description, setDescription] = useState('Whole Foods Market');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const [endDate, setEndDate] = useState('');

  // Dropdown list states
  const [accounts, setAccounts] = useState<Conta[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [members, setMembers] = useState<MembroFamilia[]>([]);
  const [recentEntries, setRecentEntries] = useState<Lancamento[]>([]);

  // Selection states
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFormOptions() {
      setLoading(true);
      setError(null);
      try {
        const [loadedAccounts, loadedCategories, loadedMembers, loadedRecent] = await Promise.all([
          listarContas(true),
          listarCategorias(),
          listarMembros(DEFAULT_FAMILY_GROUP_ID),
          listarLancamentos(DEFAULT_FAMILY_GROUP_ID)
        ]);

        if (!cancelled) {
          setAccounts(loadedAccounts);
          setCategories(loadedCategories);
          setMembers(loadedMembers);
          setRecentEntries(loadedRecent.slice(0, 4));

          if (loadedAccounts.length > 0) {
            setSelectedAccountId(String(loadedAccounts[0].id));
          }
          if (loadedMembers.length > 0) {
            setSelectedMemberId(String(loadedMembers[0].id));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar opções do formulário.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFormOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter categories by transaction type when it changes
  useEffect(() => {
    const initialFiltered = categories.filter(cat => 
      type === 'income' 
        ? (cat.tipo === 'RECEITA' || cat.tipo === 'AMBOS')
        : (cat.tipo === 'DESPESA' || cat.tipo === 'AMBOS')
    );
    if (initialFiltered.length > 0) {
      setSelectedCategoryId(String(initialFiltered[0].id));
    } else {
      setSelectedCategoryId('');
    }
  }, [type, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const parsedAmount = Number(amount);
      if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Valor inválido.');
      }

      await criarLancamento({
        idGrupoFamiliar: DEFAULT_FAMILY_GROUP_ID,
        idConta: Number(selectedAccountId),
        idCategoria: Number(selectedCategoryId),
        idMembro: selectedMemberId ? Number(selectedMemberId) : undefined,
        tipo: type === 'income' ? 'RECEITA' : 'DESPESA',
        descricao: description,
        valorBruto: parsedAmount,
        valorLiquido: parsedAmount,
        dataTransacao: date,
        status: 'CONFIRMADO',
        recorrente: isRecurring
      });

      alert('Lançamento realizado com sucesso!');
      onNavigate(type === 'income' ? 'income_list' : 'expense_list');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar lançamento.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    type === 'income' 
      ? (cat.tipo === 'RECEITA' || cat.tipo === 'AMBOS')
      : (cat.tipo === 'DESPESA' || cat.tipo === 'AMBOS')
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 size={36} className="animate-spin" />
        <p className="text-sm font-bold">Carregando opções...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate(type === 'income' ? 'income_list' : 'expense_list')}
          className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Novo Lançamento</h2>
          <p className="text-slate-500 mt-1">Registre manualmente uma nova receita ou despesa no sistema.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-8">
          <div className="harmony-card bg-white p-10 border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Type Toggle */}
              <div className="flex justify-center">
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 w-full max-w-sm">
                  <button 
                    type="button"
                    onClick={() => setType('income')}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all",
                      type === 'income' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                    )}
                  >
                    Receita
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType('expense')}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all",
                      type === 'expense' ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"
                    )}
                  >
                    Despesa
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-left block">VALOR</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-display font-black text-slate-400">
                    $
                  </div>
                  <input 
                    type="text" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-6 pl-12 pr-6 text-2xl font-display font-black text-slate-900 focus:bg-white focus:border-brand-blue/20 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Row 1: Date & Account & Member */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">DATA</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-blue/20 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">CONTA BANCÁRIA</label>
                  <div className="relative group">
                    <select 
                      value={selectedAccountId}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-blue/20 outline-none appearance-none pr-10"
                    >
                      {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.nome} - {acc.banco}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">MEMBRO RESPONSÁVEL</label>
                  <div className="relative group">
                    <select 
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-blue/20 outline-none appearance-none pr-10"
                    >
                      <option value="">Nenhum</option>
                      {members.map(m => <option key={m.id} value={m.id}>{m.nome} ({m.papelFinanceiro === 'PROVEDOR_PRINCIPAL' ? 'Provedor' : 'Dependente'})</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Row 2: Category & Vendor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">CATEGORIA</label>
                  <div className="relative group">
                    <select 
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-blue/20 outline-none appearance-none pr-10"
                    >
                      {filteredCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">DESCRIÇÃO / FORNECEDOR</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-blue/20 outline-none"
                    placeholder="Descrição do lançamento"
                  />
                </div>
              </div>

              {/* Recurring Fields */}
              {isRecurring && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">FREQUÊNCIA</label>
                    <div className="relative group">
                      <select 
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:border-brand-blue/20 outline-none appearance-none pr-10"
                      >
                        <option value="daily">Diário</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                        <option value="yearly">Anual</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">DATA FIM (OPCIONAL)</label>
                    <div className="relative group">
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:border-brand-blue/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                    isRecurring ? "bg-brand-blue border-brand-blue" : "border-slate-200 bg-white group-hover:border-brand-blue/40"
                  )}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    {isRecurring && <Check size={12} className="text-white" strokeWidth={4} />}
                  </div>
                  <span className="text-sm font-bold text-slate-600">Repetir esta transação</span>
                </label>
                
                {error && (
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center gap-8">
                  <button 
                    type="button" 
                    onClick={() => onNavigate(type === 'income' ? 'income_list' : 'expense_list')}
                    className="text-sm font-bold text-brand-blue hover:underline"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="harmony-btn-primary flex items-center gap-2 px-8 py-3.5 bg-brand-blue border-none shadow-none rounded-xl disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    {saving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={18} strokeWidth={3} />
                        <span>Salvar Transação</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Recent Entries */}
        <div className="lg:col-span-4">
          <div className="harmony-card bg-white border-slate-100 flex flex-col p-8 h-full min-h-[500px]">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-8">Lançamentos Recentes</h3>
            
            <div className="space-y-8 flex-1">
              {recentEntries.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-bold">Nenhum lançamento recente.</div>
              ) : (
                recentEntries.map((t) => (
                  <RecentItem 
                    key={t.id}
                    icon={t.tipo === 'RECEITA' ? <CreditCard size={18} /> : <ShoppingBag size={18} />} 
                    name={t.descricao} 
                    category={t.nomeCategoria || 'Sem Categoria'} 
                    date={formatDate(t.dataTransacao)} 
                    amount={t.valorBruto * (t.tipo === 'RECEITA' ? 1 : -1)} 
                    iconBg={t.tipo === 'RECEITA' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-600"}
                  />
                ))
              )}
            </div>

            <button 
              onClick={() => onNavigate('ledger_book')}
              className="w-full mt-10 py-3.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-brand-blue tracking-[0.2em] hover:bg-slate-50 transition-colors"
            >
              Ver Livro Razão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RecentItemProps {
  key?: any;
  icon: React.ReactNode;
  name: string;
  category: string;
  date: string;
  amount: number;
  iconBg: string;
}

function RecentItem({ icon, name, category, date, amount, iconBg }: RecentItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">{name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{category} • {date}</p>
        </div>
      </div>
      <span className={cn(
        "font-display font-bold text-sm tracking-tight",
        amount >= 0 ? "text-emerald-600" : "text-rose-600"
      )}>
        {amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(amount))}
      </span>
    </div>
  );
}

