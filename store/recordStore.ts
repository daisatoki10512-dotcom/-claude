import { create } from 'zustand';

// ── AI Analysis Result ─────────────────────────────────────────
export type AIInsight = {
  title: string;
  body: string;
};

export type AIAnalysisResult = {
  moodLabel: string;         // e.g. "悪い気分"
  moodType: 'positive' | 'neutral' | 'negative';
  detail: string[];          // 2-3 paragraphs for 詳細 section
  emotionChips: string[];    // emotion labels
  eventChips: string[];      // event category labels
  insights: AIInsight[];     // 3 insight cards for だいさんへメッセージ
};

// ── Record Input Data ──────────────────────────────────────────
type RecordState = {
  // Input from each step
  emotions: string[];
  reasons: string[];
  eventText: string;
  thoughtText: string;
  desireText: string;
  tags: string[];

  // AI analysis result
  aiResult: AIAnalysisResult | null;
  analysisError: string | null;

  // Actions
  setEmotions: (emotions: string[]) => void;
  setReasons: (reasons: string[]) => void;
  setEvent: (text: string) => void;
  setThought: (text: string) => void;
  setDesire: (text: string) => void;
  setTags: (tags: string[]) => void;
  setAIResult: (result: AIAnalysisResult) => void;
  setAnalysisError: (error: string | null) => void;
  reset: () => void;
};

const initialState = {
  emotions: [],
  reasons: [],
  eventText: '',
  thoughtText: '',
  desireText: '',
  tags: [],
  aiResult: null,
  analysisError: null,
};

export const useRecordStore = create<RecordState>((set) => ({
  ...initialState,

  setEmotions: (emotions) => set({ emotions }),
  setReasons: (reasons) => set({ reasons }),
  setEvent: (text) => set({ eventText: text }),
  setThought: (text) => set({ thoughtText: text }),
  setDesire: (text) => set({ desireText: text }),
  setTags: (tags) => set({ tags }),
  setAIResult: (result) => set({ aiResult: result, analysisError: null }),
  setAnalysisError: (error) => set({ analysisError: error }),
  reset: () => set(initialState),
}));
