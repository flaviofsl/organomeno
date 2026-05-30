import React, { useEffect, useState } from 'react';
import {
  ArrowLeftRight,
  ChevronLeft,
  Loader2,
  Save,
  Trash2,
  FileText,
  Calendar,
  Wallet,
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  atualizarTransferencia,
  buscarTransferenciaPorId,
  criarTransferencia,
  deletarTransferencia,
  fromDatetimeLocalValue,
  listarContas,
  Conta,
  formatContaLabel,
  toDatetimeLocalValue,
  Transferencia,
  TransferenciaPayload,
} from '../lib/api';
import { NavigateFn } from '../types';

interface TransferFormProps {
  onNavigate: NavigateFn;
  transferenciaId?: number;
}

interface FormState {
  idContaOrigem: string;
  idContaDestino: string;
  valor: string;
  dataTransferencia: string;
  descricao: string;
  ativa: boolean;
}

const EMPTY_FORM: FormState = {
  idContaOrigem: '',
  idContaDestino: '',
  valor: '',
  dataTransferencia: toDatetimeLocalValue(new Date().toISOString()),
  descricao: '',
  ativa: true,
};

function transferenciaToForm(transferencia: Transferencia): FormState {
  return {
    idContaOrigem: String(transferencia.idContaOrigem),
    idContaDestino: String(transferencia.idContaDestino),
    valor: String(transferencia.valor),
    dataTransferencia: toDatetimeLocalValue(transferencia.dataTransferencia),
    descricao: transferencia.descricao ?? '',
    ativa: transferencia.ativa !== false,
  };
}

function formToPayload(form: FormState): TransferenciaPayload {
  return {
    idContaOrigem: Number(form.idContaOrigem),
    idContaDestino: Number(form.idContaDestino),
    valor: Number(form.valor.replace(',', '.')),
    dataTransferencia: fromDatetimeLocalValue(form.dataTransferencia),
    descricao: form.descricao.trim() || undefined,
    ativa: form.ativa,
  };
}

export function TransferForm({ onNavigate, transferenciaId }: TransferFormProps) {
  const isEditing = transferenciaId != null;
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const contasAtivas = await listarContas(true);
        if (cancelled) return;
        setContas(contasAtivas);

        if (isEditing && transferenciaId != null) {
          const transferencia = await buscarTransferenciaPorId(transferenciaId);
          if (!cancelled) {
            setForm(transferenciaToForm(transferencia));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar os dados.');
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
  }, [transferenciaId, isEditing]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const validate = (): string | null => {
    if (!form.idContaOrigem) return 'Selecione a conta de origem.';
    if (!form.idContaDestino) return 'Selecione a conta de destino.';
    if (form.idContaOrigem === form.idContaDestino) {
      return 'A conta de origem não pode ser igual à conta de destino.';
    }
    const valor = Number(form.valor.replace(',', '.'));
    if (!form.valor.trim() || !Number.isFinite(valor) || valor <= 0) {
      return 'Informe um valor maior que zero.';
    }
    if (!form.dataTransferencia) return 'Informe a data da transferência.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const payload = formToPayload(form);
      if (isEditing && transferenciaId != null) {
        await atualizarTransferencia(transferenciaId, payload);
        setSuccessMessage('Transferência atualizada com sucesso.');
      } else {
        await criarTransferencia(payload);
        setSuccessMessage('Transferência cadastrada com sucesso.');
      }
      setTimeout(() => onNavigate('transfer_list'), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a transferência.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || transferenciaId == null) return;
    if (!window.confirm('Deseja realmente excluir esta transferência?')) return;

    setDeleting(true);
    setError(null);
    try {
      await deletarTransferencia(transferenciaId);
      onNavigate('transfer_list');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível excluir a transferência.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onNavigate('transfer_list')}
          className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">
            {isEditing ? 'Editar Transferência' : 'Nova Transferência'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isEditing
              ? 'Atualize os dados da movimentação entre contas.'
              : 'Registre uma transferência entre duas contas bancárias.'}
          </p>
        </div>
      </div>

      <div className="harmony-card bg-white border border-slate-100 shadow-sm p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin" />
            <p className="text-sm font-bold">Carregando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="idContaOrigem"
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                >
                  Conta de origem *
                </label>
                <div className="relative group">
                  <ArrowLeftRight
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <select
                    id="idContaOrigem"
                    required
                    value={form.idContaOrigem}
                    onChange={(e) => updateField('idContaOrigem', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="">Selecione...</option>
                    {contas.map((conta) => (
                      <option key={conta.id} value={conta.id}>
                        {formatContaLabel(conta)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="idContaDestino"
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                >
                  Conta de destino *
                </label>
                <div className="relative group">
                  <ArrowLeftRight
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors rotate-180"
                    size={18}
                  />
                  <select
                    id="idContaDestino"
                    required
                    value={form.idContaDestino}
                    onChange={(e) => updateField('idContaDestino', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="">Selecione...</option>
                    {contas.map((conta) => (
                      <option key={conta.id} value={conta.id}>
                        {formatContaLabel(conta)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="valor" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Valor (R$) *
                </label>
                <div className="relative group">
                  <Wallet
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    id="valor"
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="0,00"
                    value={form.valor}
                    onChange={(e) => updateField('valor', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="dataTransferencia"
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                >
                  Data e hora *
                </label>
                <div className="relative group">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    id="dataTransferencia"
                    type="datetime-local"
                    required
                    value={form.dataTransferencia}
                    onChange={(e) => updateField('dataTransferencia', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="descricao"
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                >
                  Descrição
                </label>
                <div className="relative group">
                  <FileText
                    className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <textarea
                    id="descricao"
                    rows={3}
                    placeholder="Ex: Reserva de emergência"
                    value={form.descricao}
                    onChange={(e) => updateField('descricao', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 md:col-span-2 pt-2">
                <input
                  id="ativa"
                  type="checkbox"
                  checked={form.ativa}
                  onChange={(e) => updateField('ativa', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <label htmlFor="ativa" className="text-sm font-bold text-slate-700 cursor-pointer">
                  Transferência ativa
                </label>
              </div>
            </div>

            {contas.length === 0 && (
              <p className="text-sm font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                Cadastre pelo menos duas contas ativas antes de registrar uma transferência.
              </p>
            )}

            {error && (
              <p className="text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                {successMessage}
              </p>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting || saving}
                  className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 border-rose-200 text-rose-600 font-black uppercase tracking-widest text-xs hover:bg-rose-50 transition-all disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  <span>Excluir</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('transfer_list')}
                className="flex-1 py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || deleting || contas.length < 2}
                className="flex-[2] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>{isEditing ? 'Salvar alterações' : 'Cadastrar transferência'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
