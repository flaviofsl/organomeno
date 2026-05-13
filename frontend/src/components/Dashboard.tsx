import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Flag,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Home,
  Shield,
  Pencil
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

export function Dashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Family Overview</h2>
        <p className="text-slate-500 mt-1">Here is the latest financial data for your family office.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard 
          label="TOTAL INCOME" 
          value={34250.00} 
          trend="+4.2%" 
          trendType="up"
          subtitle="Received this month"
        />
        <SummaryCard 
          label="TOTAL EXPENSES" 
          value={12480.00} 
          trend="-1.8%" 
          trendType="down"
          subtitle="Spent this month"
        />
        <div className="harmony-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">SAVINGS GOAL</p>
            <Flag size={18} className="text-brand-blue" />
          </div>
          <div>
            <p className="text-4xl font-display font-black text-slate-900 mb-1">$150,000</p>
            <div className="space-y-1.5 mt-4">
              <div className="flex justify-between items-center text-[10px] font-black">
                <span className="text-slate-400 uppercase tracking-widest">Progress</span>
                <span className="text-brand-blue">68%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Monthly Spending */}
        <div className="lg:col-span-8 space-y-6">
          <div className="harmony-card p-8 h-full min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-display font-bold text-slate-900">Monthly Spending</h3>
              <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest border border-brand-blue/20 px-3 py-1.5 rounded-lg hover:bg-brand-light transition-colors">
                View Report
              </button>
            </div>
            
            {/* Simple Spending Visualization */}
            <div className="flex-1 flex flex-col justify-end">
              <div className="grid grid-cols-4 gap-8 items-end h-64">
                <SpendingBar label="Housing" color="bg-brand-blue" height="w-[60%]" />
                <SpendingBar label="Education" color="bg-brand-blue" height="w-[45%]" />
                <SpendingBar label="Health" color="bg-brand-blue" height="w-[30%]" />
                <SpendingBar label="Travel" color="bg-brand-blue" height="w-[20%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Providers & Bills */}
        <div className="lg:col-span-4 space-y-8">
          {/* Providers Section */}
          <section>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-4 px-2">Providers</h3>
            <div className="harmony-card divide-y divide-border-subtle overflow-hidden">
              <ProviderItem 
                name="João Silva" 
                role="Primary Account Holder" 
                icon={<ShieldCheck size={16} className="text-brand-blue" />}
                avatar="J"
              />
              <ProviderItem 
                name="Maria Silva" 
                role="Co-Manager" 
                icon={<CheckCircle2 size={16} className="text-brand-blue" />}
                avatar="M"
              />
            </div>
          </section>

          {/* Upcoming Bills Section */}
          <section>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-4 px-2">Upcoming Bills</h3>
            <div className="harmony-card divide-y divide-border-subtle overflow-hidden">
              <BillItem 
                label="Private Tuition" 
                date="Due in 3 days" 
                amount={1200.00} 
                icon={<GraduationCap size={18} />} 
              />
              <BillItem 
                label="Estate Maintenance" 
                date="Due in 5 days" 
                amount={850.00} 
                icon={<Home size={18} />} 
              />
              <BillItem 
                label="Premium Insurance" 
                date="Due in 12 days" 
                amount={4300.00} 
                icon={<Shield size={18} />} 
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, trend, trendType, subtitle }: { label: string, value: number, trend: string, trendType: 'up' | 'down', subtitle: string }) {
  return (
    <div className="harmony-card p-6 flex flex-col justify-between group hover:border-brand-blue/30 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">{label}</p>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full",
          trendType === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trendType === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-4xl font-display font-black text-slate-900 mb-1">
          {formatCurrency(value)}
        </p>
        <p className="text-[11px] font-medium text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function SpendingBar({ label, color, height }: { label: string, color: string, height: string }) {
  return (
    <div className="flex flex-col items-center gap-4 h-full group">
      <div className="flex-1 w-full flex items-end justify-center bg-slate-50/50 rounded-xl overflow-hidden pb-4">
        <div className={cn("rounded-full w-2 shadow-sm transition-all duration-1000", color, height)}></div>
      </div>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest group-hover:text-slate-900 transition-colors">
        {label}
      </p>
    </div>
  );
}

function ProviderItem({ name, role, icon, avatar }: { name: string, role: string, icon: React.ReactNode, avatar: string }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-display font-black text-slate-400 overflow-hidden">
          {avatar}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role}</p>
        </div>
      </div>
      <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-brand-light group-hover:text-brand-blue transition-colors">
        {icon}
      </div>
    </div>
  );
}

function BillItem({ label, date, amount, icon }: { label: string, date: string, amount: number, icon: React.ReactNode }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{label}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{date}</p>
        </div>
      </div>
      <span className="font-display font-black text-slate-900 text-sm">{formatCurrency(amount)}</span>
    </div>
  );
}
