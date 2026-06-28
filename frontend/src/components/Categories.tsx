import React, { useState, useEffect } from 'react';
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
  X,
  Heart,
  Gift,
  Briefcase,
  TrendingUp,
  Landmark,
  Hammer,
  Tag,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Screen } from '../types';
import { listarCategorias, criarCategoria, deletarCategoria, Categoria } from '../lib/api';
import { CATEGORY_SPENDING } from '../constants';

interface CategoriesProps {
  onNavigate: (screen: Screen) => void;
}

const ICONS = [
  { id: 'house', icon: Home },
  { id: 'bag', icon: ShoppingBag },
  { id: 'zap', icon: Zap },
  { id: 'car', icon: Car },
  { id: 'plane', icon: Plane },
  { id: 'food', icon: Utensils },
  { id: 'secure', icon: Shield },
  { id: 'safety', icon: Shield },
  { id: 'health', icon: Heart },
  { id: 'gift', icon: Gift },
  { id: 'work', icon: Briefcase },
  { id: 'invest', icon: TrendingUp },
  { id: 'bank', icon: Landmark },
  { id: 'build', icon: Hammer },
  { id: 'tag', icon: Tag },
];

const COLORS = [
  { id: 'blue', bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50', hex: '#2563eb' },
  { id: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-50', hex: '#10b981' },
  { id: 'rose', bg: 'bg-rose-500', text: 'text-rose-500', light: 'bg-rose-50', hex: '#f43f5e' },
  { id: 'red', bg: 'bg-rose-600', text: 'text-rose-600', light: 'bg-rose-50', hex: '#f43f5e' },
  { id: 'amber', bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50', hex: '#f59e0b' },
  { id: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-50', hex: '#6366f1' },
  { id: 'orange', bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50', hex: '#f97316' },
  { id: 'purple', bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50', hex: '#a855f7' },
  { id: 'slate', bg: 'bg-slate-600', text: 'text-slate-600', light: 'bg-slate-50', hex: '#64748b' },
];

function getIconComponent(iconId?: string) {
  const found = ICONS.find(i => i.id === iconId);
  return found ? found.icon : Tag;
}

function getColorClasses(colorId?: string) {
  const found = COLORS.find(c => c.id === colorId);
  return found || COLORS[0];
}

export function Categories({ onNavigate }: CategoriesProps) {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick Add form states
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('car');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [categoryType, setCategoryType] = useState<'RECEITA' | 'DESPESA'>('DESPESA');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarCategorias();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deletarCategoria(id);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erro ao excluir categoria.');
      }
    }
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const newCat = await criarCategoria({
        nome: name,
        tipo: categoryType,
        icone: selectedIcon,
        cor: selectedColor,
        ativa: true,
        descricao: 'Adição rápida'
      });
      setCategories(prev => [...prev, newCat]);
      setName('');
      setSelectedIcon('car');
      setSelectedColor('blue');
      setCategoryType('DESPESA');
      alert('Categoria criada com sucesso!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar categoria.');
    } finally {
      setSaving(false);
    }
  };

  // Map and calculate amounts from CATEGORY_SPENDING
  const mappedCategories = categories.map(cat => {
    const spending = CATEGORY_SPENDING.find(s => s.category.toLowerCase() === cat.nome.toLowerCase());
    const amount = spending ? spending.amount : 0;
    const colorClasses = getColorClasses(cat.cor);
    const IconComp = getIconComponent(cat.icone);
    
    let subcategories: { name: string; amount: number }[] = [];
    if (cat.nome.toLowerCase() === 'housing' || cat.nome.toLowerCase() === 'habitação') {
      subcategories = [
        { name: 'Mortgage', amount: spending ? spending.amount * 0.84 : 3200.00 },
        { name: 'Maintenance', amount: spending ? spending.amount * 0.16 : 580.00 }
      ];
    }

    return {
      id: cat.id,
      name: cat.nome,
      description: cat.descricao || '',
      amount: amount,
      icon: <IconComp size={20} className={colorClasses.text} />,
      iconBg: colorClasses.light,
      subcategories: subcategories,
      type: cat.tipo,
      ativa: cat.ativa !== false
    };
  });

  const filteredCategories = mappedCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic pie chart calculations
  const chartData = mappedCategories
    .filter(cat => cat.ativa && cat.amount > 0)
    .map(cat => {
      const colorConfig = COLORS.find(c => c.id === categories.find(original => original.id === cat.id)?.cor) || COLORS[0];
      return {
        name: cat.name,
        value: cat.amount,
        color: colorConfig.hex
      };
    });

  const chartDataToShow = chartData.length > 0 ? chartData : [
    { name: 'Sem gastos', value: 1, color: '#e2e8f0' }
  ];

  const totalSpending = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Gerenciamento de Categorias</h2>
          <p className="text-slate-500 mt-1">Organize a classificação de suas transações para manter uma visão financeira clara.</p>
        </div>
        <button 
          onClick={() => onNavigate('category_form')}
          className="harmony-btn-primary flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm active:scale-95 animate-fade-in"
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
            <h3 className="text-xl font-display font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Visão Geral Mensal</h3>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full max-w-[240px] aspect-square relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDataToShow}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartDataToShow.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-display font-black text-slate-900">
                    {formatCurrency(totalSpending).split('.')[0]}
                  </span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-6">
                {chartDataToShow.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-bold text-slate-500">{item.name}</span>
                    </div>
                    <p className="text-lg font-display font-bold text-slate-900">
                      {item.value > 0 && item.name !== 'Sem gastos' ? formatCurrency(item.value).split('.')[0] : '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Categories List */}
          <div className="harmony-card bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h3 className="text-xl font-display font-bold text-slate-900">Categorias Ativas</h3>
              
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Pesquisar categorias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <Loader2 size={36} className="animate-spin" />
                <p className="text-sm font-bold">Carregando categorias...</p>
              </div>
            )}

            {error && !loading && (
              <div className="flex items-center gap-3 p-4 m-8 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
                <AlertCircle size={20} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            {!loading && !error && filteredCategories.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <p className="text-sm font-bold">Nenhuma categoria encontrada.</p>
              </div>
            )}

            {!loading && !error && filteredCategories.length > 0 && (
              <div className="divide-y divide-slate-50">
                {filteredCategories.map((cat) => (
                  <div key={cat.id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", cat.iconBg)}>
                          {cat.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-display font-black text-slate-900">{cat.name}</h4>
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                              cat.type === 'RECEITA' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            )}>
                              {cat.type === 'RECEITA' ? 'Receita' : 'Despesa'}
                            </span>
                            {!cat.ativa && (
                              <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                                Inativa
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-slate-400">{cat.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-display font-black text-slate-900">{formatCurrency(cat.amount)}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Este Mês</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onNavigate('category_form', { id: String(cat.id) })}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {cat.subcategories.length > 0 && (
                      <div className="mt-6 ml-16 space-y-4">
                        {cat.subcategories.map((sub, i) => (
                          <div key={i} className="flex items-center justify-between group-inner">
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
            )}
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 lg:sticky lg:top-8">
          <div className="harmony-card bg-white border border-slate-100 shadow-sm p-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Adição Rápida</h3>
            
            <form className="space-y-6" onSubmit={handleQuickAdd}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Categoria</label>
                <input 
                  type="text" 
                  placeholder="Ex: Transporte, Alimentação..." 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-100 rounded-lg">
                  <button 
                    type="button"
                    onClick={() => setCategoryType('DESPESA')}
                    className={cn(
                      "py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all",
                      categoryType === 'DESPESA' ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"
                    )}
                  >
                    Despesa
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCategoryType('RECEITA')}
                    className={cn(
                      "py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all",
                      categoryType === 'RECEITA' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"
                    )}
                  >
                    Receita
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria Pai (Opcional)</label>
                <div className="relative group">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none appearance-none transition-all pr-10 cursor-not-allowed" disabled>
                    <option>Nenhuma (Categoria Principal)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" size={18} />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ícone & Cor</label>
                
                <div className="flex gap-4">
                  {[
                    { id: 'car', icon: Car },
                    { id: 'plane', icon: Plane },
                    { id: 'food', icon: Utensils },
                    { id: 'secure', icon: Shield },
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
                <button 
                  type="button" 
                  onClick={() => {
                    setName('');
                    setSelectedIcon('car');
                    setSelectedColor('blue');
                    setCategoryType('DESPESA');
                  }}
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  Limpar
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-md shadow-blue-100 active:scale-95 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

