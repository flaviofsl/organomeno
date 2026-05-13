import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  User, 
  Building2, 
  ChevronRight, 
  Eye, 
  UserPlus, 
  X,
  Calendar,
  CreditCard,
  FileText,
  Save,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';

interface Person {
  id: string;
  nome: string;
  tipo: 'FISICA' | 'JURIDICA';
  documento: string; // CPF or CNPJ
  dataNascimento?: string;
  rg?: string;
  sexo?: string;
  irpf?: string;
  ie?: string;
  irpj?: string;
}

interface Dependency {
  id: string;
  responsavelId: string;
  dependenteId: string;
  nivel: number;
}

interface PeopleEntitiesProps {
  onNavigate: (screen: Screen) => void;
}

export function PeopleEntities({ onNavigate }: PeopleEntitiesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [viewingDependencies, setViewingDependencies] = useState<Person | null>(null);
  const [addingDependency, setAddingDependency] = useState<Person | null>(null);

  const [people, setPeople] = useState<Person[]>([
    { id: '1', nome: 'João Silva', tipo: 'FISICA', documento: '123.456.789-00', dataNascimento: '1990-05-15', irpf: 'PROCESSADA' },
    { id: '2', nome: 'Maria Oliveira', tipo: 'FISICA', documento: '987.654.321-11', dataNascimento: '1985-11-20', irpf: 'EM_PROCESSAMENTO' },
    { id: '3', nome: 'Tech Solutions LTDA', tipo: 'JURIDICA', documento: '12.345.678/0001-99', ie: 'ISENTO' },
  ]);

  const [dependencies, setDependencies] = useState<Dependency[]>([
    { id: '1', responsavelId: '1', dependenteId: '2', nivel: 1 },
  ]);

  const [formData, setFormData] = useState<Partial<Person>>({
    tipo: 'FISICA',
    irpf: 'NAO_DECLARADO'
  });

  const handleSavePerson = (e: React.FormEvent) => {
    e.preventDefault();
    const newPerson: Person = {
      ...formData as Person,
      id: Math.random().toString(36).substr(2, 9),
      documento: formData.tipo === 'FISICA' ? (formData.documento || '') : (formData.documento || '')
    };
    setPeople([...people, newPerson]);
    setIsRegistering(false);
    setFormData({ tipo: 'FISICA', irpf: 'NAO_DECLARADO' });
  };

  const filteredPeople = people.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.documento.includes(searchTerm)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">Pessoas</h2>
          <p className="text-slate-500 mt-1">Gerencie pessoas físicas, jurídicas e seus vínculos de dependência.</p>
        </div>
        <button 
          onClick={() => setIsRegistering(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Cadastrar Pessoa</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-blue-600 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Table/List */}
        <div className="harmony-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nascimento</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPeople.map((person) => (
                  <tr key={person.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          person.tipo === 'FISICA' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {person.tipo === 'FISICA' ? <User size={16} /> : <Building2 size={16} />}
                        </div>
                        <span className="font-bold text-slate-900">{person.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-tight px-2 py-1 rounded",
                        person.tipo === 'FISICA' ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                      )}>
                        {person.tipo === 'FISICA' ? 'Física' : 'Jurídica'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{person.documento}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{person.dataNascimento || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setViewingDependencies(person)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Ver Dependências"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => setAddingDependency(person)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Adicionar Vínculo"
                        >
                          <UserPlus size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {isRegistering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Cadastrar Pessoa</h3>
                <p className="text-sm font-medium text-slate-500">Adicione uma nova entidade ao sistema.</p>
              </div>
              <button 
                onClick={() => setIsRegistering(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSavePerson} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NOME / RAZÃO SOCIAL</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: João Silva"
                    value={formData.nome || ''}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">TIPO DE PESSOA</label>
                  <select 
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  >
                    <option value="FISICA">Física</option>
                    <option value="JURIDICA">Jurídica</option>
                  </select>
                </div>
              </div>

              {formData.tipo === 'FISICA' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF</label>
                      <input 
                        type="text" 
                        placeholder="000.000.000-00"
                        value={formData.documento || ''}
                        onChange={(e) => setFormData({...formData, documento: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DATA NASCIMENTO</label>
                      <input 
                        type="date"
                        value={formData.dataNascimento || ''}
                        onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RG</label>
                      <input 
                        type="text"
                        value={formData.rg || ''}
                        onChange={(e) => setFormData({...formData, rg: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SEXO</label>
                      <input 
                        type="text"
                        placeholder="Masculino / Feminino"
                        value={formData.sexo || ''}
                        onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SITUAÇÃO IRPF</label>
                    <select 
                      value={formData.irpf}
                      onChange={(e) => setFormData({...formData, irpf: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                    >
                      <option value="NAO_DECLARADO">Não Declarado</option>
                      <option value="EM_PROCESSAMENTO">Em Processamento</option>
                      <option value="PROCESSADA">Processada</option>
                      <option value="COM_PENDENCIAS">Com Pendências</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNPJ</label>
                      <input 
                        type="text" 
                        placeholder="00.000.000/0001-00"
                        value={formData.documento || ''}
                        onChange={(e) => setFormData({...formData, documento: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">INSCRIÇÃO ESTADUAL</label>
                      <input 
                        type="text"
                        value={formData.ie || ''}
                        onChange={(e) => setFormData({...formData, ie: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">REFERÊNCIA IRPJ</label>
                    <input 
                      type="text"
                      value={formData.irpj || ''}
                      onChange={(e) => setFormData({...formData, irpj: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
                >
                  <Save size={18} />
                  <span>Salvar Pessoa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Dependencies Modal */}
      {viewingDependencies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Dependências</h3>
                <p className="text-sm font-medium text-slate-500">Vínculos de {viewingDependencies.nome}</p>
              </div>
              <button onClick={() => setViewingDependencies(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-4">
              {dependencies.filter(d => d.responsavelId === viewingDependencies.id || d.dependenteId === viewingDependencies.id).length === 0 ? (
                <p className="text-center py-8 text-slate-400 font-medium italic">Nenhum vínculo encontrado.</p>
              ) : (
                <div className="space-y-4">
                  {dependencies.filter(d => d.responsavelId === viewingDependencies.id || d.dependenteId === viewingDependencies.id).map(d => {
                    const otherId = d.responsavelId === viewingDependencies.id ? d.dependenteId : d.responsavelId;
                    const otherPerson = people.find(p => p.id === otherId);
                    const isResponsavel = d.responsavelId === viewingDependencies.id;
                    return (
                      <div key={d.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            isResponsavel ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                          )}>
                            {isResponsavel ? <User size={20} /> : <Users size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{otherPerson?.nome}</p>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                              {isResponsavel ? 'É DEPENDENTE DELE' : 'ELE É RESPONSÁVEL'}
                            </p>
                          </div>
                        </div>
                        <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                          Nível {d.nivel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Dependency Modal */}
      {addingDependency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Novo Vínculo</h3>
                <p className="text-sm font-medium text-slate-500">Relacione {addingDependency.nome} a outra pessoa.</p>
              </div>
              <button onClick={() => setAddingDependency(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as any;
              const newDep: Dependency = {
                id: Math.random().toString(36).substr(2, 9),
                responsavelId: target.responsavel.value,
                dependenteId: target.dependente.value,
                nivel: parseInt(target.nivel.value)
              };
              setDependencies([...dependencies, newDep]);
              setAddingDependency(null);
            }} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RESPONSÁVEL</label>
                <select name="responsavel" className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all">
                  <option value={addingDependency.id}>{addingDependency.nome} (Este)</option>
                  {people.filter(p => p.id !== addingDependency.id).map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DEPENDENTE</label>
                <select name="dependente" className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all">
                  <option value={addingDependency.id}>{addingDependency.nome} (Este)</option>
                  {people.filter(p => p.id !== addingDependency.id).map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NÍVEL DE DEPENDÊNCIA (1-5)</label>
                <input name="nivel" type="number" min="1" max="5" defaultValue="1" className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all" />
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
              >
                <Plus size={18} />
                <span>Adicionar Vínculo</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
