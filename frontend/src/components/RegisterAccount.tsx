import React, { useState } from 'react';
import { 
  Building2, 
  ChevronLeft, 
  Search, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Info,
  CheckCircle2,
  Landmark,
  CreditCard,
  Target,
  Plus,
  Save,
  Wallet
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';

interface RegisterAccountProps {
  onNavigate: (screen: Screen) => void;
}

const POPULAR_BANKS = [
  { id: 'chase', name: 'Chase Bank', color: 'bg-blue-600', icon: Building2 },
  { id: 'boa', name: 'Bank of America', color: 'bg-red-600', icon: Landmark },
  { id: 'wells', name: 'Wells Fargo', color: 'bg-yellow-600', icon: Building2 },
  { id: 'citi', name: 'Citibank', color: 'bg-blue-500', icon: CreditCard },
  { id: 'capitalone', name: 'Capital One', color: 'bg-blue-900', icon: CreditCard },
  { id: 'goldman', name: 'Goldman Sachs', color: 'bg-slate-800', icon: Target },
];

export function RegisterAccount({ onNavigate }: RegisterAccountProps) {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  // Manual Entry State
  const [manualBankName, setManualBankName] = useState('');
  const [manualAccountType, setManualAccountType] = useState('Corrente');
  const [manualBalance, setManualBalance] = useState('');
  const [manualLast4, setManualLast4] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);

  const handleSaveManual = () => {
    setIsSavingManual(true);
    setTimeout(() => {
      setIsSavingManual(false);
      setStep(3); // Go to success step
    }, 1500);
  };

  const handleConnect = () => {
    setStep(2);
    setTimeout(() => {
      setStep(3);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('accounts')}
            className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Conectar Instituição</h2>
            <p className="text-sm font-medium text-slate-500">Sincronize suas contas de forma segura e automática.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Interface */}
        <div className="lg:col-span-8">
          <div className="harmony-card bg-white border border-slate-100 shadow-sm relative overflow-hidden min-h-[500px] flex flex-col">
            
            {step === 1 && (
              <div className="p-8 space-y-8 flex-1">
                {/* Search */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Busque por seu banco ou corretora..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-base font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-0 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Popular Banks Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">INSTITUIÇÕES POPULARES</label>
                    <button 
                      onClick={() => setStep(4)}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      Cadastrar Manualmente
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {POPULAR_BANKS.map((bank) => {
                      const Icon = bank.icon;
                      return (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={cn(
                            "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden",
                            selectedBank === bank.id 
                              ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md" 
                              : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", bank.color)}>
                            <Icon size={24} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-tight text-center">{bank.name}</span>
                          {selectedBank === bank.id && (
                            <div className="absolute top-2 right-2 text-blue-600">
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm Button */}
                <div className="pt-8 mt-auto">
                  <button 
                    onClick={handleConnect}
                    disabled={!selectedBank}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95 uppercase tracking-wider"
                  >
                    <span>CONECTAR COM SEGURANÇA</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-8 animate-pulse">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <Building2 size={40} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-display font-black text-slate-900">Conectando ao {POPULAR_BANKS.find(b => b.id === selectedBank)?.name}...</h3>
                  <p className="text-sm font-medium text-slate-500">Estamos estabelecendo um túnel de segurança criptografado.</p>
                </div>
                <div className="w-full max-w-[240px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-2/3 animate-[shimmer_2s_infinite] origin-left" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-8">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-100">
                  <CheckCircle2 size={40} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-display font-black text-slate-900">
                    {manualBankName ? 'Conta Cadastrada!' : 'Conexão Realizada!'}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 max-w-[320px]">
                    {manualBankName 
                      ? 'As informações da sua conta foram salvas com sucesso.' 
                      : 'Suas transações começarão a aparecer no Dashboard nos próximos minutos.'}
                  </p>
                </div>
                <button 
                  onClick={() => onNavigate('accounts')}
                  className="bg-slate-900 text-white font-black py-4 px-12 rounded-xl hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Concluído
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="p-8 space-y-8 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-display font-black text-slate-900">Cadastro Manual</h3>
                    <p className="text-sm font-medium text-slate-500">Insira os detalhes da sua conta bancária.</p>
                  </div>
                  <button 
                    onClick={() => setStep(1)}
                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
                  >
                    <Plus size={20} className="rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NOME DO BANCO</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Ex: Banco do Brasil"
                        value={manualBankName}
                        onChange={(e) => setManualBankName(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">TIPO DE CONTA</label>
                      <select 
                        value={manualAccountType}
                        onChange={(e) => setManualAccountType(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="Corrente">Corrente</option>
                        <option value="Poupança">Poupança</option>
                        <option value="Investimento">Investimento</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ÚLTIMOS 4 DÍGITOS</label>
                      <div className="relative group">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input 
                          type="text" 
                          placeholder="Ex: 4589"
                          maxLength={4}
                          value={manualLast4}
                          onChange={(e) => setManualLast4(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SALDO ATUAL (R$)</label>
                    <div className="relative group">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="0,00"
                        value={manualBalance}
                        onChange={(e) => setManualBalance(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-auto">
                  <button 
                    onClick={handleSaveManual}
                    disabled={!manualBankName || !manualBalance || isSavingManual}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 uppercase tracking-wider text-xs"
                  >
                    {isSavingManual ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Salvar Conta Manual</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="harmony-card bg-slate-900 p-8 text-white space-y-6 relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck size={20} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">Segurança de Nível Bancário</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-slate-500"><Lock size={14} /></div>
                <p className="text-xs font-medium text-slate-300 leading-relaxed">Suas credenciais nunca são armazenadas em nossos servidores.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-slate-500"><ShieldCheck size={14} /></div>
                <p className="text-xs font-medium text-slate-300 leading-relaxed">Criptografia AES-256 de ponta a ponta durante todo o processo.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-slate-500"><CheckCircle2 size={14} /></div>
                <p className="text-xs font-medium text-slate-300 leading-relaxed">Acesso apenas para leitura: não podemos realizar transferências.</p>
              </div>
            </div>
          </div>

          <div className="harmony-card bg-white p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Info size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">Por que conectar?</p>
              <p className="text-[10px] text-slate-500 mt-0.5">A conexão automática evita erros de digitação e garante que seus relatórios estejam sempre em dia.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
