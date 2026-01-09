import React, { useState } from 'react';
import { useTransactions } from './hooks/useTransactions';
import TransactionForm from './components/TransactionForm';
import BalanceCards from './components/BalanceCards';
import ExpensePieChart from './components/ExpensePieChart';
import BalanceBarChart from './components/BalanceBarChart';
import TransactionList from './components/TransactionList';
import BottomNav from './components/BottomNav';
import MonthlyArchive from './components/MonthlyArchive';
import DataMigration from './components/DataMigration';
import { ChevronLeft, Settings, X } from 'lucide-react';
import './styles/index.css';

function App() {
     const [view, setView] = useState('input');
     const [selectedMonth, setSelectedMonth] = useState(null); // Format: "YYYY-MM"
     const [isSettingsOpen, setIsSettingsOpen] = useState(false);

     const {
          transactions,
          addTransaction,
          deleteTransaction,
          monthlyList,
          getTransactionsByMonth,
          importTransactions
     } = useTransactions();

     // Logic:
     // Input View -> Always shows Current Month's data (effectively "reset" every month)
     // Stats View -> Shows Selected Month (defaults to Current)

     const currentMonthKey = new Date().toISOString().slice(0, 7);

     // Data for Input View (Current Month)
     const currentMonthTransactions = getTransactionsByMonth(currentMonthKey);

     // Data for Stats View (Selected or Current)
     const targetMonth = selectedMonth || currentMonthKey;
     const statsTransactions = getTransactionsByMonth(targetMonth);

     const totalIncome = statsTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
     const totalExpense = statsTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
     const balance = totalIncome - totalExpense;

     const handleMonthSelect = (month) => {
          setSelectedMonth(month);
          window.scrollTo({ top: 0, behavior: 'smooth' });
     };

     const handleBackToCurrent = () => {
          setSelectedMonth(null);
     };

     const headerTitle = view === 'input'
          ? 'データ入力'
          : (selectedMonth ? `${selectedMonth.replace('-', '年')}月` : '資産レポート');

     return (
          <div className="app-container">
               <header style={{
                    padding: '1rem',
                    background: '#fff',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
               }}>
                    {selectedMonth && view === 'stats' && (
                         <button
                              onClick={handleBackToCurrent}
                              style={{
                                   border: 'none',
                                   background: 'transparent',
                                   padding: 0,
                                   boxShadow: 'none',
                                   cursor: 'pointer',
                                   color: 'var(--text-color)',
                                   display: 'flex',
                                   alignItems: 'center'
                              }}
                         >
                              <ChevronLeft size={28} />
                         </button>
                    )}
                    <h1 style={{ fontSize: '1.25rem', margin: 0, textAlign: 'left', flex: 1 }}>
                         {headerTitle}
                    </h1>
                    <button
                         onClick={() => setIsSettingsOpen(true)}
                         style={{
                              border: 'none',
                              background: 'transparent',
                              padding: '0.5rem',
                              boxShadow: 'none',
                              cursor: 'pointer',
                              color: 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center'
                         }}
                    >
                         <Settings size={24} />
                    </button>
               </header>

               <div style={{ padding: '0 1rem' }}>
                    {view === 'input' ? (
                         <>
                              <TransactionForm onAdd={addTransaction} />
                              <TransactionList transactions={currentMonthTransactions} onDelete={deleteTransaction} />
                         </>
                    ) : (
                         <>
                              {/* Show Charts for targetMonth */}
                              <BalanceCards
                                   balance={balance}
                                   income={totalIncome}
                                   expense={totalExpense}
                              />
                              <BalanceBarChart transactions={statsTransactions} />
                              <ExpensePieChart transactions={statsTransactions} />

                              {/* Show Transaction List for detailed review/deletion in stats view */}
                              <div style={{ marginTop: '2rem' }}>
                                   <h3 className="label" style={{ marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                                        {targetMonth.replace('-', '年')}月の明細
                                   </h3>
                                   <TransactionList transactions={statsTransactions} onDelete={deleteTransaction} />
                              </div>

                              {/* Show Archive List only when viewing current month (default view) */}
                              {!selectedMonth && (
                                   <MonthlyArchive
                                        monthlyList={monthlyList}
                                        onSelectMonth={handleMonthSelect}
                                   />
                              )}
                         </>
                    )}
               </div>

               <BottomNav currentView={view} onChange={(v) => { setView(v); setSelectedMonth(null); }} />

               {/* Settings/Migration Modal */}
               {isSettingsOpen && (
                    <div style={{
                         position: 'fixed',
                         top: 0,
                         left: 0,
                         right: 0,
                         bottom: 0,
                         background: 'rgba(0,0,0,0.5)',
                         zIndex: 2000,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         padding: '1.5rem'
                    }}>
                         <div className="glass-card" style={{
                              width: '100%',
                              maxWidth: '400px',
                              background: '#fff', // Solid background for legibility
                              padding: '1.5rem',
                              position: 'relative',
                              maxHeight: '90vh',
                              overflowY: 'auto'
                         }}>
                              <button
                                   onClick={() => setIsSettingsOpen(false)}
                                   style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        boxShadow: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)'
                                   }}
                              >
                                   <X size={24} />
                              </button>
                              <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', textAlign: 'center' }}>データ管理</h2>
                              <DataMigration
                                   transactions={transactions}
                                   onImport={importTransactions}
                                   onClose={() => setIsSettingsOpen(false)}
                              />
                         </div>
                    </div>
               )}
          </div>
     );
}

export default App;
