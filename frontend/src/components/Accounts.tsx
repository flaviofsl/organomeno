import React, { useState } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  Link as LinkIcon,
  Shield,
  TrendingUp,
  Info,
  Circle,
  ArrowRight
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Screen } from '../types';

interface AccountsProps {
  onNavigate: (screen: Screen) => void;
}

export function Accounts({ onNavigate }: AccountsProps) {
  const [selectedType, setSelectedType] = useState('Checking');

  const accounts = [
    {
      id: '1',
      name: 'Chase Premier',
      last4: '4589',
      balance: 24500.00,
      type: 'Corrente',
      trend: '+2.4% este mês',
      icon: <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Building2 size={24} /></div>
    },
    {
      id: '2',
      name: 'Ally Poupança',
      last4: '1102',
      balance: 142300.50,
      type: 'Poupança',
      info: '4.35% APY Ativo',
      icon: <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-blue font-bold text-xl italic">S</div>
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Contas Bancárias</h2>
          <p className="text-slate-500 mt-1">Gerencie suas conexões institucionais e saldos em tempo real.</p>
        </div>
        <button 
          onClick={() => onNavigate('register_account')}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Cadastrar Conta</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Account List */}
        <div className="lg:col-span-8 space-y-6">
          {accounts.map((acc) => (
            <div key={acc.id} className="harmony-card bg-white p-8 border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-blue/20 transition-all">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {acc.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-slate-900">{acc.name}</h3>
                    <p className="text-sm font-medium text-slate-400 tracking-widest leading-none mt-1">•••• {acc.last4}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  acc.type === 'Corrente' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {acc.type}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 leading-none">Saldo Disponível</p>
                <p className="text-4xl font-display font-black text-slate-900 tracking-tight">
                  {formatCurrency(acc.balance)}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2">
                {acc.trend ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                    <TrendingUp size={14} />
                    <span>{acc.trend}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-brand-blue text-xs font-bold">
                    <Info size={14} />
                    <span>{acc.info}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="harmony-card bg-slate-900 border-none shadow-xl shadow-slate-200/50 p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Building2 size={80} />
            </div>
            
            <div className="relative space-y-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-display font-black tracking-tight">Nova Conexão</h3>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">
                  Conecte seu banco, cartão de crédito ou corretora para sincronização em tempo real.
                </p>
              </div>

              <button 
                onClick={() => onNavigate('register_account')}
                className="w-full bg-white text-slate-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-95 shadow-lg shadow-white/5"
              >
                <span>Conectar Agora</span>
                <ArrowRight size={18} />
              </button>

              <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Shield size={12} />
                <span>Segurança Bancária SSL</span>
              </div>
            </div>
          </div>
 
          <div className="mt-6 harmony-card bg-white border-slate-100 p-6 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">DICA DE OURO</h4>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <TrendingUp size={16} />
              </div>
              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                Manter suas contas sincronizadas ajuda a Organomeno a gerar relatórios mais precisos sobre sua evolução patrimonial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

