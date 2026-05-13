import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Landmark,
  Chrome,
  Apple,
  ChevronRight
} from 'lucide-react';
import { Screen } from '../types';

interface LoginProps {
  onNavigate: (screen: Screen) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-blue-600" />
        
        <div className="p-10 md:p-12 space-y-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Landmark size={32} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">HarmonyFinance</h1>
              <p className="text-slate-500 font-medium">Acesse sua conta para continuar</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">E-MAIL</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder="seu@email.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-0 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">SENHA</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-0 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Lembrar de mim</span>
              </label>
              <button 
                type="button" 
                onClick={() => onNavigate('forgot_password')}
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] uppercase tracking-wider"
            >
              <span>ENTRAR</span>
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[11px] font-black text-slate-400 uppercase tracking-widest">ou continue com</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3.5 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-black text-[11px] tracking-widest uppercase">
              <Chrome size={18} className="text-orange-500" />
              <span>GOOGLE</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3.5 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-black text-[11px] tracking-widest uppercase text-slate-900">
              <Apple size={18} fill="currentColor" />
              <span>APPLE</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-sm font-bold text-slate-500">
              Não tem uma conta? {' '}
              <button 
                onClick={() => onNavigate('register_user')} 
                className="text-blue-600 hover:underline font-black uppercase tracking-wider ml-1"
              >
                CADASTRAR-SE
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

