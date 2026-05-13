import React, { useState } from 'react';
import { 
  Bell, 
  ChevronLeft, 
  Save, 
  AlertTriangle, 
  CreditCard, 
  TrendingUp, 
  Mail, 
  Smartphone,
  Calendar,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';

interface NotificationSettingsProps {
  onNavigate: (screen: Screen) => void;
}

export function NotificationSettings({ onNavigate }: NotificationSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Bill/Account Due State
  const [notifyDue, setNotifyDue] = useState(true);
  const [daysBefore, setDaysBefore] = useState('3');

  // Balance Threshold State
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);
  const [balanceThreshold, setBalanceThreshold] = useState('500');

  // Entry Notifications
  const [largeEntryAlert, setLargeEntryAlert] = useState(false);
  const [entryThreshold, setEntryThreshold] = useState('1000');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }, 1000);
  };

  const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: (v: boolean) => void }) => (
    <button 
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        "w-12 h-6 rounded-full transition-all relative",
        enabled ? "bg-blue-600" : "bg-slate-200"
      )}
    >
      <div className={cn(
        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
        enabled ? "left-7" : "left-1"
      )} />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Configurações de Notificação</h2>
          <p className="text-sm font-medium text-slate-500">Escolha como e quando deseja ser alertado sobre suas finanças.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          {/* Channel Selection */}
          <div className="harmony-card bg-white border border-slate-100 shadow-sm p-8 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Bell size={14} /> Canais de Notificação
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">E-mail</p>
                    <p className="text-[11px] font-medium text-slate-500">Alertas detalhados e resumos mensais.</p>
                  </div>
                </div>
                <Toggle enabled={emailNotifications} onChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Push Mobile</p>
                    <p className="text-[11px] font-medium text-slate-500">Notificações instantâneas no seu celular.</p>
                  </div>
                </div>
                <Toggle enabled={pushNotifications} onChange={setPushNotifications} />
              </div>
            </div>
          </div>

          {/* Alert Rules */}
          <div className="harmony-card bg-white border border-slate-100 shadow-sm p-8 space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regras de Alerta</h3>
            
            <div className="space-y-8">
              {/* Vencimentos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-amber-500" size={20} />
                    <p className="text-sm font-bold text-slate-900">Vencimento de Contas</p>
                  </div>
                  <Toggle enabled={notifyDue} onChange={setNotifyDue} />
                </div>
                {notifyDue && (
                  <div className="ml-8 p-4 bg-amber-50 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-2">NOTIFICAR QUANTOS DIAS ANTES?</label>
                    <div className="flex gap-2">
                      {['1', '3', '5', '7'].map(d => (
                        <button 
                          key={d}
                          onClick={() => setDaysBefore(d)}
                          className={cn(
                            "w-10 h-10 rounded-lg text-xs font-bold transition-all",
                            daysBefore === d ? "bg-amber-500 text-white shadow-md shadow-amber-200" : "bg-white text-amber-600 border border-amber-200 hover:bg-amber-100"
                          )}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Saldo Limite */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-rose-500" size={20} />
                    <p className="text-sm font-bold text-slate-900">Aviso de "Perigo" (Saldo Baixo)</p>
                  </div>
                  <Toggle enabled={lowBalanceAlert} onChange={setLowBalanceAlert} />
                </div>
                {lowBalanceAlert && (
                  <div className="ml-8 p-4 bg-rose-50 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest block mb-2">NOTIFICAR ABAIXO DE (R$)</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-rose-400">R$</span>
                      <input 
                        type="number"
                        value={balanceThreshold}
                        onChange={(e) => setBalanceThreshold(e.target.value)}
                        className="w-full bg-white border-2 border-rose-100 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-rose-900 outline-none focus:border-rose-300 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Lançamentos Grandes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-blue-500" size={20} />
                    <p className="text-sm font-bold text-slate-900">Movimentações de Alto Valor</p>
                  </div>
                  <Toggle enabled={largeEntryAlert} onChange={setLargeEntryAlert} />
                </div>
                {largeEntryAlert && (
                  <div className="ml-8 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">AVISAR QUANDO ENTRADA/SAÍDA FOR MAIOR QUE (R$)</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-blue-400">R$</span>
                      <input 
                        type="number"
                        value={entryThreshold}
                        onChange={(e) => setEntryThreshold(e.target.value)}
                        className="w-full bg-white border-2 border-blue-100 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-blue-900 outline-none focus:border-blue-300 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                  "w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95",
                  showSaved ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
                )}
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : showSaved ? (
                  <>
                    <Check size={18} />
                    <span>Configurações Salvas</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Salvar Configurações</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="harmony-card bg-slate-900 text-white p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Dica de Segurança</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Bell size={16} className="text-blue-400" />
                </div>
                <p className="text-xs font-medium text-slate-300 leading-relaxed uppercase tracking-tight">
                  Evite desativar todos os alertas de "Perigo". Eles são fundamentais para prevenir o uso do cheque especial.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <CreditCard size={16} className="text-emerald-400" />
                </div>
                <p className="text-xs font-medium text-slate-300 leading-relaxed uppercase tracking-tight">
                  Manter os alertas de vencimento ativos ajuda no seu score de crédito bancário.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
