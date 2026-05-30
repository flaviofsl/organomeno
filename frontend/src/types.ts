export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  provider: string;
}

export interface BankAccount {
  id: string;
  name: string;
  institution: string;
  balance: number;
  lastUpdated: string;
  type: 'Savings' | 'Checking' | 'Credit' | 'Investment';
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'Parent' | 'Child' | 'Dependent';
  avatar?: string;
  contributionPercent?: number;
  expensesPercent?: number;
}

export interface Provider {
  id: string;
  name: string;
  type: 'Salary' | 'Investment' | 'Freelance' | 'Rental' | 'Other';
  active: boolean;
}

export interface CategorizedSpending {
  category: string;
  amount: number;
  color: string;
}

export type NavigateFn = (screen: Screen, query?: Record<string, string>) => void;

export type Screen = 
  | 'dashboard' 
  | 'ledger' 
  | 'register' 
  | 'accounts' 
  | 'family' 
  | 'family_structure'
  | 'providers' 
  | 'dependents' 
  | 'categories'
  | 'login'
  | 'register_user'
  | 'import_ofx'
  | 'forgot_password'
  | 'ledger_book'
  | 'transaction_detail'
  | 'register_category'
  | 'register_account'
  | 'ledger_print_preview'
  | 'maintain_transaction'
  | 'add_family_member'
  | 'notification_settings'
  | 'general_settings'
  | 'entities'
  | 'category_list'
  | 'category_form'
  | 'account_list'
  | 'account_form'
  | 'transfer_list'
  | 'transfer_form'
  | 'import_invoice'
  | 'income_list'
  | 'expense_list'
  | 'register_income'
  | 'register_expense';
