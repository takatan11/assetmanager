import React from 'react';
import '../styles/glass.css';

export default function BalanceCards({ balance, income, expense }) {
     return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
               <div
                    className="glass-panel"
                    style={{ gridColumn: '1 / -1', textAlign: 'center' }}
               >
                    <span className="label">総資産残高</span>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem' }}>
                         ¥ {balance.toLocaleString()}
                    </div>
               </div>

               <div
                    className="glass-panel glass-stat"
               >
                    <span className="label">収入</span>
                    <span className="value income">+¥{income.toLocaleString()}</span>
               </div>

               <div
                    className="glass-panel glass-stat"
               >
                    <span className="label">支出</span>
                    <span className="value expense">-¥{expense.toLocaleString()}</span>
               </div>
          </div>
     );
}
