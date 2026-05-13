import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  FileSearch,
  FileCheck,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Screen } from '../types';

interface ImportInvoiceProps {
  onNavigate: (screen: Screen) => void;
}

export function ImportInvoice({ onNavigate }: ImportInvoiceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setIsSuccess(true);
      }
    }, 200);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="harmony-card p-12 text-center space-y-6 flex flex-col items-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Nota Importada!</h3>
            <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto">
              A nota fiscal foi processada com sucesso e os lançamentos foram extraídos.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('ledger')}
            className="mt-4 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 text-sm uppercase tracking-widest"
          >
            Ver no Livro Razão
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tight">Importação de Notas</h2>
          <p className="text-slate-500 mt-1">Extraia despesas automaticamente enviando suas notas fiscais em PDF ou XML.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <div className="harmony-card bg-white p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ARQUIVO DA NOTA (PDF, XML, JPG)</label>
              <div 
                className={cn(
                  "border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer relative group",
                  file ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200"
                )}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  id="file-upload"
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.xml,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
                      <FileCheck size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{file.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="text-xs font-black text-rose-500 uppercase tracking-widest hover:text-rose-700 transition-colors"
                    >
                      Remover arquivo
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white text-slate-300 flex items-center justify-center shadow-sm group-hover:text-blue-500 group-hover:shadow-md transition-all">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Arraste a nota fiscal ou clique para selecionar</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Suporta PDF, XML e Imagens</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isUploading && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processando Inteligência Artificial...</span>
                  <span className="text-[10px] font-black text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300 ease-out shadow-lg shadow-blue-100" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-tight">Ocr e mapeamento de categorias em andamento</p>
                </div>
              </div>
            )}

            <button 
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
            >
              <FileSearch size={18} />
              <span>Importar e Processar Nota</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="harmony-card bg-blue-50 border-blue-100 p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-900">Como funciona?</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-black text-xs">1</span>
                </div>
                <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
                  Envie o arquivo original da nota fiscal eletrônica.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-black text-xs">2</span>
                </div>
                <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
                  Nossa IA identifica o estabelecimento, valor final e tributos.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-black text-xs">3</span>
                </div>
                <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
                  Os itens são categorizados automaticamente no seu Livro Razão.
                </p>
              </div>
            </div>
          </div>

          <div className="harmony-card bg-rose-50 border-rose-100 p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-rose-900 uppercase">Atenção</p>
              <p className="text-[10px] font-medium text-rose-700 mt-1">
                Arquivos muito longos ou com baixa resolução podem levar mais tempo para processar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
