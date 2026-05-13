import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  MoreVertical,
  Tag,
  AlertTriangle,
  Info,
  CheckCircle2,
  Paperclip,
  X,
  Trash2,
  FileText,
} from 'lucide-react';
import { MOCK_TRANSACTIONS, CATEGORY_SPENDING } from '../constants';
import { formatCurrency, formatDate } from '../lib/utils';
import { cn } from '../lib/utils';

export function Ledger() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [closedAlerts, setClosedAlerts] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkedNotes, setLinkedNotes] = useState<Record<string, string>>({
    '1': 'NF_GROCERIES_OCT.pdf'
  });

  const MOCK_IMPORTED_NOTES = [
    { id: 'n1', nome: 'NF_LUNCH_1510.pdf', data: '2023-10-15', valor: 45.90 },
    { id: 'n2', nome: 'TICKET_GAS_STATION.xml', data: '2023-10-16', valor: 150.00 },
    { id: 'n3', nome: 'AMZ_ORDER_ELECTRONICS.pdf', data: '2023-10-18', valor: 1290.00 },
  ];

  const handleLinkNote = (transactionId: string, noteName: string) => {
    setLinkedNotes({ ...linkedNotes, [transactionId]: noteName });
    setLinkModalOpen(false);
  };
  const miscategorizedTransactions = MOCK_TRANSACTIONS.filter(t => {
    const desc = t.description.toLowerCase();
    if ((desc.includes('market') || desc.includes('foods')) && t.category !== 'Groceries') return true;
    if ((desc.includes('apple') || desc.includes('subscription')) && t.category !== 'Services') return true;
    if ((desc.includes('gas') || desc.includes('shell')) && t.category !== 'Transport') return true;
    return false;
  });

  // Alert Logic: Unused Categories (Not used in mock data)
  const usedCategories = new Set(MOCK_TRANSACTIONS.map(t => t.category));
  const unusedCategories = CATEGORY_SPENDING.filter(c => !usedCategories.has(c.category));

  const filteredTransactions = MOCK_TRANSACTIONS.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || t.type === filter;
    return matchesSearch && matchesFilter;
  });

  const dismissAlert = (id: string) => {
    setClosedAlerts([...closedAlerts, id]);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedTransactionId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, we would delete from state or API
    // For now, we'll just simulate it being removed from the UI if we had local state for transactions
    console.log('Deleting transaction:', selectedTransactionId);
    setDeleteModalOpen(false);
    setSelectedTransactionId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">Audit Trail</p>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Financial Ledger</h2>
        </div>
        <div className="flex gap-2">
          <button className="harmony-btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Alerts Section */}
      {(miscategorizedTransactions.length > 0 || unusedCategories.length > 0) && (
        <div className="space-y-3">
          {miscategorizedTransactions.map(t => !closedAlerts.includes(`mis-${t.id}`) && (
            <div key={`mis-${t.id}`} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">Potencial Erro de Categorização</p>
                <p className="text-xs text-amber-700 mt-1">
                  A transação <span className="font-bold">"{t.description}"</span> está em <span className="font-bold">{t.category}</span>, 
                  mas parece pertencer a outra categoria baseada no nome do estabelecimento.
                </p>
              </div>
              <button onClick={() => dismissAlert(`mis-${t.id}`)} className="text-amber-400 hover:text-amber-600 transition-colors">
                <X size={18} />
              </button>
            </div>
          ))}

          {unusedCategories.map(c => !closedAlerts.includes(`unused-${c.category}`) && (
            <div key={`unused-${c.category}`} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Info size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-900">Sugestão de Limpeza</p>
                <p className="text-xs text-blue-700 mt-1">
                  A categoria <span className="font-bold">"{c.category}"</span> não é utilizada em nenhum lançamento recente. 
                  Deseja arquivá-la para simplificar seu plano de contas?
                </p>
              </div>
              <button onClick={() => dismissAlert(`unused-${c.category}`)} className="text-blue-400 hover:text-blue-600 transition-colors">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="harmony-card">
        {/* Table Filters */}
        <div className="p-4 border-b border-border-subtle flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by description or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-blue/10"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            {['All', 'Income', 'Expense'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  filter === f 
                    ? "bg-white text-brand-blue border border-brand-blue/20 shadow-sm" 
                    : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent"
                )}
              >
                {f}
              </button>
            ))}
            <div className="h-9 w-px bg-border-subtle mx-1"></div>
            <button className="harmony-btn-secondary py-2 flex items-center gap-2">
              <Filter size={16} />
              <span>Advanced</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Table Head */}
        <div className="grid grid-cols-12 px-6 py-4 bg-slate-50 border-b border-border-subtle text-[11px] font-black uppercase tracking-widest text-slate-400">
          <div className="col-span-5">Movement & Details</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Account</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border-subtle overflow-hidden">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((t) => (
              <div key={t.id} className="grid grid-cols-12 px-6 py-4 items-center movement-row">
                <div className="col-span-5 flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    t.type === 'Income' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {t.type === 'Income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                      {t.description}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    <Tag size={12} className="opacity-60" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">{t.category}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="text-xs font-semibold text-slate-500">{t.provider}</span>
                </div>

                <div className={cn(
                  "col-span-2 text-right font-mono font-bold text-sm",
                  t.type === 'Income' ? "text-emerald-600" : "text-slate-900"
                )}>
                  {t.type === 'Income' ? '+' : ''}{formatCurrency(t.amount)}
                </div>

                <div className="col-span-1 flex justify-end gap-1">
                  <button 
                    onClick={() => { setSelectedTransactionId(t.id); setLinkModalOpen(true); }}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      linkedNotes[t.id] ? "text-emerald-600 bg-emerald-50" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    )}
                    title={linkedNotes[t.id] ? `Linked: ${linkedNotes[t.id]}` : "Link invoice"}
                  >
                    <Paperclip size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(t.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete transaction"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-slate-400">
              <p className="font-medium">No movements found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 bg-slate-50/50 border-t border-border-subtle flex justify-between items-center px-8">
          <p className="text-xs text-slate-400 font-medium">Showing {filteredTransactions.length} movements</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-border-subtle bg-white text-slate-400 disabled:opacity-50" disabled>
              <ChevronDown className="rotate-90" size={16} />
            </button>
            <button className="p-2 rounded-lg border border-border-subtle bg-white text-slate-800">
              <ChevronDown className="-rotate-90" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={48} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Excluir Transação?</h3>
                <p className="text-sm font-medium text-slate-500">
                  Tem certeza que deseja excluir esta transação? Esta ação não poderá ser desfeita e afetará seus relatórios financeiros.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all font-sans"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-xl transition-all shadow-xl shadow-rose-100 active:scale-95 uppercase tracking-widest text-sm font-sans"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Link Invoice Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Vincular Nota Fiscal</h3>
                <p className="text-sm font-medium text-slate-500">Selecione uma nota processada para este lançamento.</p>
              </div>
              <button onClick={() => setLinkModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-2">
                {MOCK_IMPORTED_NOTES.map(note => (
                  <button 
                    key={note.id}
                    onClick={() => handleLinkNote(selectedTransactionId!, note.nome)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white text-slate-400 group-hover:text-blue-600 rounded-xl shadow-sm">
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-900">{note.nome}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(note.data)} • {formatCurrency(note.valor)}</p>
                      </div>
                    </div>
                    <CheckCircle2 size={20} className="text-slate-200 group-hover:text-blue-200 transition-colors" />
                  </button>
                ))}
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex justify-center">
                <button 
                  onClick={() => setLinkModalOpen(false)}
                  className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                  Fechar sem vincular
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
