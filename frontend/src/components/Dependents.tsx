import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  PencilLine, 
  TrendingUp,
  Info,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

export function Dependents() {
  const [allocation, setAllocation] = useState({
    beatriz: 4800,
    carlos: 2500,
    total: 8000
  });

  const unallocated = allocation.total - (allocation.beatriz + allocation.carlos);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Dependents Planning</h2>
          <p className="text-slate-500 mt-1">Monthly oversight and budget allocation for Carlos and Beatriz.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Beatriz Card */}
        <div className="harmony-card p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden">
                {/* Image Placeholder */}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-display font-black text-slate-900">Beatriz</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-light text-brand-blue">
                    UNIVERSITY STUDENT
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">BSc Computer Science, Year 2</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">EDUCATION FUND</p>
              <p className="text-sm font-display font-black text-slate-900">$45,000 / $60,000</p>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden mb-3 border border-slate-100">
              <div className="h-full bg-brand-blue rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-400">75% Funded</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <TrendingUp size={10} /> On track
              </span>
            </div>
          </div>
        </div>

        {/* Carlos Card */}
        <div className="harmony-card p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden">
                {/* Image Placeholder */}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-display font-black text-slate-900">Carlos</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-light text-brand-blue">
                    INDEPENDENT
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Living in Austin, TX</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 h-[100px] flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">MONTHLY SUPPORT</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-display font-black text-slate-900">$2,500</span>
              <span className="text-slate-400 font-bold text-sm">/mo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Semester Costs Breakdown */}
        <div className="lg:col-span-7 harmony-card overflow-hidden">
          <div className="p-6 border-b border-border-subtle bg-white">
            <h3 className="text-lg font-display font-bold text-slate-900">Semester Costs Breakdown</h3>
          </div>
          <div className="divide-y divide-border-subtle">
            <CostItem icon={<GraduationCap size={18} />} label="Tuition" value={12500} />
            <CostItem icon={<BookOpen size={18} />} label="Books & Materials" value={850} />
            <CostItem icon={<Building2 size={18} />} label="Dormitory" value={4200} />
          </div>
        </div>

        {/* Living Expenses */}
        <div className="lg:col-span-5 harmony-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-display font-bold text-slate-900">Living Expenses</h3>
            <button className="text-brand-blue hover:bg-brand-light p-1 rounded-lg transition-colors">
              <PencilLine size={18} />
            </button>
          </div>
          <div className="space-y-6">
            <ExpenseItem label="Rent Contribution" subtext="Shared apartment" amount={1200} />
            <ExpenseItem label="Groceries" subtext="Estimated" amount={600} />
            <ExpenseItem label="Utilities & Internet" subtext="Fixed monthly" amount={250} />
            <ExpenseItem label="Miscellaneous" subtext="Discretionary" amount={450} />
          </div>
        </div>
      </div>

      {/* Support Allocation Tool */}
      <div className="harmony-card p-6 bg-white">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">Support Allocation Tool</h3>
            <p className="text-xs text-slate-500 font-medium">Adjust monthly distributions from the central family fund.</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">TOTAL AVAILABLE</p>
            <p className="text-2xl font-display font-black text-slate-900">$8,000 / mo</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            <span>Beatriz (60%)</span>
            <span>Carlos (31%)</span>
            <span>Unallocated (9%)</span>
          </div>
          <div className="h-8 w-full flex rounded-lg overflow-hidden shadow-inner bg-slate-100">
            <div 
              className="h-full bg-brand-blue flex items-center justify-center text-[10px] font-black text-white px-2"
              style={{ width: `${(allocation.beatriz / allocation.total) * 100}%` }}
            >
              $4,800
            </div>
            <div 
              className="h-full bg-brand-blue/30 flex items-center justify-center text-[10px] font-black text-slate-600 px-2"
              style={{ width: `${(allocation.carlos / allocation.total) * 100}%` }}
            >
              $2,500
            </div>
            <div 
              className="h-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 px-2"
              style={{ width: `${(unallocated / allocation.total) * 100}%` }}
            >
              $700
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button className="harmony-btn-secondary py-2 px-6">Reset</button>
            <button className="harmony-btn-primary bg-slate-900 hover:bg-black py-2 px-6 border-none shadow-none">Save Allocation</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CostItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
          {icon}
        </div>
        <span className="font-bold text-slate-900 text-sm">{label}</span>
      </div>
      <span className="font-display font-black text-slate-900">{formatCurrency(value)}</span>
    </div>
  );
}

function ExpenseItem({ label, subtext, amount }: { label: string, subtext: string, amount: number }) {
  return (
    <div className="flex justify-between items-start group">
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtext}</p>
      </div>
      <span className="font-display font-black text-slate-900">{formatCurrency(amount)}</span>
    </div>
  );
}
