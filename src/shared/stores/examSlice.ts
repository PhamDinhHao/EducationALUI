import { StateCreator } from 'zustand';
import { Question } from '@/shared/core/types/common.type';

export interface IExamSlice {
  exam: Question[];
  setExam: (questions: Question[]) => void;
  clearExam: () => void;
}

const EXAM_STORAGE_KEY = 'exam_data';

const getStoredExam = (): Question[] => {
  try {
    const data = localStorage.getItem(EXAM_STORAGE_KEY);
    if (!data) return [];

    const cleaned = data.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Lỗi khi đọc exam từ localStorage:', error);
    return [];
  }
};

export const createExamSlice: StateCreator<IExamSlice, [], [], IExamSlice> = (set) => ({
  exam: getStoredExam(),

  setExam: (questions) => {
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(questions));
    set(() => ({ exam: questions }));
  },

  clearExam: () => {
    localStorage.removeItem(EXAM_STORAGE_KEY);
    set(() => ({ exam: [] }));
  },
});
