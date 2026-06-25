'use client';

import { useState } from 'react';

interface TeacherConsoleProps {
  onUploadSuccess: () => void;
}

export default function TeacherConsole({ onUploadSuccess }: TeacherConsoleProps) {
  const [isOpen, setIsOpen] = useState(false); // 控制彈窗開關
  const [inputKey, setInputKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    linkLabel: '',
    linkUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVerifyKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey === 'teacher777') {
      setIsUnlocked(true);
    } else {
      alert('❌ 密鑰錯誤，請重新輸入！');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseName || !formData.title || !formData.description) {
      return alert('請務必填寫：課程分類、章節標題、說明文稿！');
    }

    const payload = {
      secretKey: inputKey,
      courseName: formData.courseName,
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl || undefined,
      videoUrl: formData.videoUrl || undefined,
      links: formData.linkLabel && formData.linkUrl ? [{ label: formData.linkLabel, url: formData.linkUrl }] : []
    };

    try {
      const response = await fetch('/api/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('🎉 課程內容已成功發布！');
        setFormData({ courseName: '', title: '', description: '', imageUrl: '', videoUrl: '', linkLabel: '', linkUrl: '' });
        setIsOpen(false); // 關閉視窗
        onUploadSuccess();
      } else {
        const errorData = await response.json();
        alert(`上傳失敗：${errorData.message}`);
      }
    } catch (error) {
      console.error("網路錯誤:", error);
    }
  };

  return (
    <>
      {/* 1. 🎈 右下角極簡懸浮按鈕 */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-xl hover:bg-indigo-600 font-bold text-xs flex items-center space-x-1.5 transition duration-200 z-40 border border-slate-700"
      >
        <span>⚙️</span>
        <span>管理後台</span>
      </button>

      {/* 2. 🪟 遮罩彈窗（當開啟時才渲染） */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white p-5 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150">
            
            {/* 關閉按鈕 */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>

            {!isUnlocked ? (
              /* 密鑰驗證 */
              <div className="space-y-4 py-2">
                <div className="flex items-center space-x-2 border-b pb-2">
                  <span className="text-base">🔒</span>
                  <h2 className="text-base font-bold text-slate-700">吉米師權限驗證</h2>
                </div>
                <form onSubmit={handleVerifyKey} className="flex flex-col space-y-3">
                  <input 
                    type="password" 
                    value={inputKey} 
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="輸入管理密鑰 (teacher777)" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center text-xs outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                  <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-xl font-bold text-xs hover:bg-slate-900 transition">
                    解鎖後台
                  </button>
                </form>
              </div>
            ) : (
              /* 課程上傳表單 */
              <div className="space-y-3">
                <div className="border-b pb-2 flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-black text-slate-700">🧪 吉米師課程發布台</h2>
                    <p className="text-emerald-500 text-[10px] font-bold mt-0.5">● 已授權管理</p>
                  </div>
                  <button 
                    onClick={() => { setIsUnlocked(false); setInputKey(''); }} 
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded"
                  >
                    重新上鎖
                  </button>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-500">1. 課程選單分類 *</label>
                    <input type="text" name="courseName" value={formData.courseName} onChange={handleInputChange} className="mt-1 block w-full p-2 bg-slate-50 border rounded-md outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500" placeholder="如：基礎化學、選修化學" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500">2. 章節標題 *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full p-2 bg-slate-50 border rounded-md outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500" placeholder="如：1-1 原子結構" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500">3. 講義內文 *</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full p-2 bg-slate-50 border rounded-md outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500" placeholder="講義內文描述..." />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500">4. 圖片連結 (選填)</label>
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="mt-1 block w-full p-2 bg-slate-50 border rounded-md outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500">5. 影片嵌入網址 (選填)</label>
                    <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} className="mt-1 block w-full p-2 bg-slate-50 border rounded-md outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500" placeholder="YouTube embed 網址" />
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 space-y-1.5">
                    <span className="block font-bold text-slate-400">6. 延伸連結 (選填)</span>
                    <input type="text" name="linkLabel" value={formData.linkLabel} onChange={handleInputChange} className="block w-full p-1 border rounded bg-white" placeholder="名稱" />
                    <input type="text" name="linkUrl" value={formData.linkUrl} onChange={handleInputChange} className="block w-full p-1 border rounded bg-white" placeholder="網址" />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 shadow-sm transition">
                    發布課程
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}