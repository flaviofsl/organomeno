import React, { useEffect, useState } from 'react';
import {
  Building2,
  ChevronLeft,
  Hash,
  Landmark,
  Loader2,
  Save,
  Wallet,
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  atualizarConta,
  buscarContaPorId,
  Conta,
  criarConta,
  TIPOS_CONTA,
  tipoContaLabel,
} from '../lib/api';
import { NavigateFn } from '../types';

interface AccountFormProps {
  onNavigate: NavigateFn;
  contaId?: number;
}

interface FormState {
  nome: string;
  banco: string;
  agencia: string;
  numeroConta: string;
  tipoConta: string;
  saldoInicial: string;
  ativa: boolean;
}

const EMPTY_FORM: FormState = {
  nome: '',
  banco: '',
  agencia: '',
  numeroConta: '',
  tipoConta: 'CORRENTE',
  saldoInicial: '',
  ativa: true,
};

function contaToForm(conta: Conta): FormState {
  return {
    nome: conta.nome ?? '',
    banco: conta.banco ?? '',
    agencia: conta.agencia ?? '',
    numeroConta: conta.numeroConta ?? '',
    tipoConta: conta.tipoConta ?? 'CORRENTE',
    saldoInicial: conta.saldoInicial ?? '',
    ativa: conta.ativa !== false,
  };
}

function formToPayload(form: FormState): Omit<Conta, 'id' | 'saldoAtual'> {
  return {
    nome: form.nome.trim(),
    banco: form.banco.trim(),
    agencia: form.agencia.trim() || undefined,
    numeroConta: form.numeroConta.trim() || undefined,
    tipoConta: form.tipoConta || undefined,
    saldoInicial: form.saldoInicial.trim() || undefined,
    ativa: form.ativa,
  };
}

export function AccountForm({ onNavigate, contaId }: AccountFormProps) {
  const isEditing = contaId != null;
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing || contaId == null) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const conta = await buscarContaPorId(contaId);
        if (!cancelled) {
          setForm(contaToForm(conta));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar a conta.');
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
  }, [contaId, isEditing]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!form.nome.trim()) {
      setError('O nome da conta é obrigatório.');
      return;
    }
    if (!form.banco.trim()) {
      setError('O banco é obrigatório.');
      return;
    }

    setSaving(true);
    try {
      const payload = formToPayload(form);
      if (isEditing && contaId != null) {
        const { saldoInicial: _ignored, ...updatePayload } = payload;
        await atualizarConta(contaId, updatePayload);
        setSuccessMessage('Conta atualizada com sucesso.');
      } else {
        await criarConta(payload);
        setSuccessMessage('Conta cadastrada com sucesso.');
      }
      setTimeout(() => onNavigate('account_list'), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a conta.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onNavigate('account_list')}
          className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">
            {isEditing ? 'Editar Conta' : 'Nova Conta'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isEditing
              ? 'Atualize os dados da conta bancária.'
              : 'Cadastre uma conta para movimentações e importação OFX.'}
          </p>
        </div>
      </div>

      <div className="harmony-card bg-white border border-slate-100 shadow-sm p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin" />
            <p className="text-sm font-bold">Carregando conta...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="nome" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nome da conta *
                </label>
                <div className="relative group">
                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    id="nome"
                    type="text"
                    required
                    placeholder="Ex: Conta corrente principal"
                    value={form.nome}
                    onChange={(e) => updateField('nome', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="banco" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Banco *
                </label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    id="banco"
                    type="text"
                    required
                    placeholder="Ex: Banco do Brasil"
                    value={form.banco}
                    onChange={(e) => updateField('banco', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="agencia" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Agência
                </label>
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    id="agencia"
                    type="text"
                    placeholder="Ex: 1234"
                    value={form.agencia}
                    onChange={(e) => updateField('agencia', e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="numeroConta" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Número da conta
                </label>
                <input
                  id="numeroConta"
                  type="text"
                  placeholder="Ex: 56789-0"
                  value={form.numeroConta}
                  onChange={(e) => updateField('numeroConta', e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tipoConta" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Tipo de conta
                </label>
                <select
                  id="tipoConta"
                  value={form.tipoConta}
                  onChange={(e) => updateField('tipoConta', e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all cursor-pointer"
                >
                  {TIPOS_CONTA.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipoContaLabel(tipo)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="saldoInicial" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Saldo inicial (R$)
                </label>
                <div className="relative group">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    id="saldoInicial"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={form.saldoInicial}
                    onChange={(e) => updateField('saldoInicial', e.target.value)}
                    disabled={isEditing}
                    className={cn(
                      'w-full bg-slate-50 border-2 border-transparent rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all',
                      isEditing && 'opacity-60 cursor-not-allowed',
                    )}
                  />
                </div>
                {isEditing && (
                  <p className="text-[10px] text-slate-400 font-medium ml-1">
                    O saldo inicial não é alterado na edição; o saldo atual é atualizado pelas movimentações.
                  </p>
                )}
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
                  Conta ativa
                </label>
              </div>
            </div>

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

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => onNavigate('account_list')}
                className="flex-1 py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-[2] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>{isEditing ? 'Salvar alterações' : 'Cadastrar conta'}</span>
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
