const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9090/api';

export interface Conta {
  id: number;
  nome: string;
  banco: string;
  agencia?: string;
  numeroConta?: string;
  tipoConta?: string;
  saldoInicial?: string;
  saldoAtual?: string;
  ativa?: boolean;
}

export type ContaPayload = Omit<Conta, 'id' | 'saldoAtual'>;

export const TIPOS_CONTA = ['CORRENTE', 'POUPANCA', 'SALARIO', 'INVESTIMENTO'] as const;
export type TipoConta = (typeof TIPOS_CONTA)[number];

const TIPO_CONTA_LABELS: Record<TipoConta, string> = {
  CORRENTE: 'Corrente',
  POUPANCA: 'Poupança',
  SALARIO: 'Salário',
  INVESTIMENTO: 'Investimento',
};

export function tipoContaLabel(tipo?: string): string {
  if (!tipo) return '—';
  return TIPO_CONTA_LABELS[tipo as TipoConta] ?? tipo;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ativa?: boolean;
  tipo?: 'RECEITA' | 'DESPESA' | 'AMBOS';
  icone?: string;
  cor?: string;
  idGrupoFamiliar?: number;
}

export interface TransacaoOfxPreview {
  fitId: string;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'RECEITA' | 'DESPESA';
  idCategoria?: number;
}

export interface PreviewOfx {
  nomeArquivo: string;
  transacoes: TransacaoOfxPreview[];
  totalReceitas: number;
  totalDespesas: number;
}

export interface ResultadoImportacaoOfx {
  arquivoId: number;
  nomeArquivo: string;
  quantidadeReceitas: number;
  quantidadeDespesas: number;
  mensagem: string;
}

const OFX_FORM_USUARIO = '123123123';

function buildOfxFormData(file: File, idConta: number): FormData {
  const formData = new FormData();
  formData.append('fileUpload', file);
  formData.append('idConta', String(idConta));
  formData.append('usuario', OFX_FORM_USUARIO);
  return formData;
}

async function parseErrorResponse(response: Response, fallback: string): Promise<string> {
  const text = await response.text();
  if (!text) return fallback;

  try {
    const json = JSON.parse(text);
    if (typeof json === 'string') return json;
    if (typeof json.message === 'string') return json.message;
  } catch {
    // response body is plain text
  }

  return text;
}

export async function listarContas(ativa?: boolean): Promise<Conta[]> {
  const url = new URL(`${API_BASE_URL}/contas/`);
  if (ativa !== undefined) {
    url.searchParams.set('ativa', String(ativa));
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Não foi possível carregar as contas.');
  }

  return response.json();
}

export async function buscarContaPorId(id: number): Promise<Conta> {
  const response = await fetch(`${API_BASE_URL}/contas/${id}`);

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Conta não encontrada.'));
  }

  return response.json();
}

export async function criarConta(conta: ContaPayload): Promise<Conta> {
  const response = await fetch(`${API_BASE_URL}/contas/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(conta),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Não foi possível cadastrar a conta.'));
  }

  return response.json();
}

export async function atualizarConta(id: number, conta: ContaPayload): Promise<Conta> {
  const response = await fetch(`${API_BASE_URL}/contas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(conta),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Não foi possível atualizar a conta.'));
  }

  return response.json();
}

export async function listarCategorias(): Promise<Categoria[]> {
  const response = await fetch(`${API_BASE_URL}/categorias/`);

  if (!response.ok) {
    throw new Error('Não foi possível carregar as categorias.');
  }

  return response.json();
}

export async function deletarCategoria(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Não foi possível excluir a categoria.'));
  }
}

export type CategoriaPayload = Omit<Categoria, 'id'>;

export async function buscarCategoriaPorId(id: number): Promise<Categoria> {
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`);

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Categoria não encontrada.'));
  }

  return response.json();
}

export async function criarCategoria(categoria: CategoriaPayload): Promise<Categoria> {
  const response = await fetch(`${API_BASE_URL}/categorias/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Não foi possível cadastrar a categoria.'));
  }

  return response.json();
}

export async function atualizarCategoria(id: number, categoria: CategoriaPayload): Promise<Categoria> {
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Não foi possível atualizar a categoria.'));
  }

  return response.json();
}


export async function previewOfx(file: File, idConta: number): Promise<PreviewOfx> {
  const response = await fetch(`${API_BASE_URL}/ofx/preview`, {
    method: 'POST',
    body: buildOfxFormData(file, idConta),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Não foi possível processar o arquivo OFX.'));
  }

  return response.json();
}

export async function importarOfx(file: File, idConta: number): Promise<ResultadoImportacaoOfx> {
  const response = await fetch(`${API_BASE_URL}/ofx/upload`, {
    method: 'POST',
    body: buildOfxFormData(file, idConta),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Não foi possível importar o arquivo OFX.'));
  }

  return response.json();
}

export function parseSaldo(value?: string): number {
  if (!value) return 0;
  const normalized = value.replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatContaLabel(conta: Conta): string {
  const suffix = conta.ativa === false ? ' (Inativa)' : '';
  return `${conta.nome} - ${conta.banco}${suffix}`;
}

export function isOfxFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith('.ofx') || name.endsWith('.qfx');
}

export interface Transferencia {
  id: number;
  idContaOrigem: number;
  idContaDestino: number;
  nomeContaOrigem?: string;
  nomeContaDestino?: string;
  valor: number;
  dataTransferencia: string;
  descricao?: string;
  ativa?: boolean;
}

export type TransferenciaPayload = Omit<
  Transferencia,
  'id' | 'nomeContaOrigem' | 'nomeContaDestino'
>;

export async function listarTransferencias(): Promise<Transferencia[]> {
  const response = await fetch(`${API_BASE_URL}/transferencias/`);

  if (!response.ok) {
    throw new Error('Não foi possível carregar as transferências.');
  }

  return response.json();
}

export async function buscarTransferenciaPorId(id: number): Promise<Transferencia> {
  const response = await fetch(`${API_BASE_URL}/transferencias/${id}`);

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Transferência não encontrada.'));
  }

  return response.json();
}

export async function criarTransferencia(transferencia: TransferenciaPayload): Promise<Transferencia> {
  const response = await fetch(`${API_BASE_URL}/transferencias/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transferencia),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Não foi possível cadastrar a transferência.'));
  }

  return response.json();
}

export async function atualizarTransferencia(
  id: number,
  transferencia: TransferenciaPayload,
): Promise<Transferencia> {
  const response = await fetch(`${API_BASE_URL}/transferencias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transferencia),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Não foi possível atualizar a transferência.'));
  }

  return response.json();
}

export async function deletarTransferencia(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/transferencias/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Não foi possível excluir a transferência.'));
  }
}

export function toDatetimeLocalValue(iso?: string): string {
  if (!iso) return '';
  const match = iso.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  if (match) return match[1];
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string {
  if (!value) return '';
  return value.length === 16 ? `${value}:00` : value;
}

export function formatTransferenciaData(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
