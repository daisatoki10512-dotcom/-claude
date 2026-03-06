import { create } from 'zustand';

export type CompletedRecord = {
  id: string;
  date: Date;
  moodLabel: string;
  moodType: 'positive' | 'neutral' | 'negative';
  eventText: string;
  detail: string[];
  emotionChips: string[];
  eventChips: string[];
  tags: string[];
  bookmarkCount: number;
};

type CompletedRecordsState = {
  records: CompletedRecord[];
  addRecord: (record: Omit<CompletedRecord, 'id' | 'date' | 'bookmarkCount'>) => void;
  clearToday: () => void;
};

export const useCompletedRecordsStore = create<CompletedRecordsState>((set) => ({
  records: [],

  addRecord: (record) =>
    set((state) => ({
      records: [
        {
          ...record,
          id: Date.now().toString(),
          date: new Date(),
          bookmarkCount: 0,
        },
        ...state.records,
      ],
    })),

  clearToday: () =>
    set((state) => {
      const today = new Date();
      return {
        records: state.records.filter(
          (r) =>
            r.date.getFullYear() !== today.getFullYear() ||
            r.date.getMonth() !== today.getMonth() ||
            r.date.getDate() !== today.getDate()
        ),
      };
    }),
}));
