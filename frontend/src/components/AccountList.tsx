import React, { useState } from 'react';
import { 
  Landmark, 
  Plus, 
  Search, 
  Edit2, 
  ChevronRight, 
  Wallet,
  CreditCard,
  TrendingUp,
  MoreVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Screen } from '../types';

interface BankAccount {
  id: string;
  nome: string;
  banco: string;
  agencia?: string;
  numeroConta?: string;
  tipoConta: 'CORRENTE' | 'POUPANCA' | 'SALARIO' | 'INVESTIMENTO';
  saldoAtual: number;
  saldoInicial: number;
  ativa: boolean;
}

interface AccountListProps {
  onNavigate: (screen: Screen) => void;
}

export function AccountList({ onNavigate }: AccountListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [accounts, setAccounts] = useState<BankAccount[]>([
    { id: '1', nome: 'Minha Corrente', banco: 'Itaú', agencia: '1234', numeroConta: '56789-0', tipoConta: 'CORRENTE', saldoAtual: 2500.50, saldoInicial: 1000.00, ativa: true },
    { id: '2', nome: 'Reserva Emergência', banco: 'Nubank', tipoConta: 'INVESTIMENTO', saldoAtual: 15400.00, saldoInicial: 10000.00, ativa: true },
    { id: '3', nome: 'Salário Antiga', banco: 'Bradesco', tipoConta: 'SALARIO', saldoAtual: 0.00, saldoInicial: 0.00, ativa: false },
  ]);

  const filteredAccounts = accounts.filter(a => 
    a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.banco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">Contas Bancárias</h2>
          <p className="text-slate-500 mt-1">Acompanhe seus saldos e gerencie suas instituições financeiras.</p>
        </div>
        <button 
          onClick={() => onNavigate('account_form')}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Nova Conta</span>
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou banco..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-blue-600 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="harmony-card bg-white border border-slate-100 p-8 flex flex-col justify-between hover:border-slate-200 hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded",
                  account.ativa ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                )}>
                  {account.ativa ? 'Ativa' : 'Inativa'}
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    {account.tipoConta === 'INVESTIMENTO' ? <TrendingUp size={28} /> : <Landmark size={28} />}
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-black text-slate-900 leading-tight">{account.nome}</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{account.banco}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SALDO ATUAL</p>
                    <p className={cn(
                      "text-xl font-display font-black",
                      account.saldoAtual >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {formatCurrency(account.saldoAtual)}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TIPO</p>
                    <p className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-tight">
                      {account.tipoConta.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Hash size={14} />
                    <span>AG: {account.agencia || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wallet size={14} />
                    <span>CC: {account.numeroConta || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <button 
                  onClick={() => onNavigate('account_form')}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 size={14} />
                  <span>Editar Conta</span>
                </button>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hash({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}
