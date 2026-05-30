import { Screen } from '../types';

const VALID_SCREENS = new Set<Screen>([
  'dashboard',
  'ledger',
  'register',
  'accounts',
  'family',
  'family_structure',
  'providers',
  'dependents',
  'categories',
  'login',
  'register_user',
  'import_ofx',
  'forgot_password',
  'ledger_book',
  'transaction_detail',
  'register_category',
  'register_account',
  'ledger_print_preview',
  'maintain_transaction',
  'add_family_member',
  'notification_settings',
  'general_settings',
  'entities',
  'category_list',
  'category_form',
  'account_list',
  'account_form',
  'import_invoice',
  'income_list',
  'expense_list',
  'register_income',
  'register_expense',
]);

export function pathToScreen(pathname: string): Screen {
  const path = pathname.replace(/\/$/, '') || '/';

  if (path === '/' || path === '/dashboard') {
    return 'dashboard';
  }

  const slug = path.startsWith('/') ? path.slice(1) : path;
  const screen = slug.replace(/-/g, '_') as Screen;

  if (VALID_SCREENS.has(screen)) {
    return screen;
  }

  return 'dashboard';
}

export function screenToPath(screen: Screen): string {
  if (screen === 'dashboard') {
    return '/dashboard';
  }
  return `/${screen.replace(/_/g, '-')}`;
}
