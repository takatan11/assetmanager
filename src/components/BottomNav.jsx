import React from 'react';
import { PlusCircle, BarChart3 } from 'lucide-react';

export default function BottomNav({ currentView, onChange }) {
     return (
          <div style={{
               position: 'fixed',
               bottom: 0,
               left: 0,
               right: 0,
               background: '#ffffff',
               borderTop: '1px solid var(--border-color)',
               display: 'flex',
               justifyContent: 'space-around',
               padding: '0.8rem 0',
               zIndex: 1000,
               boxShadow: '0 -1px 2px rgba(60,64,67,0.1)'
          }}>
               <button
                    onClick={() => onChange('input')}
                    style={{
                         background: 'transparent',
                         border: 'none',
                         boxShadow: 'none',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         gap: '4px',
                         color: currentView === 'input' ? 'var(--primary)' : 'var(--text-secondary)',
                         padding: '0 1rem'
                    }}
               >
                    <PlusCircle size={24} />
                    <span style={{ fontSize: '0.75rem' }}>入力</span>
               </button>

               <button
                    onClick={() => onChange('stats')}
                    style={{
                         background: 'transparent',
                         border: 'none',
                         boxShadow: 'none',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         gap: '4px',
                         color: currentView === 'stats' ? 'var(--primary)' : 'var(--text-secondary)',
                         padding: '0 1rem'
                    }}
               >
                    <BarChart3 size={24} />
                    <span style={{ fontSize: '0.75rem' }}>分析</span>
               </button>
          </div>
     );
}
