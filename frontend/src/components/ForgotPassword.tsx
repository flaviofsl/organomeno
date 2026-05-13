import React, { useState } from 'react';
import { 
  Mail, 
  ArrowRight, 
  Key,
  ArrowLeft
} from 'lucide-react';
import { Screen } from '../types';

interface ForgotPasswordProps {
  onNavigate: (screen: Screen) => void;
}

export function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for sending recovery instructions
    alert('Instruções enviadas para ' + email);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-left">
      <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-10 md:p-12 space-y-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
              <Key size={32} strokeWidth={1.5} />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-display font-bold text-slate-900">Recuperação de Senha</h1>
              <p className="text-slate-500 font-medium leading-relaxed max-w-[320px] mx-auto">
                Insira o endereço de e-mail associado à sua conta. Enviaremos instruções seguras para redefinir sua senha.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="nome@exemplo.com"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-0 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
            >
              <span>Enviar instruções</span>
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Divider */}
          <div className="pt-2 border-t border-slate-50">
            <button 
              onClick={() => onNavigate('login')}
              className="w-full flex items-center justify-center gap-2 text-sm font-bold text-blue-600 hover:underline"
            >
              <ArrowLeft size={16} />
              <span>Voltar para o Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
