import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Upload,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import {
  Categoria,
  Conta,
  PreviewOfx,
  TransacaoOfxPreview,
  formatContaLabel,
  importarOfx,
  isOfxFile,
  listarCategorias,
  listarContas,
  previewOfx,
} from '../lib/api';

const PAGE_SIZE = 10;

export function ImportOFX() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [accounts, setAccounts] = useState<Conta[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewOfx | null>(null);
  const [categoryByFitId, setCategoryByFitId] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      setLoadingAccounts(true);
      setAccountsError(null);

      try {
        const [contas, categorias] = await Promise.all([listarContas(), listarCategorias()]);
        if (cancelled) return;

        setAccounts(contas);
        setCategories(categorias);
        if (contas.length === 1) {
          setSelectedAccountId(String(contas[0].id));
        }
      } catch (error) {
        if (cancelled) return;
        setAccountsError(error instanceof Error ? error.message : 'Erro ao carregar contas.');
      } finally {
        if (!cancelled) {
          setLoadingAccounts(false);
        }
      }
    }

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  const processFile = useCallback(async (file: File) => {
    if (!isOfxFile(file)) {
      setUploadError('Selecione um arquivo .OFX ou .QFX.');
      return;
    }

    if (!selectedAccountId) {
      setUploadError('Selecione uma conta antes de enviar o arquivo.');
      return;
    }

    setSelectedFile(file);
    setPreview(null);
    setImportSuccess(null);
    setUploadError(null);
    setCategoryByFitId({});
    setCurrentPage(1);
    setIsPreviewLoading(true);

    try {
      const result = await previewOfx(file, Number(selectedAccountId));
      setPreview(result);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Erro ao processar o arquivo OFX.');
      setSelectedFile(null);
    } finally {
      setIsPreviewLoading(false);
    }
  }, [selectedAccountId]);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void processFile(file);
    }
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  const handleFinalizeImport = async () => {
    if (!selectedFile || !selectedAccountId || !preview) return;

    setIsImporting(true);
    setUploadError(null);
    setImportSuccess(null);

    try {
      const result = await importarOfx(selectedFile, Number(selectedAccountId));
      setImportSuccess(result.mensagem);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Erro ao importar o arquivo OFX.');
    } finally {
      setIsImporting(false);
    }
  };

  const transactions = preview?.transacoes ?? [];
  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageTransactions = transactions.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Import Bank Data</h2>
        <p className="text-slate-500 mt-1">Securely upload OFX or QFX files to reconcile your family accounts.</p>
      </div>

      {importSuccess && (
        <div className="harmony-card bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-3">
          <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
          <p className="text-sm font-medium text-emerald-800">{importSuccess}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="harmony-card bg-white p-8 border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">TARGET ACCOUNT</h3>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-900">Select Account</label>
                <div className="relative group">
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    disabled={loadingAccounts || accounts.length === 0 || isPreviewLoading || isImporting}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none appearance-none transition-all pr-10 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loadingAccounts ? 'Loading accounts...' : 'Choose an account...'}
                    </option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {formatContaLabel(account)}
                      </option>
                    ))}
                  </select>
                  {loadingAccounts ? (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" size={18} />
                  ) : (
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" size={18} />
                  )}
                </div>
                {accountsError && (
                  <p className="flex items-center gap-2 text-xs font-medium text-rose-600">
                    <AlertCircle size={14} />
                    {accountsError}
                  </p>
                )}
                {!loadingAccounts && !accountsError && accounts.length === 0 && (
                  <p className="text-xs font-medium text-slate-500">
                    No accounts registered yet. Create one before importing.
                  </p>
                )}
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".ofx,.qfx,application/x-ofx,application/vnd.intu.qfx"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div
            role="button"
            tabIndex={0}
            onClick={() => !isPreviewLoading && !isImporting && fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (!isPreviewLoading && !isImporting) {
                  fileInputRef.current?.click();
                }
              }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'harmony-card bg-white border-2 border-dashed p-12 flex flex-col items-center justify-center text-center space-y-4 group transition-colors',
              isDragging ? 'border-blue-400 bg-blue-50/40' : 'border-slate-200 hover:border-blue-300',
              (isPreviewLoading || isImporting) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            {isPreviewLoading ? (
              <>
                <Loader2 className="text-blue-600 animate-spin" size={40} />
                <p className="font-bold text-slate-900">Processing file...</p>
              </>
            ) : selectedFile ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <FileText size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-tight">{selectedFile.name}</p>
                  <p className="text-sm text-slate-400 font-medium mt-1">Click or drop another file to replace</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-tight">Drag and drop file</p>
                  <p className="text-sm text-slate-400 font-medium mt-1">or click to browse from your computer</p>
                </div>
              </>
            )}
            <div className="bg-slate-100 px-4 py-1.5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Supports .OFX, .QFX
            </div>
          </div>

          {uploadError && (
            <p className="flex items-center gap-2 text-xs font-medium text-rose-600">
              <AlertCircle size={14} />
              {uploadError}
            </p>
          )}
        </div>

        <div className="lg:col-span-8">
          <div className="harmony-card bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">TRANSACTION PREVIEW</p>
                <p className="text-sm font-bold text-slate-900">
                  {preview ? (
                    <>
                      Reviewing <span className="text-blue-600 italic">{preview.nomeArquivo}</span>
                      {' '}
                      <span className="text-slate-400 font-medium">
                        ({preview.totalReceitas} receitas, {preview.totalDespesas} despesas)
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-400 font-medium">Select an account and upload an OFX file</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => void handleFinalizeImport()}
                disabled={!preview || !selectedFile || isImporting || isPreviewLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md shadow-blue-100 flex items-center gap-2"
              >
                {isImporting && <Loader2 size={16} className="animate-spin" />}
                Finalize Import
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              {isPreviewLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <Loader2 size={32} className="animate-spin mb-4" />
                  <p className="text-sm font-medium">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <Upload size={32} className="mb-4 opacity-40" />
                  <p className="text-sm font-medium">No transactions to preview yet</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-4 text-left">DATE</th>
                      <th className="px-4 py-4 text-left">DESCRIPTION</th>
                      <th className="px-4 py-4 text-right">AMOUNT</th>
                      <th className="px-8 py-4 text-center">CATEGORY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pageTransactions.map((transaction: TransacaoOfxPreview) => (
                      <tr key={transaction.fitId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 text-sm font-bold text-slate-500 whitespace-nowrap">
                          {transaction.data ? formatDate(transaction.data) : '—'}
                        </td>
                        <td className="px-4 py-6 text-sm font-black text-slate-900">{transaction.descricao || '—'}</td>
                        <td className={cn(
                          'px-4 py-6 text-sm font-black text-right',
                          transaction.valor >= 0 ? 'text-emerald-600' : 'text-slate-900'
                        )}>
                          {transaction.valor >= 0 ? '+' : ''}{formatCurrency(transaction.valor)}
                        </td>
                        <td className="px-8 py-6">
                          <div className="relative group min-w-[160px]">
                            <select
                              value={categoryByFitId[transaction.fitId] ?? ''}
                              onChange={(event) =>
                                setCategoryByFitId((current) => ({
                                  ...current,
                                  [transaction.fitId]: event.target.value,
                                }))
                              }
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none appearance-none transition-all pr-8"
                            >
                              <option value="">Uncategorized</option>
                              {categories.map((category) => (
                                <option key={category.id} value={String(category.id)}>
                                  {category.nome}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" size={14} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {transactions.length > 0 && (
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <p className="text-xs font-medium text-slate-500">
                  Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, transactions.length)} of {transactions.length} transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
