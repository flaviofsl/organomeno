import React, { useState } from 'react';
import { 
  ChevronLeft, 
  UserPlus, 
  ShieldCheck, 
  Baby, 
  User, 
  Mail,
  Send,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';

interface AddFamilyMemberProps {
  onNavigate: (screen: Screen) => void;
}

export function AddFamilyMember({ onNavigate }: AddFamilyMemberProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Parent' | 'Child' | 'Dependent'>('Child');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="harmony-card p-12 text-center space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Convite Enviado!</h3>
            <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto">
              Um convite foi enviado para <span className="text-slate-900 font-bold">{email}</span>. 
              {name} receberá as instruções para se juntar ao núcleo familiar.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('family')}
            className="mt-4 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 text-sm uppercase tracking-widest"
          >
            Voltar para o Family Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('family')}
          className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Adicionar Membro</h2>
          <p className="text-sm font-medium text-slate-500">Convide um novo integrante para o seu núcleo familiar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <form onSubmit={handleAddMember} className="harmony-card bg-white border border-slate-100 shadow-sm p-8 space-y-8">
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NOME COMPLETO</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-MAIL DO CONVIDADO</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    required
                    type="email" 
                    placeholder="joao@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PAPEL NO NÚCLEO</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'Parent', label: 'Provedor', icon: ShieldCheck, desc: 'Gestor master' },
                    { id: 'Child', label: 'Dependente', icon: Baby, desc: 'Gestão tutelada' },
                    { id: 'Dependent', label: 'Agregado', icon: User, desc: 'Acesso leitura' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as any)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all space-y-2 text-center",
                        role === item.id 
                          ? "bg-blue-50 border-blue-600 shadow-lg shadow-blue-50" 
                          : "bg-white border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <item.icon size={24} className={cn(role === item.id ? "text-blue-600" : "text-slate-300")} />
                      <div>
                        <p className={cn("text-xs font-black uppercase tracking-tight", role === item.id ? "text-blue-600" : "text-slate-400")}>{item.label}</p>
                        <p className="text-[10px] font-medium text-slate-400 leading-tight hidden sm:block">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSending}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  <span>Enviar Convite Familiar</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="harmony-card bg-blue-50 border-blue-100 p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-900">Sobre as permissões</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-900">Provedor</p>
                <p className="text-[11px] font-medium text-blue-700 leading-relaxed">Pode visualizar todas as contas, cadastrar membros e gerenciar o orçamento global do núcleo.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-900">Dependente</p>
                <p className="text-[11px] font-medium text-blue-700 leading-relaxed">Visualiza apenas as suas transações e o saldo compartilhado definido pelos provedores.</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-900">Agregado</p>
                <p className="text-[11px] font-medium text-blue-700 leading-relaxed">Perfil apenas de visualização para acompanhamento das finanças familiares sem poder de edição.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
