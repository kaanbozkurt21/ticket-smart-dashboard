export interface FAQ {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: string;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  faqId: string | null;
  score: number;
  matchedKeywords: string[];
  matchDetails: {
    exactMatches: number;
    synonymMatches: number;
    categoryMatch: boolean;
  };
}

export interface RulesConfig {
  minScore: number;
  language: string;
  normalize: boolean;
  stopwords: string[];
  synonymGroups: Record<string, string[]>;
}

export interface DashboardStats {
  todayConversations: number;
  autoAnswerRate: number;
  topKeywords: Array<{ keyword: string; count: number }>;
  medianResponseTime: number;
  topQuestions: Array<{ question: string; count: number }>;
}

export interface WidgetConfig {
  siteKey: string;
  theme: 'light' | 'dark';
  primaryColor: string;
  greeting: string;
  position: 'bottom-right' | 'bottom-left';
  showSuggestions: boolean;
}
