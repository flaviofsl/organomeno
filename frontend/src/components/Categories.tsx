import React, { useState } from 'react';
import { 
  Plus, 
  Search,
  ChevronDown,
  CornerDownRight,
  Home,
  ShoppingBag,
  Zap,
  MoreVertical,
  Car,
  Plane,
  Utensils,
  Shield,
  Circle,
  X
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Screen } from '../types';

interface CategoriesProps {
  onNavigate: (screen: Screen) => void;
}

const CHART_DATA = [
  { name: 'Housing', value: 3780, color: '#2563eb' },
  { name: 'Groceries', value: 2100, color: '#10b981' },
  { name: 'Utilities', value: 1260, color: '#ef4444' },
  { name: 'Other', value: 1260, color: '#64748b' },
];

export function Categories({ onNavigate }: CategoriesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('car');
  const [selectedColor, setSelectedColor] = useState('blue');

  const categories = [
    {
      id: '1',
      name: 'Housing',
      description: 'Primary residence expenses',
      amount: 3780.00,
      icon: <Home size={20} className="text-blue-600" />,
      iconBg: 'bg-blue-50',
      subcategories: [
        { name: 'Mortgage', amount: 3200.00 },
        { name: 'Maintenance', amount: 580.00 }
      ]
    },
    {
      id: '2',
      name: 'Groceries',
      description: 'Food and household items',
      amount: 2100.00,
      icon: <ShoppingBag size={20} className="text-emerald-600" />,
      iconBg: 'bg-emerald-50',
      subcategories: []
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Category Management</h2>
          <p className="text-slate-500 mt-1">Organize your transaction classifications to maintain clear financial oversight.</p>
        </div>
        <button 
          onClick={() => onNavigate('register_category')}
          className="harmony-btn-primary flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          <span>Nova Categoria</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Monthly Allocation Overview */}
          <div className="harmony-card bg-white border border-slate-100 shadow-sm p-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Monthly Allocation Overview</h3>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full max-w-[240px] aspect-square relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CHART_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {CHART_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-display font-black text-slate-900">$8.4k</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-6">
                {CHART_DATA.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-bold text-slate-500">{item.name}</span>
                    </div>
                    <p className="text-lg font-display font-bold text-slate-900">{formatCurrency(item.value).split('.')[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Categories List */}
          <div className="harmony-card bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h3 className="text-xl font-display font-bold text-slate-900">Active Categories</h3>
              
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {categories.map((cat) => (
                <div key={cat.id} className="p-8 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", cat.iconBg)}>
                        {cat.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-display font-black text-slate-900">{cat.name}</h4>
                        <p className="text-sm font-bold text-slate-400">{cat.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-display font-black text-slate-900">{formatCurrency(cat.amount)}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">This Month</p>
                    </div>
                  </div>

                  {cat.subcategories.length > 0 && (
                    <div className="mt-6 ml-16 space-y-4">
                      {cat.subcategories.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <CornerDownRight size={16} className="text-slate-300" />
                            <span className="text-sm font-bold text-slate-600">{sub.name}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">{formatCurrency(sub.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 lg:sticky lg:top-8">
          <div className="harmony-card bg-white border border-slate-100 shadow-sm p-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Quick Add</h3>
            
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Transportation" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Category (Optional)</label>
                <div className="relative group">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none appearance-none transition-all pr-10">
                    <option>None (Top Level)</option>
                    <option>Housing</option>
                    <option>Transportation</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" size={18} />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon & Color</label>
                
                <div className="flex gap-4">
                  {[
                    { id: 'car', icon: Car },
                    { id: 'plane', icon: Plane },
                    { id: 'food', icon: Utensils },
                    { id: 'safety', icon: Shield },
                  ].map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedIcon(item.id)}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all",
                          selectedIcon === item.id 
                            ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm" 
                            : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <IconComp size={20} />
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  {[
                    { id: 'blue', color: 'bg-blue-600' },
                    { id: 'emerald', color: 'bg-emerald-400' },
                    { id: 'red', color: 'bg-rose-600' },
                    { id: 'slate', color: 'bg-slate-600' },
                  ].map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all ring-offset-2",
                        selectedColor === color.id ? "ring-2 ring-blue-600 scale-110" : "hover:scale-110",
                        color.color
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button type="button" className="text-sm font-bold text-blue-600 hover:underline">Clear</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-md shadow-blue-100 active:scale-95">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

