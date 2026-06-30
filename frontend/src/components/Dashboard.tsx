import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Flag,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Home,
  Shield,
  Pencil,
  Loader2,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { 
  listarLancamentos, 
  listarMembros, 
  listarContas, 
  DEFAULT_FAMILY_GROUP_ID, 
  parseSaldo, 
  Lancamento, 
  MembroFamilia, 
  Conta 
} from '../lib/api';

export function Dashboard() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [members, setMembers] = useState<MembroFamilia[]>([]);
  const [accounts, setAccounts] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [loadedLancamentos, loadedMembers, loadedAccounts] = await Promise.all([
          listarLancamentos(DEFAULT_FAMILY_GROUP_ID),
          listarMembros(DEFAULT_FAMILY_GROUP_ID),
          listarContas(true)
        ]);

        if (!cancelled) {
          setLancamentos(loadedLancamentos);
          setMembers(loadedMembers);
          setAccounts(loadedAccounts);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados do painel.');
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 size={36} className="animate-spin" />
        <p className="text-sm font-bold">Carregando painel financeiro...</p>
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

  // Current calendar month (M0) and previous calendar month (M1) calculations
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11
  
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const parseTxDate = (dateStr: string) => new Date(dateStr);

  const currentMonthIncomes = lancamentos.filter(l => {
    if (l.tipo !== 'RECEITA') return false;
    const d = parseTxDate(l.dataTransacao);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const currentMonthExpenses = lancamentos.filter(l => {
    if (l.tipo !== 'DESPESA') return false;
    const d = parseTxDate(l.dataTransacao);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const prevMonthIncomes = lancamentos.filter(l => {
    if (l.tipo !== 'RECEITA') return false;
    const d = parseTxDate(l.dataTransacao);
    return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
  });

  const prevMonthExpenses = lancamentos.filter(l => {
    if (l.tipo !== 'DESPESA') return false;
    const d = parseTxDate(l.dataTransacao);
    return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
  });

  const totalIncomeM0 = currentMonthIncomes.reduce((sum, l) => sum + l.valorBruto, 0);
  const totalExpenseM0 = currentMonthExpenses.reduce((sum, l) => sum + l.valorBruto, 0);

  const totalIncomeM1 = prevMonthIncomes.reduce((sum, l) => sum + l.valorBruto, 0);
  const totalExpenseM1 = prevMonthExpenses.reduce((sum, l) => sum + l.valorBruto, 0);

  const incomeTrend = totalIncomeM1 > 0 ? ((totalIncomeM0 - totalIncomeM1) / totalIncomeM1) * 100 : 0;
  const expenseTrend = totalExpenseM1 > 0 ? ((totalExpenseM0 - totalExpenseM1) / totalExpenseM1) * 100 : 0;

  const formatTrend = (trendVal: number) => {
    const sign = trendVal >= 0 ? '+' : '';
    return `${sign}${trendVal.toFixed(1)}%`;
  };

  // Savings Goal calculations (Goal: $150,000)
  const totalSavings = accounts.reduce((sum, acc) => sum + parseSaldo(acc.saldoAtual), 0);
  const savingsGoal = 150000;
  const savingsProgress = Math.min(100, Math.max(0, Math.round((totalSavings / savingsGoal) * 100)));

  // Top Category Spending (based on current month expenses, with fallback to all expenses)
  const categoryTotals: Record<string, number> = {};
  currentMonthExpenses.forEach(exp => {
    const catName = exp.nomeCategoria || 'Outros';
    categoryTotals[catName] = (categoryTotals[catName] || 0) + exp.valorBruto;
  });

  let categoryEntries = Object.entries(categoryTotals);
  if (categoryEntries.length === 0) {
    const allExpenses = lancamentos.filter(l => l.tipo === 'DESPESA');
    const allCategoryTotals: Record<string, number> = {};
    allExpenses.forEach(exp => {
      const catName = exp.nomeCategoria || 'Outros';
      allCategoryTotals[catName] = (allCategoryTotals[catName] || 0) + exp.valorBruto;
    });
    categoryEntries = Object.entries(allCategoryTotals);
  }

  categoryEntries.sort((a, b) => b[1] - a[1]);
  const topCategories = categoryEntries.slice(0, 4);
  const defaultCategories = ['Moradia', 'Educação', 'Saúde', 'Viagens'];
  while (topCategories.length < 4) {
    const nextDefault = defaultCategories.find(d => !topCategories.some(([name]) => name === d));
    topCategories.push([nextDefault || 'Outros', 0]);
  }

  const maxCategoryExpense = Math.max(...topCategories.map(([_, val]) => val), 0);

  // Providers list
  const providers = members.filter(
    m => m.papelFinanceiro === 'PROVEDOR_PRINCIPAL' || m.papelFinanceiro === 'CO_PROVEDOR'
  );

  // Upcoming Bills (pending expenses)
  const upcomingBills = lancamentos.filter(
    l => l.tipo === 'DESPESA' && l.status === 'PENDENTE'
  );
  const sortedBills = [...upcomingBills].sort(
    (a, b) => new Date(a.dataTransacao).getTime() - new Date(b.dataTransacao).getTime()
  );
  const displayBills = sortedBills.slice(0, 3);

  const getDueLabel = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      return `Vencida há ${absDays} ${absDays === 1 ? 'dia' : 'dias'}`;
    }
    if (diffDays === 0) return 'Vence hoje';
    if (diffDays === 1) return 'Vence amanhã';
    return `Vence em ${diffDays} dias`;
  };

  const getBillIcon = (catName?: string) => {
    const name = catName?.toLowerCase() || '';
    if (name.includes('educacao') || name.includes('escola') || name.includes('curso') || name.includes('faculdade')) {
      return <GraduationCap size={18} />;
    }
    if (name.includes('casa') || name.includes('aluguel') || name.includes('luz') || name.includes('agua') || name.includes('internet') || name.includes('manutencao')) {
      return <Home size={18} />;
    }
    if (name.includes('seguro') || name.includes('saude') || name.includes('plano')) {
      return <Shield size={18} />;
    }
    return <CreditCard size={18} />;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Family Overview</h2>
        <p className="text-slate-500 mt-1">Here is the latest financial data for your family office.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard 
          label="TOTAL INCOME" 
          value={totalIncomeM0} 
          trend={formatTrend(incomeTrend)} 
          trendType={incomeTrend >= 0 ? 'up' : 'down'}
          subtitle="Received this month"
        />
        <SummaryCard 
          label="TOTAL EXPENSES" 
          value={totalExpenseM0} 
          trend={formatTrend(expenseTrend)} 
          trendType={expenseTrend <= 0 ? 'down' : 'up'}
          subtitle="Spent this month"
        />
        <div className="harmony-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">SAVINGS GOAL</p>
            <Flag size={18} className="text-brand-blue" />
          </div>
          <div>
            <p className="text-4xl font-display font-black text-slate-900 mb-1">{formatCurrency(totalSavings)}</p>
            <div className="space-y-1.5 mt-4">
              <div className="flex justify-between items-center text-[10px] font-black">
                <span className="text-slate-400 uppercase tracking-widest">Progress to {formatCurrency(savingsGoal)}</span>
                <span className="text-brand-blue">{savingsProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full" style={{ width: `${savingsProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Monthly Spending */}
        <div className="lg:col-span-8 space-y-6">
          <div className="harmony-card p-8 h-full min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-display font-bold text-slate-900">Monthly Spending</h3>
              <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest border border-brand-blue/20 px-3 py-1.5 rounded-lg hover:bg-brand-light transition-colors">
                View Report
              </button>
            </div>
            
            {/* Spending Visualization */}
            <div className="flex-1 flex flex-col justify-end">
              <div className="grid grid-cols-4 gap-8 items-end h-64">
                {topCategories.map(([name, val], idx) => {
                  const heightPercent = maxCategoryExpense > 0 ? Math.round((val / maxCategoryExpense) * 100) : 0;
                  const heightStyle = val > 0 ? `${Math.max(5, heightPercent)}%` : '0%';
                  
                  const colors = ['bg-brand-blue', 'bg-indigo-400', 'bg-rose-400', 'bg-emerald-400'];
                  const color = colors[idx % colors.length];
                  
                  return (
                    <SpendingBar 
                      key={name} 
                      label={name} 
                      value={val}
                      color={color} 
                      height={heightStyle} 
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Providers & Bills */}
        <div className="lg:col-span-4 space-y-8">
          {/* Providers Section */}
          <section>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-4 px-2">Providers</h3>
            <div className="harmony-card divide-y divide-border-subtle overflow-hidden">
              {providers.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs font-bold bg-white">
                  Nenhum provedor cadastrado.
                </div>
              ) : (
                providers.map((p) => {
                  const isPrimary = p.papelFinanceiro === 'PROVEDOR_PRINCIPAL';
                  const roleLabel = isPrimary ? 'Provedor Principal' : 'Co-provedor';
                  const icon = isPrimary ? (
                    <ShieldCheck size={16} className="text-brand-blue" />
                  ) : (
                    <CheckCircle2 size={16} className="text-brand-blue" />
                  );
                  
                  return (
                    <ProviderItem 
                      key={p.id} 
                      name={p.nome} 
                      role={roleLabel} 
                      icon={icon} 
                      avatar={p.nome ? p.nome[0] : '?'}
                    />
                  );
                })
              )}
            </div>
          </section>

          {/* Upcoming Bills Section */}
          <section>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-4 px-2">Upcoming Bills</h3>
            {displayBills.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs font-bold bg-white rounded-2xl border border-slate-100">
                Nenhuma conta pendente para os próximos dias.
              </div>
            ) : (
              <div className="harmony-card divide-y divide-border-subtle overflow-hidden">
                {displayBills.map((bill) => (
                  <BillItem 
                    key={bill.id} 
                    label={bill.descricao} 
                    date={getDueLabel(bill.dataTransacao)} 
                    amount={bill.valorBruto} 
                    icon={getBillIcon(bill.nomeCategoria)} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const SummaryCard: React.FC<{ label: string, value: number, trend: string, trendType: 'up' | 'down', subtitle: string }> = ({ label, value, trend, trendType, subtitle }) => {
  return (
    <div className="harmony-card p-6 flex flex-col justify-between group hover:border-brand-blue/30 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">{label}</p>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full",
          trendType === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trendType === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-4xl font-display font-black text-slate-900 mb-1">
          {formatCurrency(value)}
        </p>
        <p className="text-[11px] font-medium text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
};

const SpendingBar: React.FC<{ label: string, value: number, color: string, height: string }> = ({ label, value, color, height }) => {
  return (
    <div className="flex flex-col items-center gap-4 h-full group flex-1">
      <div className="flex-1 w-full flex flex-col justify-end items-center bg-slate-50/50 rounded-xl overflow-hidden pb-4 relative">
        <span className="text-[10px] font-black text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 font-mono">
          {formatCurrency(value)}
        </span>
        <div className={cn("rounded-full w-2 shadow-sm transition-all duration-1000", color)} style={{ height: height }}></div>
      </div>
      <div className="text-center w-full">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest group-hover:text-slate-900 transition-colors truncate max-w-full" title={label}>
          {label}
        </p>
        <p className="text-[9px] font-mono text-slate-500 mt-0.5 group-hover:text-slate-700 transition-colors">
          {formatCurrency(value)}
        </p>
      </div>
    </div>
  );
};

const ProviderItem: React.FC<{ name: string, role: string, icon: React.ReactNode, avatar: string }> = ({ name, role, icon, avatar }) => {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-display font-black text-slate-400 overflow-hidden">
          {avatar}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role}</p>
        </div>
      </div>
      <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-brand-light group-hover:text-brand-blue transition-colors">
        {icon}
      </div>
    </div>
  );
};

const BillItem: React.FC<{ label: string, date: string, amount: number, icon: React.ReactNode }> = ({ label, date, amount, icon }) => {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{label}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{date}</p>
        </div>
      </div>
      <span className="font-display font-black text-slate-900 text-sm">{formatCurrency(amount)}</span>
    </div>
  );
};
