import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, Topbar } from './components/Navigation';
import { cn } from './lib/utils';
import { Dashboard } from './components/Dashboard';
import { Ledger } from './components/Ledger';
import { RegisterEntry } from './components/RegisterEntry';
import { Accounts } from './components/Accounts';
import { FamilyHub } from './components/FamilyHub';
import { FamilyStructure } from './components/FamilyStructure';
import { Providers } from './components/Providers';
import { Dependents } from './components/Dependents';
import { Categories } from './components/Categories';
import { ImportOFX } from './components/ImportOFX';
import { LedgerBook } from './components/LedgerBook';
import { TransactionDetail } from './components/TransactionDetail';
import { RegisterCategory } from './components/RegisterCategory';
import { RegisterAccount } from './components/RegisterAccount';
import { LedgerPrintPreview } from './components/LedgerPrintPreview';
import { MaintainTransaction } from './components/MaintainTransaction';
import { AddFamilyMember } from './components/AddFamilyMember';
import { NotificationSettings } from './components/NotificationSettings';
import { GeneralSettings } from './components/GeneralSettings';
import { PeopleEntities } from './components/PeopleEntities';
import { CategoryList } from './components/CategoryList';
import { AccountList } from './components/AccountList';
import { ImportInvoice } from './components/ImportInvoice';
import { IncomeList } from './components/IncomeList';
import { ExpenseList } from './components/ExpenseList';
import { RegisterUser } from './components/RegisterUser';
import { Login } from './components/Login';
import { ForgotPassword } from './components/ForgotPassword';
import { Screen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'ledger':
        return <Ledger />;
      case 'register':
        return <RegisterEntry />;
      case 'accounts':
        return <Accounts onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'family':
        return <FamilyHub onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'family_structure':
        return <FamilyStructure onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'providers':
        return <Providers onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'dependents':
        return <Dependents />;
      case 'categories':
        return <Categories onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'register_category':
        return <RegisterCategory onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'register_account':
        return <RegisterAccount onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'ledger_print_preview':
        return <LedgerPrintPreview onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'maintain_transaction':
        return <MaintainTransaction onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'add_family_member':
        return <AddFamilyMember onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'notification_settings':
        return <NotificationSettings onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'general_settings':
        return <GeneralSettings onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'entities':
        return <PeopleEntities onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'category_list':
        return <CategoryList onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'category_form':
        return <RegisterCategory onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'account_list':
        return <AccountList onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'account_form':
        return <RegisterAccount onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'import_invoice':
        return <ImportInvoice onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'income_list':
        return <IncomeList onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'expense_list':
        return <ExpenseList onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'ledger_book':
        return <LedgerBook onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'transaction_detail':
        return <TransactionDetail onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'import_ofx':
        return <ImportOFX />;
      case 'register_user':
        return <RegisterUser onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'login':
        return <Login onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      case 'forgot_password':
        return <ForgotPassword onNavigate={(s: Screen) => setCurrentScreen(s)} />;
      default:
        return <Dashboard />;
    }
  };

  const isAuthScreen = currentScreen === 'login' || currentScreen === 'register_user' || currentScreen === 'forgot_password';

  return (
    <div className="flex h-screen w-full bg-harmony-gray overflow-hidden">
      {/* Sidebar - Fixed */}
      {!isAuthScreen && <Sidebar currentScreen={currentScreen} onScreenChange={setCurrentScreen} />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {!isAuthScreen && <Topbar currentScreen={currentScreen} onScreenChange={setCurrentScreen} />}
        
        <main className={cn("flex-1 overflow-y-auto custom-scrollbar", !isAuthScreen ? "p-8" : "p-4 flex items-center justify-center")}>
          <div className={cn("w-full mx-auto", !isAuthScreen ? "max-w-6xl" : "max-w-4xl")}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        
        {/* Subtle Decorative Elements */}
        <div className="absolute bottom-0 right-0 p-8 pointer-events-none opacity-[0.03] select-none uppercase font-display font-black text-9xl tracking-tighter leading-none">
          Harmony
        </div>
      </div>
    </div>
  );
}
