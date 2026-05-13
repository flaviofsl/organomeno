import React from 'react';
import { 
  Users, 
  Map, 
  Shield, 
  ArrowRight,
  TrendingUp,
  UserPlus,
  Briefcase,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { MOCK_FAMILY } from '../constants';
import { cn } from '../lib/utils';
import { FamilyMember, Screen } from '../types';

interface FamilyStructureProps {
  onNavigate: (screen: Screen) => void;
}

export function FamilyStructure({ onNavigate }: FamilyStructureProps) {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Family Structure</h2>
        <p className="text-slate-500 mt-1">Visualizing roles and financial contributions.</p>
      </div>

      <div className="harmony-card bg-white border border-slate-200 p-12 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* The Tree Layout */}
        <div className="w-full max-w-5xl flex flex-col items-center">
          
          {/* Top Level: Providers */}
          <div className="flex gap-12 relative z-10">
            {/* João */}
            <div className="w-64 harmony-card bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 flex items-center gap-4 border-b border-slate-50">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
                  alt="João" 
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-display font-bold text-slate-900">João</p>
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-md">Provedor Principal</span>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-500 tracking-tight">Contribuição:</span>
                <span className="text-sm font-black text-slate-900">70%</span>
              </div>
            </div>

            {/* Maria */}
            <div className="w-64 harmony-card bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 flex items-center gap-4 border-b border-slate-50">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" 
                  alt="Maria" 
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-display font-bold text-slate-900">Maria</p>
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-md">Provedora Principal</span>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-500 tracking-tight">Contribuição:</span>
                <span className="text-sm font-black text-slate-900">30%</span>
              </div>
            </div>
          </div>

          {/* Connection Lines (SVG) */}
          <div className="w-full h-24 relative">
            <svg className="w-full h-full" preserveAspectRatio="none">
              {/* Vertical line from João */}
              <line x1="calc(50% - 148px)" y1="0" x2="calc(50% - 148px)" y2="40" stroke="#e2e8f0" strokeWidth="2" />
              {/* Vertical line from Maria */}
              <line x1="calc(50% + 148px)" y1="0" x2="calc(50% + 148px)" y2="40" stroke="#e2e8f0" strokeWidth="2" />
              {/* Horizontal connecting line */}
              <line x1="calc(50% - 148px)" y1="40" x2="calc(50% + 148px)" y2="40" stroke="#e2e8f0" strokeWidth="2" />
              {/* Main vertical line down */}
              <line x1="50%" y1="40" x2="50%" y2="80" stroke="#e2e8f0" strokeWidth="2" />
              
              {/* Branching horizontal line for bottom nodes */}
              <line x1="15%" y1="80" x2="85%" y2="80" stroke="#e2e8f0" strokeWidth="2" />
              
              {/* Vertical lines to bottom cards */}
              <line x1="15%" y1="80" x2="15%" y2="110" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="50%" y1="80" x2="50%" y2="110" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="85%" y1="80" x2="85%" y2="110" stroke="#e2e8f0" strokeWidth="2" />
            </svg>
          </div>

          {/* Bottom Level: Dependents/Contributors */}
          <div className="w-full flex justify-between items-start pt-4 px-4 relative z-10">
            
            {/* Ana & Pedro Group */}
            <div className="flex flex-col gap-4 items-center w-[30%]">
              <div className="w-full harmony-card bg-white border border-slate-200 overflow-hidden shadow-sm p-4 flex justify-between items-center">
                <div className="flex flex-col items-center gap-2">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" 
                    alt="Ana" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900 leading-none">Ana</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Filha</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-100 mx-4"></div>
                <div className="flex flex-col items-center gap-2">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" 
                    alt="Pedro" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900 leading-none">Pedro</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Genro</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Contribuidores</div>
                <p className="text-[10px] font-bold text-slate-900">Independente</p>
              </div>
            </div>

            {/* Carlos */}
            <div className="w-[30%] harmony-card bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 flex flex-col items-center text-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
                  alt="Carlos" 
                  className="w-12 h-12 rounded-lg object-cover mb-3"
                />
                <p className="font-display font-bold text-slate-900 mb-1">Carlos</p>
                <span className="inline-block px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-wider rounded-md mb-6">Dependente</span>
                <div className="w-full flex justify-between items-center pt-4 border-t border-slate-50 uppercase tracking-tighter">
                  <span className="text-[11px] font-bold text-slate-400">Custo Mensal:</span>
                  <span className="text-xs font-black text-rose-600">R$ 2.500</span>
                </div>
              </div>
            </div>

            {/* Beatriz */}
            <div className="w-[30%] harmony-card bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 flex flex-col items-center text-center">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" 
                  alt="Beatriz" 
                  className="w-12 h-12 rounded-lg object-cover mb-3"
                />
                <p className="font-display font-bold text-slate-900 mb-1">Beatriz</p>
                <span className="inline-block px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-wider rounded-md mb-3">Dependente</span>
                <p className="text-[10px] italic font-medium text-slate-400 mb-6 font-serif">Estudante</p>
                <div className="w-full flex justify-between items-center pt-4 border-t border-slate-50 uppercase tracking-tighter text-right">
                  <span className="text-[11px] font-bold text-slate-400">Custo Mensal:</span>
                  <span className="text-xs font-black text-rose-600">R$ 4.200</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon, count }: { title: string, icon: React.ReactNode, count: number }) {
  return (
    <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-brand-blue opacity-70">{icon}</span>
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">{title}</h4>
      </div>
      <span className="text-[10px] bg-slate-200 text-slate-600 font-black px-2 py-0.5 rounded-full">{count}</span>
    </div>
  );
}

const MemberRow: React.FC<{ member: FamilyMember, description: string, onClick?: () => void }> = ({ member, description, onClick }) => {
  return (
    <div 
      className="px-6 py-5 flex items-center gap-6 hover:bg-slate-50 transition-colors group cursor-pointer"
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-xl bg-harmony-gray flex items-center justify-center font-display font-black text-slate-400 group-hover:bg-brand-light group-hover:text-brand-blue transition-colors">
        {member.name[0]}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-slate-900">{member.name}</p>
          <span className="text-[10px] font-black uppercase text-slate-400">ID: {member.id}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md">{description}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-900">{member.contributionPercent}% Contr.</p>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Share of expense: {member.expensesPercent}%</p>
      </div>
      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
}

function ToggleItem({ label, description, active }: { label: string, description: string, active: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <div className={cn(
        "w-10 h-5 rounded-full relative transition-colors cursor-pointer shrink-0",
        active ? "bg-brand-blue" : "bg-slate-200"
      )}>
        <div className={cn(
          "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
          active ? "left-6" : "left-1"
        )}></div>
      </div>
    </div>
  );
}
