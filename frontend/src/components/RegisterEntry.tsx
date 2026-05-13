import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Check,
  Utensils,
  CreditCard,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

export function RegisterEntry() {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('125.50');
  const [description, setDescription] = useState('Whole Foods Market');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const [endDate, setEndDate] = useState('');

  const categories = ['Groceries & Household', 'Dining Out', 'Utilities', 'Education', 'Transport'];
  const accounts = ['Joint Checking (...4092)', 'Savings Account', 'Credit Card'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for saving would go here
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Register Entry</h2>
        <p className="text-slate-500 mt-1">Record a new income or expense manually into your ledger.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-8">
          <div className="harmony-card bg-white p-10 border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Type Toggle */}
              <div className="flex justify-center">
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 w-full max-w-sm">
                  <button 
                    type="button"
                    onClick={() => setType('income')}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all",
                      type === 'income' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                    )}
                  >
                    Income
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType('expense')}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all",
                      type === 'expense' ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"
                    )}
                  >
                    Expense
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-left block">AMOUNT</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-display font-black text-slate-400">
                    $
                  </div>
                  <input 
                    type="text" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-6 pl-12 pr-6 text-2xl font-display font-black text-slate-900 focus:bg-white focus:border-brand-blue/20 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Row 1: Date & Account */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">DATE</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue="10/27/2023"
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-blue/20 outline-none appearance-none"
                    />
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">ACCOUNT</label>
                  <div className="relative group">
                    <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-blue/20 outline-none appearance-none pr-10">
                      {accounts.map(acc => <option key={acc}>{acc}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Row 2: Category & Vendor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">CATEGORY</label>
                  <div className="relative group">
                    <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-blue/20 outline-none appearance-none pr-10">
                      {categories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">DESCRIPTION / VENDOR</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-blue/20 outline-none"
                    placeholder="Enter vendor name"
                  />
                </div>
              </div>

              {/* Recurring Fields */}
              {isRecurring && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">FREQUENCY</label>
                    <div className="relative group">
                      <select 
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:border-brand-blue/20 outline-none appearance-none pr-10"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">END DATE (OPTIONAL)</label>
                    <div className="relative group">
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:border-brand-blue/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                    isRecurring ? "bg-brand-blue border-brand-blue" : "border-slate-200 bg-white group-hover:border-brand-blue/40"
                  )}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    {isRecurring && <Check size={12} className="text-white" strokeWidth={4} />}
                  </div>
                  <span className="text-sm font-bold text-slate-600">Mark as recurring transaction</span>
                </label>
                
                <div className="flex items-center gap-8">
                  <button type="button" className="text-sm font-bold text-brand-blue hover:underline">Cancel</button>
                  <button type="submit" className="harmony-btn-primary flex items-center gap-2 px-8 py-3.5 bg-brand-blue border-none shadow-none rounded-xl">
                    <Check size={18} strokeWidth={3} />
                    <span>Save Entry</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Recent Entries */}
        <div className="lg:col-span-4">
          <div className="harmony-card bg-white border-slate-100 flex flex-col p-8 h-full min-h-[500px]">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-8">Recent Entries</h3>
            
            <div className="space-y-8 flex-1">
              <RecentItem 
                icon={<Utensils size={18} />} 
                name="Bistro Bella" 
                category="Dining Out" 
                date="Today" 
                amount={-84.20} 
                iconBg="bg-slate-50 text-slate-600"
              />
              <RecentItem 
                icon={<CreditCard size={18} />} 
                name="Client Retainer" 
                category="Income" 
                date="Yesterday" 
                amount={2500.00} 
                iconBg="bg-emerald-50 text-emerald-600"
              />
              <RecentItem 
                icon={<Zap size={18} />} 
                name="City Electric" 
                category="Utilities" 
                date="Oct 25" 
                amount={-142.00} 
                iconBg="bg-slate-50 text-slate-600"
              />
              <RecentItem 
                icon={<ShoppingBag size={18} />} 
                name="Target" 
                category="Household" 
                date="Oct 24" 
                amount={-65.99} 
                iconBg="bg-slate-50 text-slate-600"
              />
            </div>

            <button className="w-full mt-10 py-3.5 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-brand-blue tracking-[0.2em] hover:bg-slate-50 transition-colors">
              View All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentItem({ icon, name, category, date, amount, iconBg }: { 
  icon: React.ReactNode, 
  name: string, 
  category: string, 
  date: string, 
  amount: number,
  iconBg: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">{name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{category} • {date}</p>
        </div>
      </div>
      <span className={cn(
        "font-display font-bold text-sm tracking-tight",
        amount >= 0 ? "text-emerald-600" : "text-slate-900"
      )}>
        {amount >= 0 ? '+' : ''}{formatCurrency(amount)}
      </span>
    </div>
  );
}
