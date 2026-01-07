import React from 'react';
import { Trash2 } from 'lucide-react';
import '../styles/glass.css';

export default function TransactionList({ transactions, onDelete }) {
     if (transactions.length === 0) {
          return <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem' }}>履歴なし</div>;
     }

     return (
          <div className="glass-panel" style={{ marginTop: '1rem' }}>
               <h3 className="label" style={{ marginBottom: '1rem' }}>最近の履歴</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {transactions.map((t) => (
                         <div
                              key={t.id}
                              style={{
                                   display: 'flex',
                                   justifyContent: 'space-between',
                                   alignItems: 'center',
                                   padding: '0.5rem 0',
                                   borderBottom: '1px solid var(--glass-border)'
                              }}
                         >
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                   <span style={{ fontWeight: '500' }}>{t.category}</span>
                                   <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {new Date(t.date).toLocaleDateString()}
                                        {t.comment && <span style={{ marginLeft: '8px', color: 'var(--text-color)' }}>{t.comment}</span>}
                                   </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                   <span style={{
                                        fontWeight: 'bold',
                                        color: t.type === 'income' ? 'var(--success)' : 'var(--text-color)'
                                   }}>
                                        {t.type === 'expense' ? '-' : '+'}¥{t.amount.toLocaleString()}
                                   </span>
                                   <button
                                        onClick={() => onDelete(t.id)}
                                        style={{
                                             padding: '8px',
                                             marginRight: '-8px', // Compensate for padding to align with edge
                                             borderRadius: '50%',
                                             border: 'none',
                                             background: 'transparent',
                                             color: 'var(--text-secondary)',
                                             cursor: 'pointer',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             minWidth: '44px', // Touch target size
                                             minHeight: '44px'
                                        }}
                                        aria-label="削除"
                                   >
                                        <Trash2 size={20} />
                                   </button>
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     );
}
