import React from 'react';
import { 
  Printer, 
  ChevronLeft, 
  Download, 
  FileText, 
  Calendar,
  User,
  Hash,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Screen } from '../types';

interface LedgerPrintPreviewProps {
  onNavigate: (screen: Screen) => void;
}

export function LedgerPrintPreview({ onNavigate }: LedgerPrintPreviewProps) {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const period = '01/05/2026 - 31/05/2026';
  
  const transactions = [
    { id: '1', date: '2026-05-01', description: 'Monthly Rent', category: 'Housing', amount: -1500.00, type: 'expense' },
    { id: '2', date: '2026-05-03', description: 'Salary Deposit', category: 'Work', amount: 4500.00, type: 'income' },
    { id: '3', date: '2026-05-05', description: 'Supermarket', category: 'Food', amount: -350.25, type: 'expense' },
    { id: '4', date: '2026-05-07', description: 'Freelance Design', category: 'Work', amount: 850.00, type: 'income' },
    { id: '5', date: '2026-05-10', description: 'Gas Station', category: 'Transportation', amount: -65.00, type: 'expense' },
  ];

  const totals = {
    income: 5350.00,
    expense: 1915.25,
    balance: 3434.75
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 font-sans print:m-0 print:p-0 print:max-w-none">
      {/* Action Header - Hidden in Print */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('ledger_book')}
            className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Espelho de Impressão</h2>
            <p className="text-sm font-medium text-slate-500">Visualize como o relatório será impresso.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
            <Download size={18} />
            <span>PDF</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <Printer size={18} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Report Container */}
      <div className="bg-white border border-slate-200 shadow-sm print:shadow-none print:border-none overflow-hidden rounded-2xl print:rounded-none">
        {/* Report Header */}
        <div className="p-10 border-b border-slate-100 space-y-8 print:p-8">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <FileText size={24} />
                </div>
                <h1 className="text-2xl font-display font-black text-slate-900 tracking-tighter">Organomeno</h1>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relatório de Movimentação</p>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                  <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /> {period}</span>
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emitido em</p>
              <p className="text-sm font-bold text-slate-900">{currentDate}</p>
              <p className="text-xs text-slate-500">Pág. 01/01</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 py-8 border-t border-b border-slate-50 print:border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL ENTRADAS</p>
              <p className="text-2xl font-display font-black text-emerald-600">{formatCurrency(totals.income)}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL SAÍDAS</p>
              <p className="text-2xl font-display font-black text-rose-600">{formatCurrency(totals.expense)}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SALDO PERÍODO</p>
              <p className="text-2xl font-display font-black text-blue-600">{formatCurrency(totals.balance)}</p>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 print:bg-slate-50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest first:pl-10 last:pr-10 print:px-8">Item</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest print:px-4">Data</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest flex-1 print:px-4">Descrição</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest print:px-4">Categoria</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right last:pr-10 print:px-8">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 print:divide-slate-100">
              {transactions.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-5 text-sm font-bold text-slate-400 print:px-8">
                    #{idx + 1}
                  </td>
                  <td className="px-4 py-5 text-sm font-bold text-slate-600 whitespace-nowrap print:px-4">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-5 text-sm font-black text-slate-900 print:px-4">
                    {t.description}
                  </td>
                  <td className="px-4 py-5 print:px-4">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-slate-100 rounded text-slate-500">
                      {t.category}
                    </span>
                  </td>
                  <td className={cn(
                    "px-10 py-5 text-sm font-black text-right print:px-8",
                    t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                  )}>
                    <div className="flex items-center justify-end gap-2">
                       {t.amount > 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                       {formatCurrency(Math.abs(t.amount))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Report Footer */}
        <div className="p-10 bg-slate-50/50 border-t border-slate-100 print:p-8">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">ASSINATURA DO RESPONSÁVEL</h4>
              <div className="w-full h-px bg-slate-200 mt-12" />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>RESPONSÁVEL FINANCEIRO</span>
                <span>DATA</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 space-y-4 print:border-slate-200">
              <div className="flex items-center gap-3">
                <Hash className="text-slate-200" size={24} />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">AUTENTICAÇÃO</p>
                  <p className="text-xs font-mono text-slate-400 font-bold uppercase">HMN-2026-FPR-9921-XBZ-00</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                Documento gerado automaticamente pelo sistema Organomeno. O conteúdo deste relatório é de uso confidencial e restrito.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tip - Hidden in Print */}
      <div className="harmony-card bg-orange-50 border-orange-100 p-6 flex items-center gap-4 print:hidden">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-600 shadow-sm shadow-orange-100/50">
          <Printer size={20} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-orange-900">Dica de Impressão</p>
          <p className="text-[10px] text-orange-700/70 font-medium mt-0.5 leading-relaxed">
            Para um melhor resultado, habilite a opção "Gráficos de tela de fundo" nas configurações de impressão de seu navegador.
          </p>
        </div>
      </div>
    </div>
  );
}
