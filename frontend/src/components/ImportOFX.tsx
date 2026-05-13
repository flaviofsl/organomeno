import React, { useState } from 'react';
import { 
  Upload, 
  ChevronDown, 
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

export function ImportOFX() {
  const [fileUploaded, setFileUploaded] = useState(true); // Mocking uploaded state for preview
  
  const transactions = [
    {
      id: '1',
      date: 'Oct 12, 2023',
      description: 'WHOLEFDS MKT 1024',
      amount: -142.50,
      category: 'Groceries'
    },
    {
      id: '2',
      date: 'Oct 14, 2023',
      description: 'ACH DEPOSIT - TECH CORP',
      amount: 4250.00,
      category: 'Primary Income'
    },
    {
      id: '3',
      date: 'Oct 15, 2023',
      description: 'PG&E UTILITY PAY',
      amount: -210.34,
      category: 'Utilities'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Import Bank Data</h2>
        <p className="text-slate-500 mt-1">Securely upload OFX or QFX files to reconcile your family accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Config */}
        <div className="lg:col-span-4 space-y-6">
          <div className="harmony-card bg-white p-8 border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">TARGET ACCOUNT</h3>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-900">Select Account</label>
                <div className="relative group">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none appearance-none transition-all pr-10">
                    <option>Choose an account...</option>
                    <option>Joint Checking (...4092)</option>
                    <option>Savings Account</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="harmony-card bg-white border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:border-blue-300 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">Drag and drop file</p>
              <p className="text-sm text-slate-400 font-medium mt-1">or click to browse from your computer</p>
            </div>
            <div className="bg-slate-100 px-4 py-1.5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Supports .OFX, .QFX
            </div>
          </div>
        </div>

        {/* Right Column: Preview Table */}
        <div className="lg:col-span-8">
          <div className="harmony-card bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">TRANSACTION PREVIEW</p>
                <p className="text-sm font-bold text-slate-900">Reviewing <span className="text-blue-600 italic">stmt_2023_10.ofx</span></p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md shadow-blue-100">
                Finalize Import
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
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
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 text-sm font-bold text-slate-500 whitespace-nowrap">{t.date}</td>
                      <td className="px-4 py-6 text-sm font-black text-slate-900">{t.description}</td>
                      <td className={cn(
                        "px-4 py-6 text-sm font-black text-right",
                        t.amount >= 0 ? "text-emerald-600" : "text-slate-900"
                      )}>
                        {t.amount >= 0 ? '+' : ''}{formatCurrency(t.amount)}
                      </td>
                      <td className="px-8 py-6">
                        <div className="relative group min-w-[160px]">
                          <select className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none appearance-none transition-all pr-8">
                            <option>{t.category}</option>
                            <option>Health</option>
                            <option>Transport</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" size={14} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <p className="text-xs font-medium text-slate-500">Showing 3 of 42 transactions</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white transition-colors">Prev</button>
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
