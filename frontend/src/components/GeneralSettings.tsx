import React, { useState } from 'react';
import { 
  Settings2, 
  Plus, 
  Search, 
  Tag, 
  FileText, 
  ChevronRight, 
  Save, 
  X,
  Database,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';

interface Setting {
  id: string;
  name: string;
  value: string;
  category: string;
  description: string;
}

interface GeneralSettingsProps {
  onNavigate: (screen: Screen) => void;
}

export function GeneralSettings({ onNavigate }: GeneralSettingsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [settings, setSettings] = useState<Setting[]>([
    { id: '1', name: 'MOEDA_PADRAO', value: 'BRL', category: 'Financeiro', description: 'Define o símbolo da moeda utilizado em todo o sistema.' },
    { id: '2', name: 'LIMITE_GLOBAL_AVISO', value: '500.00', category: 'Alertas', description: 'Valor padrão para disparo de notificações de saldo crítico.' },
    { id: '3', name: 'TIMEOUT_SESSAO', value: '3600', category: 'Segurança', description: 'Tempo em segundos para expiração automática da sessão do usuário.' },
    { id: '4', name: 'COR_PRIMARIA', value: '#2563EB', category: 'Interface', description: 'Cor principal utilizada para botões e links em destaque.' },
  ]);

  const [newSetting, setNewSetting] = useState({
    name: '',
    value: '',
    category: 'Geral',
    description: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const setting: Setting = {
      ...newSetting,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSettings([setting, ...settings]);
    setIsAdding(false);
    setNewSetting({ name: '', value: '', category: 'Geral', description: '' });
  };

  const filteredSettings = settings.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">Configurações Gerais</h2>
          <p className="text-slate-500 mt-1">Gerencie chaves e valores globais do sistema de forma centralizada.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Nova Configuração</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Search and List */}
        <div className="flex-1 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-blue-600 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSettings.map((setting) => (
              <div 
                key={setting.id}
                className="harmony-card bg-white border border-slate-100 p-6 flex flex-col justify-between hover:border-blue-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                        {setting.category}
                      </span>
                      <h4 className="text-lg font-black text-slate-900 truncate">{setting.name}</h4>
                    </div>
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-blue-600 transition-colors">
                      <Settings2 size={18} />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">VALOR ATUAL</p>
                    <p className="font-mono text-sm font-bold text-slate-900 break-all">{setting.value}</p>
                  </div>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    {setting.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest">Editar Atributos</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Column */}
        <div className="lg:w-80 space-y-6">
          <div className="harmony-card bg-slate-900 text-white p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
                <Database size={20} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest">Estatísticas</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total de Chaves</p>
                <p className="text-3xl font-display font-black text-white">{settings.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Categorias Diferentes</p>
                <p className="text-3xl font-display font-black text-white">
                  {new Set(settings.map(s => s.category)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="harmony-card bg-blue-50 border-blue-100 p-6 space-y-4">
            <div className="flex items-center gap-3 text-blue-600">
              <Layers size={20} />
              <p className="text-xs font-black uppercase tracking-widest">Uso Global</p>
            </div>
            <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
              Estas configurações afetam todos os membros do núcleo familiar e modulam o comportamento das rotinas de cálculo.
            </p>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Nova Configuração</h3>
                <p className="text-sm font-medium text-slate-500">Defina um novo parâmetro global.</p>
              </div>
              <button 
                onClick={() => setIsAdding(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                id="close-config-modal"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NOME DA CHAVE</label>
                  <input 
                    required
                    type="text" 
                    placeholder="EX_CONFIG_NOME"
                    value={newSetting.name}
                    onChange={(e) => setNewSetting({...newSetting, name: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CATEGORIA</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      value={newSetting.category}
                      onChange={(e) => setNewSetting({...newSetting, category: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Geral">Geral</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Alertas">Alertas</option>
                      <option value="Segurança">Segurança</option>
                      <option value="Interface">Interface</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">VALOR DO ATRIBUTO</label>
                <input 
                  required
                  type="text" 
                  placeholder="Insira o valor..."
                  value={newSetting.value}
                  onChange={(e) => setNewSetting({...newSetting, value: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DESCRIÇÃO</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-slate-300" size={18} />
                  <textarea 
                    required
                    rows={3}
                    placeholder="Para que serve este parâmetro?"
                    value={newSetting.description}
                    onChange={(e) => setNewSetting({...newSetting, description: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-100 active:scale-95 uppercase tracking-widest text-xs"
                >
                  <Save size={18} />
                  <span>Cadastrar Atributo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
