import React, { useState } from 'react';
import { 
  Download, 
  Split, 
  AlertTriangle,
  Landmark,
  CheckCircle2,
  CreditCard,
  Receipt,
  Plus,
  Trash2,
  X,
  ArrowRight,
  PieChart,
  StickyNote,
  Save
} from 'lucide-react';
import { Screen } from '../types';
import { cn, formatCurrency } from '../lib/utils';

interface TransactionDetailProps {
  onNavigate: (screen: Screen) => void;
}

interface SplitItem {
  id: string;
  category: string;
  amount: number;
}

export function TransactionDetail({ onNavigate }: TransactionDetailProps) {
  const [isSplitting, setIsSplitting] = useState(false);
  const [privateNote, setPrivateNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const totalAmount = 185.20;
  
  const [splits, setSplits] = useState<SplitItem[]>([
    { id: '1', category: 'Alimentação', amount: 185.20 }
  ]);

  const items = [
    { name: 'Arroz Integral 5kg', detail: '1 un', price: 25.90 },
    { name: 'Azeite Extra Virgem', detail: '2 un x R$ 38,00', price: 76.00 },
    { name: 'Peito de Frango 1kg', detail: '1.2 kg x R$ 22,00/kg', price: 26.40 },
    { name: 'Leite Desnatado 1L', detail: '6 un x R$ 5,50', price: 33.00 },
    { name: 'Café Gourmet 500g', detail: '2 un x R$ 19,45', price: 38.90 },
  ];

  const currentTotalSplits = splits.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingAmount = totalAmount - currentTotalSplits;

  const handleAddSplit = () => {
    if (remainingAmount <= 0) return;
    setSplits([
      ...splits,
      { id: Date.now().toString(), category: 'Outros', amount: 0 }
    ]);
  };

  const handleUpdateSplit = (id: string, field: keyof SplitItem, value: any) => {
    setSplits(splits.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleRemoveSplit = (id: string) => {
    if (splits.length === 1) return;
    setSplits(splits.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Info Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="harmony-card bg-white p-8 border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tight">Alimentação</span>
                <span className="text-[10px] font-bold text-slate-400">ID #99823</span>
              </div>
              <h2 className="text-3xl font-display font-black text-slate-900 leading-tight">Detalhamento da Movimentação</h2>
              <p className="text-sm font-medium text-slate-500">Visualização digital do comprovante fiscal.</p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Comprado por</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">Beatriz</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Landmark size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Conta</p>
                  <p className="text-sm font-bold text-blue-600 mt-1">Chase Premier</p>
                </div>
              </div>
            </div>
          </div>

          <div className="harmony-card bg-white p-8 border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <StickyNote size={18} className="text-slate-400" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notas Privadas</h3>
            </div>
            <div className="space-y-4">
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 resize-none"
                placeholder="Adicione observações particulares sobre esta transação..."
                rows={4}
                value={privateNote}
                onChange={(e) => setPrivateNote(e.target.value)}
              />
              <button 
                onClick={() => {
                  setIsSavingNote(true);
                  setTimeout(() => setIsSavingNote(false), 800);
                }}
                className={cn(
                  "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                  isSavingNote 
                    ? "bg-emerald-500 text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {isSavingNote ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Salvo</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Salvar Nota</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95">
              <Download size={18} />
              <span>Baixar PDF</span>
            </button>
            <button 
              onClick={() => setIsSplitting(!isSplitting)}
              className={cn(
                "w-full border font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95",
                isSplitting 
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "bg-white border-slate-200 text-blue-600 hover:bg-slate-50"
              )}
            >
              <Split size={18} />
              <span>{isSplitting ? 'Ver Comprovante' : 'Dividir Despesa'}</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 text-rose-600 font-bold py-4 hover:bg-rose-50 rounded-xl transition-all">
              <AlertTriangle size={18} />
              <span>Contestar Transação</span>
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8">
          {!isSplitting ? (
            /* Receipt Content */
            <div className="harmony-card bg-white border border-slate-100 shadow-xl shadow-slate-200/50 min-h-[800px] flex flex-col">
              {/* Receipt Header */}
              <div className="p-12 text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 shadow-xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Receipt size={40} strokeWidth={1} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-display font-black text-slate-900">Pão de Açúcar - Loja 1204</h3>
                  <p className="text-sm font-bold text-slate-400">12 Mai 2024, 14:30</p>
                </div>
              </div>

              {/* Dotted Divider */}
              <div className="px-12">
                <div className="border-t-2 border-dashed border-slate-100" />
              </div>

              {/* Items List */}
              <div className="p-12 space-y-10 flex-1">
                <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pb-6 border-b border-slate-50">
                  <span>ITEM / DESCRIÇÃO</span>
                  <span>VALOR (R$)</span>
                </div>

                <div className="space-y-8">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between relative group">
                      <div className="space-y-1">
                        <p className="text-base font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.detail}</p>
                      </div>
                      <p className="text-base font-black text-slate-900">{item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Receipt Summary */}
              <div className="px-12 pb-12">
                <div className="bg-slate-50/50 rounded-2xl p-8 space-y-6">
                  <div className="space-y-4 text-sm font-bold">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>200,20</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Taxas</span>
                      <span>0,00</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Descontos Clube</span>
                      <span>-15,00</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">TOTAL</span>
                    <div className="text-right">
                      <p className="text-5xl font-display font-black text-blue-600 tracking-tighter">R$ 185,20</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between px-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <CreditCard size={18} />
                    <span className="text-sm font-bold">Debit Card (**** 4589)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">CONFIRMADO</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Split Transaction Section */
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (remainingAmount !== 0) {
                  alert('O valor total das divisões deve ser igual ao valor da transação.');
                  return;
                }
                alert('Divisão salva com sucesso!');
                setIsSplitting(false);
              }}
              className="harmony-card bg-white border border-slate-100 shadow-xl shadow-slate-200/50 min-h-[800px] p-12 flex flex-col space-y-10"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-display font-black text-slate-900">Divisão de Categorias</h3>
                  <p className="text-sm font-medium text-slate-500">Distribua o valor total em diferentes classificações.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">TOTAL A DIVIDIR</p>
                  <p className="text-3xl font-display font-black text-blue-600 mt-1">{formatCurrency(totalAmount).replace('$', 'R$ ')}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-emerald-600">DISTRIBUÍDO: {formatCurrency(currentTotalSplits).replace('$', 'R$ ')}</span>
                  <span className={cn(remainingAmount === 0 ? "text-emerald-600" : "text-rose-600")}>
                    RESTANTE: {formatCurrency(remainingAmount).replace('$', 'R$ ')}
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      currentTotalSplits > totalAmount ? "bg-rose-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${Math.min(100, (currentTotalSplits / totalAmount) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Split Items */}
              <div className="flex-1 space-y-4">
                {splits.map((split, index) => (
                  <div key={split.id} className="flex items-center gap-4 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl group transition-all hover:bg-white hover:shadow-md">
                    <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-black">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CATEGORIA</label>
                      <select 
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-4 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all cursor-pointer appearance-none"
                        value={split.category}
                        onChange={(e) => handleUpdateSplit(split.id, 'category', e.target.value)}
                      >
                        <option value="Alimentação">Alimentação</option>
                        <option value="Lazer">Lazer</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Habitação">Habitação</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>

                    <div className="w-48 space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">VALOR (R$)</label>
                      <input 
                        type="number"
                        step="0.01"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-4 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                        value={split.amount}
                        onChange={(e) => handleUpdateSplit(split.id, 'amount', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="pt-5">
                      <button 
                        type="button"
                        onClick={() => handleRemoveSplit(split.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Remover"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  type="button"
                  onClick={handleAddSplit}
                  disabled={remainingAmount <= 0}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                  <span>Adicionar Nova Categoria</span>
                </button>
              </div>

              {/* Action Footer */}
              <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                <button 
                  type="button"
                  onClick={() => setIsSplitting(false)}
                  className="text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95 uppercase tracking-widest text-xs"
                >
                  <span>Salvar Divisão</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

