import React, { useState } from 'react';
import { PlusCircle, TrendingUp, TrendingDown } from 'lucide-react';
import '../styles/glass.css';

const CATEGORIES = {
     expense: ['食費', '交通費', '日用品', '趣味', '住居', '交際費', 'その他'],
     income: ['バイト代', '', '生活費支給', 'その他']
};

export default function TransactionForm({ onAdd }) {
     const [type, setType] = useState('expense');
     const [amount, setAmount] = useState('');
     const [category, setCategory] = useState(CATEGORIES.expense[0]);
     const [comment, setComment] = useState('');

     const handleSubmit = (e) => {
          e.preventDefault();
          if (!amount) return;
          onAdd({ type, amount, category, comment });
          setAmount('');
          setComment('');
     };

     const handleTypeChange = (newType) => {
          setType(newType);
          // Safety check if category array has empty strings or valid items
          const firstValid = CATEGORIES[newType].find(c => c !== '') || '';
          setCategory(firstValid);
     };

     return (
          <form
               onSubmit={handleSubmit}
               className="glass-panel"
          >
               <div className="flex-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
                    <button
                         type="button"
                         onClick={() => handleTypeChange('expense')}
                         style={{
                              borderColor: type === 'expense' ? 'var(--danger)' : 'transparent',
                              flex: 1,
                              color: type === 'expense' ? 'var(--danger)' : 'var(--text-secondary)'
                         }}
                    >
                         <TrendingDown size={16} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
                         支出
                    </button>
                    <button
                         type="button"
                         onClick={() => handleTypeChange('income')}
                         style={{
                              borderColor: type === 'income' ? 'var(--success)' : 'transparent',
                              flex: 1,
                              color: type === 'income' ? 'var(--success)' : 'var(--text-secondary)'
                         }}
                    >
                         <TrendingUp size={16} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
                         収入
                    </button>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <select
                         value={category}
                         onChange={(e) => setCategory(e.target.value)}
                    >
                         {CATEGORIES[type].filter(c => c !== '').map(c => (
                              <option key={c} value={c}>{c}</option>
                         ))}
                    </select>

                    <div style={{ position: 'relative' }}>
                         <input
                              type="text"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="メモ (任意)"
                              style={{
                                   padding: '0.8rem 1rem',
                                   fontSize: '0.9rem',
                                   width: '100%',
                                   boxSizing: 'border-box'
                              }}
                         />
                    </div>

                    <div style={{ position: 'relative' }}>
                         <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>¥</span>
                         <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0"
                              style={{ paddingLeft: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}
                              inputMode="numeric"
                         />
                    </div>

                    <button
                         type="submit"
                         style={{
                              backgroundColor: type === 'income' ? 'var(--success)' : 'var(--danger)',
                              color: 'white',
                              width: '100%',
                              marginTop: '0.5rem'
                         }}
                    >
                         <PlusCircle size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
                         追加
                    </button>
               </div>
          </form>
     );
}
