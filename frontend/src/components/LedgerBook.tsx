import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Printer, 
  ChevronDown, 
  MoreVertical,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  Users2,
  Edit
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { Screen } from '../types';

const CHART_DATA = [
  { value: 15 },
  { value: 25 },
  { value: 45 }, // Active month
  { value: 30 },
  { value: 20 },
  { value: 15 },
  { value: 55 }, // High expense
];

interface LedgerBookProps {
  onNavigate: (screen: Screen) => void;
}

export function LedgerBook({ onNavigate }: LedgerBookProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    {
      date: '12 Mai 2024',
      description: 'Supermercado Pão de Açúcar',
      category: 'Alimentação',
      categoryColor: 'bg-blue-100 text-blue-600',
      account: 'Dependente: Beatriz',
      amount: -450.20,
      type: 'expense'
    },
    {
      date: '11 Mai 2024',
      description: 'Salário Mensal - TechCorp',
      category: 'Receita',
      categoryColor: 'bg-emerald-100 text-emerald-600',
      account: 'Conta: Chase Premier',
      amount: 12000.00,
      type: 'income'
    },
    {
      date: '10 Mai 2024',
      description: 'Assinatura Netflix Premium',
      category: 'Lazer',
      categoryColor: 'bg-indigo-100 text-indigo-600',
      account: 'Conta: Chase Premier',
      amount: -55.90,
      type: 'expense'
    },
    {
      date: '08 Mai 2024',
      description: 'Combustível Posto Ipiranga',
      category: 'Transporte',
      categoryColor: 'bg-sky-100 text-sky-600',
      account: 'Dependente: Beatriz',
      amount: -280.00,
      type: 'expense'
    },
    {
      date: '05 Mai 2024',
      description: 'Dividendos ITUB4',
      category: 'Investimentos',
      categoryColor: 'bg-emerald-100 text-emerald-600',
      account: 'Conta: Investimentos XP',
      amount: 2500.00,
      type: 'income'
    },
    {
      date: '02 Mai 2024',
      description: 'Aluguel Apartamento',
      category: 'Habitação',
      categoryColor: 'bg-slate-100 text-slate-600',
      account: 'Conta: Chase Premier',
      amount: -7459.40,
      type: 'expense'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Livro de Movimentação</h2>
          <div className="flex items-center gap-2 mt-1">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filtro Ativo:</span>
            <span className="text-xs font-bold text-blue-600">Conta: Chase Premier</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('register')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            <Plus size={14} strokeWidth={3} />
            <span>Lançamento Manual</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>
          <button 
            onClick={() => onNavigate('ledger_print_preview')}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <Printer size={14} />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="harmony-card bg-white border border-slate-100 shadow-sm p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ENTRADAS TOTAIS</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUp size={16} />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-2xl font-display font-black text-slate-900">R$ 14.500,00</p>
            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[65%]" />
            </div>
          </div>
        </div>

        <div className="harmony-card bg-white border border-slate-100 shadow-sm p-6 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SAÍDAS TOTAIS</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDown size={16} />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-2xl font-display font-black text-slate-900">R$ 8.245,50</p>
            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 w-[40%]" />
            </div>
          </div>
        </div>

        <div className="harmony-card bg-blue-600 p-6 relative overflow-hidden group shadow-lg shadow-blue-100/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">SALDO DO PERÍODO</span>
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-display font-black text-white">R$ 6.254,50</p>
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Saldo líquido projetado para 30 dias</p>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="harmony-card bg-white border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Buscar por descrição ou pessoa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button className="flex items-center gap-2 whitespace-nowrap bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-white hover:border-slate-200 transition-all">
            <span>Este Mês (Maio 2024)</span>
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 whitespace-nowrap bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-white hover:border-slate-200 transition-all">
            <span>Todas Categorias</span>
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 whitespace-nowrap bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-white hover:border-slate-200 transition-all">
            <span>Todos os Tipos</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="harmony-card bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-left">DATA</th>
                <th className="px-4 py-4 text-left">DESCRIÇÃO</th>
                <th className="px-4 py-4 text-center">CATEGORIA</th>
                <th className="px-4 py-4 text-left">PESSOA/CONTA</th>
                <th className="px-4 py-4 text-right">VALOR</th>
                <th className="px-8 py-4 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((t, i) => (
                <tr 
                  key={i} 
                  onClick={() => onNavigate('transaction_detail')}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-6 whitespace-nowrap">
                    <p className="text-sm font-bold text-slate-500">{t.date}</p>
                  </td>
                  <td className="px-4 py-6">
                    <p className="text-sm font-black text-slate-900">{t.description}</p>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex justify-center">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight", t.categoryColor)}>
                        {t.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <p className="text-sm font-bold text-slate-500">{t.account}</p>
                  </td>
                  <td className="px-4 py-6 text-right">
                    <p className={cn("text-sm font-black", t.type === 'income' ? "text-emerald-600" : "text-rose-600")}>
                      {t.type === 'income' ? '+ ' : '- '}
                      {formatCurrency(Math.abs(t.amount)).replace('$', 'R$ ')}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('maintain_transaction');
                        }}
                        className="p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mostrando 6 de 142 entradas</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 disabled:opacity-50" disabled>
              <ChevronDown className="rotate-90" size={16} />
            </button>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-black">1</button>
              <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50">2</button>
              <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50">3</button>
            </div>
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50">
              <ChevronDown className="-rotate-90" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="harmony-card bg-white border border-slate-100 shadow-sm p-8 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900">Análise de Fluxo</h3>
            </div>
            <div className="space-y-6">
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Suas despesas aumentaram <span className="text-rose-600 font-bold">12%</span> em relação ao mês anterior, principalmente na categoria 'Habitação'.
              </p>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA}>
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {CHART_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 2 ? '#2563eb' : index === 6 ? '#ef4444' : '#dbeafe'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-5">
          <div className="harmony-card bg-white border border-slate-100 shadow-sm p-8 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Users2 size={18} />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900">Atividade Familiar</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-white transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" alt="Beatriz" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Beatriz registrou 12 novas movimentações</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Sendo a maior: Supermercado Pão de Açúcar (R$ 450,20)</p>
                </div>
                <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
