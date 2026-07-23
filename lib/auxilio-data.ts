export type ContentItem = {
  id: string;
  title: string;
  type: 'document' | 'slides' | 'notes';
  lastPracticed: string;
  masteryLevel: number; // 0-100
  improved: boolean;
  topics: string[];
};

export type SessionStats = {
  sessionsCompleted: number;
  averageScore: number;
  weakTopicsIdentified: number;
};

export type Question = {
  id: string;
  text: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export type ScoreMetrics = {
  semantic: number; // 0-100
  depth: number; // 0-100
  similarity: number; // 0-100
};

export type SessionQuestion = {
  id: string;
  question: string;
  topic: string;
  number: number;
  totalQuestions: number;
};

export type SessionAnswer = {
  questionId: string;
  answer: string;
  score: ScoreMetrics;
  isFlagged: boolean;
  followUpTopic?: string;
};

export type Topic = {
  name: string;
  masteryLevel: number; // 0-100
  isWeak: boolean;
  improved: boolean;
};

export const mockContentItems: ContentItem[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    type: 'slides',
    lastPracticed: '2 days ago',
    masteryLevel: 78,
    improved: true,
    topics: ['React', 'Patterns', 'Hooks'],
  },
  {
    id: '2',
    title: 'System Design Notes',
    type: 'notes',
    lastPracticed: '1 week ago',
    masteryLevel: 62,
    improved: false,
    topics: ['System Design', 'Scalability', 'Architecture'],
  },
  {
    id: '3',
    title: 'Database Fundamentals',
    type: 'document',
    lastPracticed: '3 days ago',
    masteryLevel: 85,
    improved: true,
    topics: ['Databases', 'SQL', 'Indexing'],
  },
  {
    id: '4',
    title: 'API Design Best Practices',
    type: 'slides',
    lastPracticed: '5 days ago',
    masteryLevel: 71,
    improved: false,
    topics: ['API', 'REST', 'Design'],
  },
];

export const mockSessionStats: SessionStats = {
  sessionsCompleted: 24,
  averageScore: 76,
  weakTopicsIdentified: 3,
};

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Explain the concept of React hooks and how they differ from class lifecycle methods.',
    topic: 'React',
    difficulty: 'medium',
  },
  {
    id: 'q2',
    text: 'How would you design a real-time notification system for a large-scale application?',
    topic: 'System Design',
    difficulty: 'hard',
  },
  {
    id: 'q3',
    text: 'What is database normalization and why is it important?',
    topic: 'Databases',
    difficulty: 'medium',
  },
  {
    id: 'q4',
    text: 'Describe the differences between REST and GraphQL APIs.',
    topic: 'API',
    difficulty: 'medium',
  },
];

export const mockSessionQuestions: SessionQuestion[] = [
  {
    id: 'sq1',
    question: 'Explain what semantic versioning is and why it matters in software development.',
    topic: 'Versioning',
    number: 1,
    totalQuestions: 5,
  },
  {
    id: 'sq2',
    question: 'How would you handle concurrent requests in a Node.js application?',
    topic: 'Backend',
    number: 2,
    totalQuestions: 5,
  },
];

export const mockSessionAnswers: SessionAnswer[] = [
  {
    questionId: 'sq1',
    answer: 'Semantic versioning is a versioning scheme that uses MAJOR.MINOR.PATCH format...',
    score: { semantic: 85, depth: 78, similarity: 82 },
    isFlagged: false,
  },
  {
    questionId: 'sq2',
    answer: 'Node.js is single-threaded but uses event loop to handle concurrent requests through callbacks and promises...',
    score: { semantic: 72, depth: 68, similarity: 71 },
    isFlagged: true,
    followUpTopic: 'Async/Await',
  },
];

export const mockTopics: Topic[] = [
  { name: 'React', masteryLevel: 82, isWeak: false, improved: true },
  { name: 'Databases', masteryLevel: 88, isWeak: false, improved: true },
  { name: 'System Design', masteryLevel: 61, isWeak: true, improved: false },
  { name: 'API Design', masteryLevel: 75, isWeak: false, improved: false },
  { name: 'Backend', masteryLevel: 58, isWeak: true, improved: false },
];

export const mockAdminAnalytics = {
  activeUsers: 1247,
  sessionsToday: 384,
  avgScoreByTopic: [
    { topic: 'React', score: 78 },
    { topic: 'System Design', score: 65 },
    { topic: 'Databases', score: 82 },
    { topic: 'APIs', score: 71 },
  ],
  pendingQuestions: 12,
};

export const mockPendingQuestions = [
  {
    id: 'pq1',
    text: 'Explain SOLID principles and give examples for each.',
    topic: 'Software Design',
    generatedBy: 'AI-v2.1',
    status: 'pending',
  },
  {
    id: 'pq2',
    text: 'How would you optimize a slow database query?',
    topic: 'Databases',
    generatedBy: 'AI-v2.1',
    status: 'pending',
  },
];
