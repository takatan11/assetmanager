import { useState, useEffect } from 'react';

const STORAGE_KEY = 'asset_mgr_transactions';

export function useTransactions() {
     const [transactions, setTransactions] = useState(() => {
          const saved = localStorage.getItem(STORAGE_KEY);
          return saved ? JSON.parse(saved) : [];
     });

     useEffect(() => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
     }, [transactions]);

     const addTransaction = ({ type, amount, category, comment }) => {
          const newTx = {
               id: crypto.randomUUID(),
               date: new Date().toISOString(),
               type, // 'income' or 'expense'
               amount: parseFloat(amount),
               category,
               comment: comment || ''
          };
          setTransactions(prev => [newTx, ...prev]);
     };

     const deleteTransaction = (id) => {
          setTransactions(prev => prev.filter(t => t.id !== id));
     };

     // Determine unique months from transactions for the archive list
     const monthlyStats = transactions.reduce((acc, t) => {
          const monthKey = t.date.slice(0, 7); // "YYYY-MM"
          if (!acc[monthKey]) {
               acc[monthKey] = { month: monthKey, income: 0, expense: 0 };
          }
          if (t.type === 'income') acc[monthKey].income += t.amount;
          else acc[monthKey].expense += t.amount;
          return acc;
     }, {});

     const monthlyList = Object.values(monthlyStats).sort((a, b) => b.month.localeCompare(a.month));

     const stats = transactions.reduce((acc, t) => {
          if (t.type === 'income') {
               acc.income += t.amount;
          } else {
               acc.expense += t.amount;
          }
          return acc;
     }, { income: 0, expense: 0 });

     // Import functionality
     const importTransactions = (newTransactions) => {
          if (!Array.isArray(newTransactions)) {
               throw new Error('Invalid data format');
          }
          // Basic validation
          const valid = newTransactions.every(t => t.id && t.date && t.amount !== undefined && t.type);
          if (!valid) {
               throw new Error('Invalid transaction data');
          }
          setTransactions(newTransactions);
     };

     return {
          transactions, // Return raw for global usage if needed
          addTransaction,
          deleteTransaction,
          importTransactions, // Export this
          monthlyList,
          // Helper to get specific month data
          getTransactionsByMonth: (monthStr) => {
               // monthStr format: "YYYY-MM"
               return transactions.filter(t => t.date.startsWith(monthStr));
          },
          // Global stats (kept for legacy or total view if needed)
          totalIncome: stats.income,
          totalExpense: stats.expense,
          balance: stats.income - stats.expense
     };
}
