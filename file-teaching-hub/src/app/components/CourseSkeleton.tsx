'use client';

export default function CategorySelector({ uniqueCourseNames, selected, onSelect }: any) {
  // 🎯 核心修復：使用 ?? [] 確保當資料還沒回來時，預設給一個空陣列，防止 .map() 崩潰
  const categories = ['全部文章', ...(uniqueCourseNames ?? [])];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">週期表章節</h3>
      <div className="flex flex-col gap-2">
        {categories.map((name) => (
          <button 
            key={name} 
            onClick={() => onSelect(name)} 
            className={`px-4 py-2 rounded-xl text-xs font-bold text-left transition ${
              selected === name 
                ? 'bg-sky-500 text-white shadow-sm' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}