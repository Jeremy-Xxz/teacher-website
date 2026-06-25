'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../utils/supabase';

export interface Course {
  id: string;
  title: string;
  courseName: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  isPinned: boolean;
}

export function useBlog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ☁️ 從雲端資料庫撈取所有講義與分類
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. 撈取文章
      const { data: coursesData, error: cError } = await supabase
        .from('courses')
        .select('*');
      
      if (cError) throw cError;

      // 轉化資料庫欄位名稱符合前端變數
      const cleanedCourses: Course[] = (coursesData || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        courseName: item.course_name,
        content: item.content || '',
        mediaUrl: item.media_url || undefined,
        createdAt: item.created_at,
        isPinned: item.is_pinned,
      }));

      // 2. 撈取自訂分類目錄
      const { data: catsData, error: catError } = await supabase
        .from('categories')
        .select('name');
      
      if (catError) throw catError;

      setCourses(cleanedCourses);
      setCategories((catsData || []).map((c: any) => c.name));
    } catch (error) {
      console.error('Supabase 讀取失敗:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ☁️ 雲端同步：新增文章（支援 PDF 講義上傳）
  const addCourse = useCallback(async (newCourse: Course, file?: File) => {
    try {
      let finalMediaUrl = newCourse.mediaUrl || null;

      // 1. 如果有選取檔案，先上傳到 Supabase Storage
      if (file) {
        // 用時間戳加上原本的檔名，避免重複檔名衝突
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // 上傳檔案到 'lectures' 儲存桶
        const { error: uploadError, data } = await supabase.storage
          .from('lectures')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 取得上傳成功後的公開下載網址
        const { data: { publicUrl } } = supabase.storage
          .from('lectures')
          .getPublicUrl(filePath);

        finalMediaUrl = publicUrl;
      }

      // 2. 將文章資料（包含剛剛取得的 PDF 網址）寫入資料庫
      const { error } = await supabase.from('courses').insert([{
        id: newCourse.id,
        title: newCourse.title,
        course_name: newCourse.courseName,
        content: newCourse.content,
        media_url: finalMediaUrl, // 👈 這裡會自動填入 PDF 網址
        created_at: newCourse.createdAt,
        is_pinned: newCourse.isPinned
      }]);

      if (error) throw error;
      await refreshData();
      alert('講義發布成功！');
    } catch (error: any) {
      console.error('發布失敗詳情:', error);
      alert(`發布失敗：${error.message || '請檢查網路或設定'}`);
    }
  }, [refreshData]);

  // ☁️ 雲端同步：刪除文章
  const deleteCourse = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      alert('刪除失敗');
    }
  }, [refreshData]);

  // ☁️ 雲端同步：切換置頂
  const togglePin = useCallback(async (id: string) => {
    const target = courses.find(c => c.id === id);
    if (!target) return;
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_pinned: !target.isPinned })
        .eq('id', id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      alert('置頂修改失敗');
    }
  }, [courses, refreshData]);

  // ☁️ 雲端同步：新增分類目錄
  const addCategory = useCallback(async (name: string) => {
    if (!name.trim() || categories.includes(name.trim())) return;
    try {
      const { error } = await supabase.from('categories').insert([{ name: name.trim() }]);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      alert('新增分類失敗');
    }
  }, [categories, refreshData]);

  // ☁️ 雲端同步：刪除分類目錄
  const deleteCategory = useCallback(async (name: string) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('name', name);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      alert('刪除分類失敗，可能該分類下還有文章綁定');
    }
  }, [refreshData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const uniqueCourseNames = useMemo(() => {
    return ['全部文章', ...categories];
  }, [categories]);

  return {
    courses,
    uniqueCourseNames,
    categories,
    loading,
    refreshData,
    addCourse,
    deleteCourse,
    togglePin,
    addCategory,
    deleteCategory
  };
}