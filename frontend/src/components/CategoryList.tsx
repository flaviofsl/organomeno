import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen, NavigateFn } from '../types';
import { Categoria, listarCategorias, deletarCategoria } from '../lib/api';

interface Category {
  id: string;
  nome: string;
  descricao: string;
  ativa: boolean;
  type: 'income' | 'expense';
}

interface CategoryListProps {
  onNavigate: NavigateFn;
}

export function CategoryList({ onNavigate }: CategoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listarCategorias();
        if (!cancelled) {
          const mapped: Category[] = data.map((c) => ({
            id: String(c.id),
            nome: c.nome,
            descricao: c.descricao || '',
            ativa: c.ativa !== false,
            type: c.tipo === 'RECEITA' ? 'income' : 'expense',
          }));
          setCategories(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar categorias.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deletarCategoria(Number(id));
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erro ao excluir categoria.');
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">Categorias</h2>
          <p className="text-slate-500 mt-1">Gerencie a classificação de suas receitas e despesas.</p>
        </div>
        <button 
          onClick={() => onNavigate('category_form')}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Cadastrar Categoria</span>
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-blue-600 outline-none transition-all shadow-sm"
          />
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 size={36} className="animate-spin" />
            <p className="text-sm font-bold">Carregando categorias...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && filteredCategories.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm font-bold">Nenhuma categoria cadastrada.</p>
            <button
              type="button"
              onClick={() => onNavigate('category_form')}
              className="mt-4 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
            >
              Cadastrar primeira categoria
            </button>
          </div>
        )}

        {!loading && !error && filteredCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="harmony-card bg-white border border-slate-100 p-6 flex flex-col justify-between hover:border-blue-100 hover:shadow-lg transition-all group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <Tag size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                        category.ativa ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                      )}>
                        {category.ativa ? 'Ativa' : 'Inativa'}
                      </span>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded text-white font-sans",
                        category.type === 'income' ? "bg-emerald-500" : "bg-rose-500"
                      )}>
                        {category.type === 'income' ? 'R' : 'D'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-black text-slate-900 leading-tight truncate">{category.nome}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {category.description || category.descricao}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onNavigate('category_form', { id: category.id })}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
