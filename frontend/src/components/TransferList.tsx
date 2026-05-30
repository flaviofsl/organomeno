import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { formatTransferenciaData, listarTransferencias, Transferencia } from '../lib/api';
import { NavigateFn } from '../types';

interface TransferListProps {
  onNavigate: NavigateFn;
}

export function TransferList({ onNavigate }: TransferListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [transfers, setTransfers] = useState<Transferencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listarTransferencias();
        if (!cancelled) {
          setTransfers(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar transferências.');
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

  const filteredTransfers = transfers.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      (t.nomeContaOrigem?.toLowerCase().includes(term) ?? false) ||
      (t.nomeContaDestino?.toLowerCase().includes(term) ?? false) ||
      (t.descricao?.toLowerCase().includes(term) ?? false)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">
            Transferências Bancárias
          </h2>
          <p className="text-slate-500 mt-1">
            Registre movimentações entre suas contas e acompanhe o histórico.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('transfer_form')}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          <span>Nova Transferência</span>
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative group max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Pesquisar por conta ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-blue-600 outline-none transition-all shadow-sm"
          />
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 size={36} className="animate-spin" />
            <p className="text-sm font-bold">Carregando transferências...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && filteredTransfers.length === 0 && (
          <div className="text-center py-16 text-slate-400 harmony-card bg-white border border-slate-100">
            <p className="text-sm font-bold">Nenhuma transferência cadastrada.</p>
            <button
              type="button"
              onClick={() => onNavigate('transfer_form')}
              className="mt-4 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
            >
              Cadastrar primeira transferência
            </button>
          </div>
        )}

        {!loading && !error && filteredTransfers.length > 0 && (
          <div className="harmony-card overflow-hidden bg-white border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Origem
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Destino
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Valor
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Data
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Descrição
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTransfers.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 truncate max-w-[200px]">
                          {transfer.nomeContaOrigem ?? `Conta #${transfer.idContaOrigem}`}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-700 truncate max-w-[200px]">
                          {transfer.nomeContaDestino ?? `Conta #${transfer.idContaDestino}`}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-black text-blue-600">
                          {formatCurrency(Number(transfer.valor))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-500">
                          {formatTransferenciaData(transfer.dataTransferencia)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-500 truncate max-w-[240px]">
                          {transfer.descricao || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={cn(
                            'inline-block text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded',
                            transfer.ativa !== false
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-slate-100 text-slate-400',
                          )}
                        >
                          {transfer.ativa !== false ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => onNavigate('transfer_form', { id: String(transfer.id) })}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Editar transferência"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
