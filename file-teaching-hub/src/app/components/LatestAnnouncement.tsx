'use client';

export default function LatestAnnouncement({ article }: { article: any }) {
  if (!article) return null;

  const handleScroll = () => {
    // 確保這裡的 ID 格式與你的 CourseList 中定義的 ID 一模一樣
    const targetId = `course-card-${article.id}`;
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // 🎯 這裡的提示很關鍵，如果你看到這句，代表文章被過濾隱藏了
      alert("該文章目前未顯示在列表中，請先清除搜尋或篩選條件。");
      console.error(`找不到 ID 為 ${targetId} 的元素，請檢查 CourseList 是否正確渲染了該 ID`);
    }
  };

  return (
    <div className="bg-[#121624] text-white rounded-3xl p-6 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">最新重要公告</span>
        </div>
        <h2 className="text-base font-black tracking-tight">{article.title}</h2>
      </div>
      <button 
        onClick={handleScroll}
        className="bg-white text-slate-900 px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition active:scale-[0.97] cursor-pointer shadow-xs"
      >
        閱讀全文 →
      </button>
    </div>
  );
}