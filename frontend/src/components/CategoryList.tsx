import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';

interface Category {
  id: string;
  nome: string;
  descricao: string;
  ativa: boolean;
  type: 'income' | 'expense';
}

interface CategoryListProps {
  onNavigate: (screen: Screen) => void;
}

export function CategoryList({ onNavigate }: CategoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', nome: 'Supermercado', descricao: 'Compras mensais e pequenas idas ao mercado.', ativa: true, type: 'expense' },
    { id: '2', nome: 'Aluguel', descricao: 'Pagamento mensal da residência.', ativa: true, type: 'expense' },
    { id: '3', nome: 'Salário', descricao: 'Recebimento fixo mensal.', ativa: true, type: 'income' },
    { id: '4', nome: 'Lazer', descricao: 'Cinema, jantares e passeios.', ativa: false, type: 'expense' },
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(categories.filter(c => c.id !== id));
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
                    onClick={() => onNavigate('category_form')}
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
      </div>
    </div>
  );
}
