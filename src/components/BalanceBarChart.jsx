import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import '../styles/glass.css';

export default function BalanceBarChart({ transactions }) {
     const data = useMemo(() => {
          // Determine if we show daily or monthly. For simplicity, let's show last 7 entries or aggregated daily.
          // Actually, user standard requirement: Income vs Expense.
          // Simple aggregate: Total Income vs Total Expense bar.

          // Better: Daily trend?
          // Let's stick to "Income vs Expense" balance per user request.
          const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
          const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

          return [
               { name: '収入', amount: totalIncome, fill: 'var(--success)' },
               { name: '支出', amount: totalExpense, fill: 'var(--danger)' }
          ];
     }, [transactions]);

     return (
          <div className="glass-panel" style={{ height: 300, marginTop: '1rem' }}>
               <h3 className="label" style={{ marginBottom: '1rem', textAlign: 'center' }}>収支バランス</h3>
               <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                         <XAxis type="number" hide />
                         <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" width={40} />
                         <Tooltip
                              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                              formatter={(value) => `¥${value.toLocaleString()}`}
                              contentStyle={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderRadius: '12px' }}
                         />
                         <Bar dataKey="amount" radius={[0, 10, 10, 0]} barSize={40}>
                              {
                                   data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                   ))
                              }
                         </Bar>
                    </BarChart>
               </ResponsiveContainer>
          </div>
     );
}
// Need to import Cell manually
import { Cell } from 'recharts';
