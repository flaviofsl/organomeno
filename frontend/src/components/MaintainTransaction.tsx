import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Trash2, 
  Calendar, 
  CreditCard, 
  Tag, 
  FileText,
  AlertCircle,
  Check
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Screen } from '../types';

interface MaintainTransactionProps {
  onNavigate: (screen: Screen) => void;
}

export function MaintainTransaction({ onNavigate }: MaintainTransactionProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('185.20');
  const [description, setDescription] = useState('Pão de Açúcar - Loja 1204');
  const [date, setDate] = useState('2024-05-12');
  const [category, setCategory] = useState('Alimentação');
  const [isSaving, setIsSaving] = useState(false);

  const categories = ['Alimentação', 'Lazer', 'Transporte', 'Habitação', 'Saúde', 'Educação'];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onNavigate('ledger_book');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('ledger_book')}
            className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Manter Transação</h2>
            <p className="text-sm font-medium text-slate-500">Edite ou remova os detalhes desta movimentação.</p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold text-sm">
          <Trash2 size={18} />
          <span>Excluir</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-8">
          <div className="harmony-card bg-white border border-slate-100 shadow-sm p-8 space-y-8">
            {/* Type Selector */}
            <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
              <button 
                onClick={() => setType('expense')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all",
                  type === 'expense' ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Despesa
              </button>
              <button 
                onClick={() => setType('income')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all",
                  type === 'income' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Receita
              </button>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DESCRIÇÃO</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">VALOR (R$)</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 group-focus-within:text-blue-600 transition-colors">R$</span>
                    <input 
                      type="text" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DATA</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CATEGORIA</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                        category === cat 
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" 
                          : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="harmony-card bg-blue-50 border-blue-100 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-900">Histórico</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
                <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
                  Criada em 12/05/2024 às 10:45 por você.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
                <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
                  Não houve alterações anteriores neste registro.
                </p>
              </div>
            </div>
          </div>

          <div className="harmony-card bg-white border border-slate-100 p-6 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check size={20} strokeWidth={3} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizado</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">Conciliação Bancária OK</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
