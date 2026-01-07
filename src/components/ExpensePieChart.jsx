import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import '../styles/glass.css';

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#8884d8', '#82ca9d', '#ffc658'];

export default function ExpensePieChart({ transactions }) {
     const data = useMemo(() => {
          const expenses = transactions.filter(t => t.type === 'expense');
          const categoryTotals = expenses.reduce((acc, t) => {
               acc[t.category] = (acc[t.category] || 0) + t.amount;
               return acc;
          }, {});

          return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
     }, [transactions]);

     if (data.length === 0) {
          return (
               <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                    <p className="label">支出データがありません</p>
               </div>
          );
     }

     return (
          <div className="glass-panel" style={{ height: 350 }}>
               <h3 className="label" style={{ marginBottom: '1rem', textAlign: 'center' }}>カテゴリ別支出</h3>
               <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                         <Pie
                              data={data}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                         >
                              {data.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                         </Pie>
                         <Tooltip
                              formatter={(value) => `¥${value.toLocaleString()}`}
                              contentStyle={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', borderRadius: '12px' }}
                              itemStyle={{ color: 'var(--text-color)' }}
                         />
                         <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
               </ResponsiveContainer>
          </div>
     );
}
