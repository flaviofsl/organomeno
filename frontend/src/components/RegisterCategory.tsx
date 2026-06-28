import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowRight, 
  ChevronLeft,
  LayoutGrid,
  Tag,
  Palette,
  Eye,
  Home,
  ShoppingBag,
  Zap,
  Car,
  Plane,
  Utensils,
  Shield,
  Heart,
  Gift,
  Briefcase,
  TrendingUp,
  Landmark,
  Hammer,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';
import { criarCategoria, atualizarCategoria, buscarCategoriaPorId } from '../lib/api';

interface RegisterCategoryProps {
  onNavigate: (screen: Screen) => void;
  categoriaId?: number;
}

const ICONS = [
  { id: 'house', icon: Home },
  { id: 'bag', icon: ShoppingBag },
  { id: 'zap', icon: Zap },
  { id: 'car', icon: Car },
  { id: 'plane', icon: Plane },
  { id: 'food', icon: Utensils },
  { id: 'secure', icon: Shield },
  { id: 'health', icon: Heart },
  { id: 'gift', icon: Gift },
  { id: 'work', icon: Briefcase },
  { id: 'invest', icon: TrendingUp },
  { id: 'bank', icon: Landmark },
  { id: 'build', icon: Hammer },
];

const COLORS = [
  { id: 'blue', value: '#2563eb', bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
  { id: 'emerald', value: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-50' },
  { id: 'rose', value: '#f43f5e', bg: 'bg-rose-500', text: 'text-rose-500', light: 'bg-rose-50' },
  { id: 'amber', value: '#f59e0b', bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50' },
  { id: 'indigo', value: '#6366f1', bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-50' },
  { id: 'orange', value: '#f97316', bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50' },
  { id: 'purple', value: '#a855f7', bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50' },
];

export function RegisterCategory({ onNavigate, categoriaId }: RegisterCategoryProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'expense' as 'expense' | 'income',
    parentCategory: '',
    icon: 'house',
    color: 'blue'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!categoriaId) return;

    async function loadCategory() {
      setLoading(true);
      setError(null);
      try {
        const cat = await buscarCategoriaPorId(categoriaId);
        setFormData({
          name: cat.nome,
          description: cat.descricao || '',
          type: cat.tipo === 'RECEITA' ? 'income' : 'expense',
          parentCategory: '',
          icon: cat.icone || 'house',
          color: cat.cor || 'blue'
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar categoria.');
      } finally {
        setLoading(false);
      }
    }

    loadCategory();
  }, [categoriaId]);

  const selectedColor = COLORS.find(c => c.id === formData.color) || COLORS[0];
  const SelectedIcon = ICONS.find(i => i.id === formData.icon)?.icon || Home;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        nome: formData.name,
        tipo: formData.type === 'income' ? 'RECEITA' : 'DESPESA' as 'RECEITA' | 'DESPESA',
        icone: formData.icon,
        cor: formData.color,
        ativa: true,
        descricao: formData.description
      };

      if (categoriaId) {
        await atualizarCategoria(categoriaId, payload);
        alert('Categoria atualizada com sucesso!');
      } else {
        await criarCategoria(payload);
        alert('Categoria criada com sucesso!');
      }
      onNavigate('categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar categoria.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <Loader2 size={36} className="animate-spin" />
        <p className="text-sm font-bold">Carregando dados da categoria...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('categories')}
            className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">
              {categoriaId ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              {categoriaId ? 'Atualize as informações da sua categoria.' : 'Defina como suas transações serão classificadas.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form */}
        <div className="lg:col-span-8">
          <div className="harmony-card bg-white p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">NOME DA CATEGORIA</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Ex: Supermercado, Aluguel, Lazer..."
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">TIPO</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense' })}
                      className={cn(
                        "py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all",
                        formData.type === 'expense' ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"
                      )}
                    >
                      Despesa
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income' })}
                      className={cn(
                        "py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all",
                        formData.type === 'income' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"
                      )}
                    >
                      Receita
                    </button>
                  </div>
                </div>

                {/* Sub-category of */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">CATEGORIA PAI (OPCIONAL)</label>
                  <div className="relative group">
                    <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none appearance-none transition-all cursor-pointer"
                      value={formData.parentCategory}
                      onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                    >
                      <option value="">Nenhuma (Categoria Principal)</option>
                      <option value="housing">Habitação</option>
                      <option value="food">Alimentação</option>
                      <option value="transportation">Transporte</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">DESCRIÇÃO</label>
                <textarea 
                  rows={3}
                  placeholder="Explique brevemente o propósito desta categoria..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-0 outline-none transition-all placeholder:text-slate-300 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Icon Selection */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">ESCOLHER ÍCONE</label>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
                  {ICONS.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.id })}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all group",
                          formData.icon === item.id 
                            ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md" 
                            : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-white"
                        )}
                      >
                        <IconComp size={20} className={cn(formData.icon === item.id ? "scale-110" : "group-hover:scale-110")} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-slate-400" />
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">DEFINIR COR</label>
                </div>
                <div className="flex flex-wrap gap-4">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.id })}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all ring-offset-4",
                        formData.color === color.id ? "ring-2 ring-blue-600 scale-125" : "hover:scale-110",
                        color.bg
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <button 
                  type="button" 
                  disabled={saving}
                  onClick={() => onNavigate('categories')}
                  className="text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <span>{categoriaId ? 'SALVAR ALTERAÇÕES' : 'CRIAR CATEGORIA'}</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
          <div className="harmony-card bg-slate-900 p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4">
              <Eye size={20} className="text-white/20" />
            </div>
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">PRÉ-VISUALIZAÇÃO</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-500", selectedColor.bg)}>
                  <SelectedIcon size={28} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-display font-black tracking-tight">{formData.name || 'Minha Categoria'}</h4>
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded", formData.type === 'expense' ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400")}>
                    {formData.type === 'expense' ? 'DESPESA' : 'RECEITA'}
                  </span>
                </div>
              </div>
              
              <p className="text-sm font-medium text-white/60 leading-relaxed min-h-[40px]">
                {formData.description || 'Descrição da sua categoria aparecerá aqui...'}
              </p>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">GASTO ATUAL</p>
                  <p className="text-2xl font-display font-black mt-1">R$ 0,00</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40">
                  <Plus size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="harmony-card bg-white p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Zap size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">Dica Pro</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Use cores vivas para categorias críticas para facilitar a visualização no dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
