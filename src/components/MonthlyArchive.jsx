import React from 'react';
import { ChevronRight } from 'lucide-react';
import '../styles/glass.css';

export default function MonthlyArchive({ monthlyList, onSelectMonth }) {
     if (monthlyList.length === 0) return null;

     return (
          <div style={{ marginTop: '2rem' }}>
               <h3 className="label" style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>月別アーカイブ</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {monthlyList.map((stat) => (
                         <button
                              key={stat.month}
                              onClick={() => onSelectMonth(stat.month)}
                              className="glass-panel"
                              style={{
                                   padding: '1rem',
                                   display: 'flex',
                                   justifyContent: 'space-between',
                                   alignItems: 'center',
                                   width: '100%',
                                   textAlign: 'left',
                                   borderRadius: '12px',
                                   border: '1px solid var(--border-color)',
                                   background: 'var(--card-bg)'
                              }}
                         >
                              <div>
                                   <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-color)' }}>
                                        {stat.month.replace('-', '年')}月
                                   </div>
                                   <div style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                                        収: ¥{stat.income.toLocaleString()} / 支: ¥{stat.expense.toLocaleString()}
                                   </div>
                              </div>
                              <ChevronRight size={20} color="var(--text-secondary)" />
                         </button>
                    ))}
               </div>
          </div>
     );
}
