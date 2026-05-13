import React, { useState } from 'react';
import { 
  ArrowDownLeft, 
  Plus, 
  Search, 
  Edit2, 
  ChevronRight,
  TrendingDown,
  Tag,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { MOCK_TRANSACTIONS } from '../constants';
import { Screen } from '../types';

interface ExpenseListProps {
  onNavigate: (screen: Screen) => void;
}

export function ExpenseList({ onNavigate }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const expenseTransactions = MOCK_TRANSACTIONS.filter(t => t.type === 'Expense');

  const filtered = expenseTransactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">Despesas</h2>
          <p className="text-slate-500 mt-1">Controle rigoroso de gastos e saídas do orçamento familiar.</p>
        </div>
        <button 
          onClick={() => onNavigate('register_expense')}
          className="flex items-center gap-2 bg-rose-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Nova Despesa</span>
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por descrição ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-blue-600 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="harmony-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Data Lançamento</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                          <ArrowDownLeft size={16} />
                        </div>
                        <span className="font-bold text-slate-900">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-rose-600">{formatCurrency(t.amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-slate-500">{formatDate(t.date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onNavigate('register_expense')}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
