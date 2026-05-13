import { Transaction, BankAccount, FamilyMember, Provider, CategorizedSpending } from './types';

export const MOCK_ACCOUNTS: BankAccount[] = [
  { id: '1', name: 'Main Checking', institution: 'Chase', balance: 12450.60, lastUpdated: new Date().toISOString(), type: 'Checking' },
  { id: '2', name: 'Family Savings', institution: 'Marcus', balance: 45000.00, lastUpdated: new Date().toISOString(), type: 'Savings' },
  { id: '3', name: 'Primary Credit Card', institution: 'Amex', balance: -2450.20, lastUpdated: new Date().toISOString(), type: 'Credit' },
  { id: '4', name: 'Schwab Brokerage', institution: 'Charles Schwab', balance: 156700.45, lastUpdated: new Date().toISOString(), type: 'Investment' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-05-01', description: 'Whole Foods Market', category: 'Groceries', amount: 156.20, type: 'Expense', provider: 'Main Checking' },
  { id: 't2', date: '2024-04-30', description: 'Apple Subscription', category: 'Services', amount: 14.99, type: 'Expense', provider: 'Primary Credit Card' },
  { id: 't3', date: '2024-04-28', description: 'Monthly Salary', category: 'Income', amount: 8500.00, type: 'Income', provider: 'Main Checking' },
  { id: 't4', date: '2024-04-25', description: 'Shell Gas Station', category: 'Transport', amount: 65.00, type: 'Expense', provider: 'Primary Credit Card' },
  { id: 't5', date: '2024-04-22', description: 'Rent Payment', category: 'Housing', amount: 3200.00, type: 'Expense', provider: 'Main Checking' },
  { id: 't6', date: '2024-04-20', description: 'Starbucks Coffee', category: 'Dining', amount: 6.45, type: 'Expense', provider: 'Primary Credit Card' },
];

export const MOCK_FAMILY: FamilyMember[] = [
  { id: 'f1', name: 'Alex Thompson', role: 'Parent', contributionPercent: 65, expensesPercent: 40 },
  { id: 'f2', name: 'Sarah Thompson', role: 'Parent', contributionPercent: 35, expensesPercent: 30 },
  { id: 'f3', name: 'Leo Thompson', role: 'Child', contributionPercent: 0, expensesPercent: 20 },
  { id: 'f4', name: 'Mia Thompson', role: 'Child', contributionPercent: 0, expensesPercent: 10 },
];

export const CATEGORY_SPENDING: CategorizedSpending[] = [
  { category: 'Housing', amount: 3200, color: '#0047FF' },
  { category: 'Groceries', amount: 850, color: '#10B981' },
  { category: 'Transport', amount: 420, color: '#F59E0B' },
  { category: 'Dining', amount: 600, color: '#EF4444' },
  { category: 'Services', amount: 300, color: '#8B5CF6' },
  { category: 'Others', amount: 150, color: '#64748B' },
];
