import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Plus, 
  Search, 
  Edit2, 
  ChevronRight,
  TrendingUp,
  Tag,
  Calendar
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { MOCK_TRANSACTIONS } from '../constants';
import { Screen } from '../types';

interface IncomeListProps {
  onNavigate: (screen: Screen) => void;
}

export function IncomeList({ onNavigate }: IncomeListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const incomeTransactions = MOCK_TRANSACTIONS.filter(t => t.type === 'Income');

  const filtered = incomeTransactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">Receitas</h2>
          <p className="text-slate-500 mt-1">Histórico completo de entradas e rendimentos do núcleo familiar.</p>
        </div>
        <button 
          onClick={() => onNavigate('register_income')}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Nova Receita</span>
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
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                          <ArrowUpRight size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{t.description}</p>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-emerald-600">{formatCurrency(t.amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-slate-500">{formatDate(t.date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onNavigate('register_income')}
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
