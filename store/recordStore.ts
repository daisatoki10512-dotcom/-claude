import { create } from 'zustand';

// ── AI Analysis Result ─────────────────────────────────────────
export type AIInsight = {
  title: string;
  body: string;
};

export type AIAnalysisResult = {
  summaryTitle: string;      // 20文字以内の記録内容要約タイトル
  moodLabel: string;         // e.g. "悪い気分"
  moodType: 'positive' | 'neutral' | 'negative';
  detail: string[];          // 2-3 paragraphs for 詳細 section
  emotionChips: string[];    // emotion labels
  eventChips: string[];      // event category labels
  insights: AIInsight[];     // 3 insight cards for だいさんへメッセージ
};

// ── Highlight range ────────────────────────────────────────────
export type MarkerHighlight = { start: number; end: number };

// ── Record Input Data ──────────────────────────────────────────
type RecordState = {
  // Input from each step
  emotions: string[];
  reasons: string[];
  eventText: string;
  thoughtText: string;
  desireText: string;
  tags: string[];
  moodFaceType: 1 | 2 | 3 | 4 | 5;
  markerHighlights: MarkerHighlight[];

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
  setMoodFaceType: (t: 1 | 2 | 3 | 4 | 5) => void;
  setMarkerHighlights: (h: MarkerHighlight[]) => void;
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
  moodFaceType: 3 as 1 | 2 | 3 | 4 | 5,
  markerHighlights: [] as MarkerHighlight[],
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
  setMoodFaceType: (t) => set({ moodFaceType: t }),
  setMarkerHighlights: (h) => set({ markerHighlights: h }),
  setAIResult: (result) => set({ aiResult: result, analysisError: null }),
  setAnalysisError: (error) => set({ analysisError: error }),
  reset: () => set(initialState),
}));
