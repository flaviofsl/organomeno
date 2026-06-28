import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ListOrdered, 
  PlusCircle, 
  Landmark, 
  Users, 
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Settings,
  ShieldCheck,
  Briefcase,
  Users2,
  Shield,
  Tag,
  FileDown,
  Settings2,
  ScrollText,
  HelpCircle,
  ArrowLeft,
  Home,
  PieChart,
  BookOpen,
  Heart,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight
} from 'lucide-react';
import { Screen } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export function Sidebar({ currentScreen, onScreenChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'ledger_book', label: 'Razão', icon: BookOpen },
    { id: 'entities', label: 'Pessoas', icon: Users },
    { id: 'categories', label: 'Categorias', icon: Tag },
    { id: 'account_list', label: 'Contas', icon: Landmark },
    { id: 'transfer_list', label: 'Transferências', icon: ArrowLeftRight },
    { id: 'income_list', label: 'Receitas', icon: TrendingUp },
    { id: 'expense_list', label: 'Despesas', icon: TrendingDown },
    { id: 'family', label: 'Family Hub', icon: Heart },
    { id: 'reports', label: 'Relatórios', icon: PieChart },
    { id: 'import_invoice', label: 'Notas Fiscais', icon: FileText },
    { id: 'import_ofx', label: 'Importar OFX', icon: FileDown },
    { id: 'notification_settings', label: 'Notificações', icon: Bell },
    { id: 'general_settings', label: 'Configurações', icon: Settings2 },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-border-subtle flex flex-col pt-8">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/20">
          <Landmark size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-display font-extrabold tracking-tight text-slate-900">Organomeno</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none"> Financeiro</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id as Screen)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
              currentScreen === item.id 
                ? "bg-brand-blue text-white shadow-md shadow-brand-blue/15" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={20} className={cn("transition-transform group-hover:scale-110", currentScreen === item.id ? "text-white" : "text-slate-400")} />
            <span className="flex-1 text-left">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-4 border-t border-border-subtle">
        <button 
          onClick={() => onScreenChange('register')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          <PlusCircle size={18} />
          <span>Add Transaction</span>
        </button>

        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <HelpCircle size={20} />
            <span>Help Center</span>
          </button>
          <button 
            onClick={() => onScreenChange('login')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

interface TopbarProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export function Topbar({ currentScreen, onScreenChange }: TopbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'ledger_book', label: 'Transactions' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'ledger', label: 'Budget' },
  ];

  const isDetailView = currentScreen === 'transaction_detail';

  return (
    <header className="h-16 bg-white border-b border-border-subtle flex items-center justify-between px-8 sticky top-0 z-10 font-sans">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          {isDetailView && (
            <button 
              onClick={() => onScreenChange('ledger_book')}
              className="p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-lg font-display font-black text-slate-900 tracking-tight">Organomeno</h2>
        </div>
        
        {!isDetailView && (
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => onScreenChange(item.id as Screen)}
                className={cn(
                  "text-sm font-bold transition-all relative py-5",
                  (currentScreen === item.id || (currentScreen === 'ledger_book' && item.id === 'ledger_book')) 
                    ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600" 
                    : "text-slate-400 hover:text-slate-900"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {isDetailView && (
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button 
                key={item.id}
                className={cn(
                  "text-sm font-bold transition-all relative py-5 text-slate-400 cursor-not-allowed",
                  item.id === 'ledger_book' ? "text-blue-600" : ""
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onScreenChange('notification_settings')}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          <button 
            onClick={() => onScreenChange('general_settings')}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-sm">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
