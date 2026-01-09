import React, { useState } from 'react';
import { encryptData, decryptData } from '../utils/crypto';
import { Download, Upload, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

export default function DataMigration({ transactions, onImport, onClose }) {
     const [password, setPassword] = useState('');
     const [mode, setMode] = useState('menu'); // 'menu', 'backup', 'restore'
     const [status, setStatus] = useState({ type: '', msg: '' });
     const [isLoading, setIsLoading] = useState(false);

     // Helper to trigger download
     const downloadFile = (content, fileName) => {
          const blob = new Blob([content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
     };

     const handleBackup = async () => {
          if (!password) {
               setStatus({ type: 'error', msg: 'パスワードを入力してください' });
               return;
          }
          setIsLoading(true);
          try {
               const encrypted = await encryptData(transactions, password);
               const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
               downloadFile(encrypted, `asset_backup_${dateStr}.dat`);
               setStatus({ type: 'success', msg: 'バックアップファイルを作成しました' });
               setTimeout(() => onClose(), 2000); // Close after success
          } catch (e) {
               console.error(e);
               setStatus({ type: 'error', msg: '暗号化に失敗しました' });
          } finally {
               setIsLoading(false);
          }
     };

     const handleRestore = async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          if (!password) {
               setStatus({ type: 'error', msg: 'パスワードを入力してください' });
               return;
          }

          setIsLoading(true);
          const reader = new FileReader();
          reader.onload = async (event) => {
               try {
                    const content = event.target.result;
                    const data = await decryptData(content, password);
                    onImport(data);
                    setStatus({ type: 'success', msg: 'データを復元しました' });
                    setTimeout(() => onClose(), 2000);
               } catch (err) {
                    setStatus({ type: 'error', msg: err.message || '復元に失敗しました' });
               } finally {
                    setIsLoading(false);
               }
          };
          reader.readAsText(file);
     };

     const renderMenu = () => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <button
                    onClick={() => setMode('backup')}
                    className="glass-card"
                    style={{
                         padding: '1.5rem',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '1rem',
                         border: 'none',
                         cursor: 'pointer',
                         textAlign: 'left',
                         width: '100%'
                    }}
               >
                    <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '50%' }}>
                         <Download size={24} color="var(--primary)" />
                    </div>
                    <div>
                         <h3 style={{ margin: 0, fontSize: '1rem' }}>データの書き出し</h3>
                         <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              現在のデータを暗号化して保存します
                         </p>
                    </div>
               </button>

               <button
                    onClick={() => setMode('restore')}
                    className="glass-card"
                    style={{
                         padding: '1.5rem',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '1rem',
                         border: 'none',
                         cursor: 'pointer',
                         textAlign: 'left',
                         width: '100%'
                    }}
               >
                    <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '50%' }}>
                         <Upload size={24} color="var(--expense)" />
                    </div>
                    <div>
                         <h3 style={{ margin: 0, fontSize: '1rem' }}>データの読み込み</h3>
                         <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              バックアップファイルから復元します
                         </p>
                    </div>
               </button>

               <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: '1.4' }}>
                    ※ セキュリティのため、データはパスワードで暗号化されます。<br />
                    ※ 復元時には同じパスワードが必要です。
               </p>
          </div>
     );

     const renderPasswordForm = (actionLabel, onSubmit, isFile = false) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    <div style={{
                         background: 'var(--bg-secondary)',
                         width: '60px',
                         height: '60px',
                         borderRadius: '50%',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         margin: '0 auto 1rem'
                    }}>
                         <Lock size={32} color="var(--text-secondary)" />
                    </div>
                    <h3 style={{ margin: 0 }}>パスワード入力</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                         これより先は重要な操作です。<br />データを保護するためのパスワードを入力してください。
                    </p>
               </div>

               <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワード"
                    style={{
                         width: '100%',
                         padding: '1rem',
                         borderRadius: 'var(--radius-md)',
                         border: '1px solid var(--border-color)',
                         fontSize: '1rem',
                         outline: 'none'
                    }}
               />

               {status.msg && (
                    <div style={{
                         display: 'flex',
                         alignItems: 'center',
                         gap: '0.5rem',
                         padding: '0.75rem',
                         borderRadius: 'var(--radius-sm)',
                         background: status.type === 'error' ? '#fee2e2' : '#dcfce7',
                         color: status.type === 'error' ? '#ef4444' : '#22c55e',
                         fontSize: '0.9rem'
                    }}>
                         {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                         {status.msg}
                    </div>
               )}

               <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                         onClick={() => { setMode('menu'); setStatus({ type: '', msg: '' }); setPassword(''); }}
                         style={{
                              flex: 1,
                              padding: '1rem',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-color)',
                              background: 'transparent',
                              cursor: 'pointer'
                         }}
                    >
                         戻る
                    </button>

                    {isFile ? (
                         <label style={{
                              flex: 2,
                              padding: '1rem',
                              borderRadius: 'var(--radius-md)',
                              background: 'var(--primary)',
                              color: '#fff',
                              border: 'none',
                              cursor: isLoading ? 'wait' : 'pointer',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              opacity: !password ? 0.5 : 1,
                              pointerEvents: !password ? 'none' : 'auto'
                         }}>
                              {isLoading ? '処理中...' : actionLabel}
                              <input
                                   type="file"
                                   accept=".dat,.json,.backup"
                                   onChange={onSubmit}
                                   style={{ display: 'none' }}
                                   disabled={isLoading || !password}
                              />
                         </label>
                    ) : (
                         <button
                              onClick={onSubmit}
                              disabled={isLoading || !password}
                              style={{
                                   flex: 2,
                                   padding: '1rem',
                                   borderRadius: 'var(--radius-md)',
                                   background: 'var(--primary)',
                                   color: '#fff',
                                   border: 'none',
                                   cursor: isLoading ? 'wait' : 'pointer',
                                   fontWeight: 'bold',
                                   opacity: !password ? 0.5 : 1
                              }}
                         >
                              {isLoading ? '処理中...' : actionLabel}
                         </button>
                    )}
               </div>
          </div>
     );

     return (
          <div style={{ padding: '0.5rem' }}>
               {mode === 'menu' && renderMenu()}
               {mode === 'backup' && renderPasswordForm('書き出しを実行', handleBackup)}
               {mode === 'restore' && renderPasswordForm('ファイルを選択して復元', handleRestore, true)}
          </div>
     );
}
