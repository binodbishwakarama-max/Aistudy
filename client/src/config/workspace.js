import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  LayoutDashboard,
  Settings,
  Sparkles,
  Upload,
} from 'lucide-react';

export const workspaceNavigation = [
  {
    label: 'Overview',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Home and recent activity',
    keywords: ['home', 'overview', 'dashboard', 'recent'],
  },
  {
    label: 'Upload Notes',
    path: '/upload',
    icon: Upload,
    description: 'Import notes and PDFs',
    keywords: ['upload', 'notes', 'pdf', 'source'],
  },
  {
    label: 'Flashcards',
    path: '/flashcards',
    icon: BookOpen,
    description: 'Active recall practice',
    keywords: ['flashcards', 'cards', 'review'],
  },
  {
    label: 'Quizzes',
    path: '/quizzes',
    icon: BrainCircuit,
    description: 'Timed knowledge checks',
    keywords: ['quizzes', 'quiz', 'mcq', 'questions'],
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
    description: 'Accuracy and momentum',
    keywords: ['analytics', 'stats', 'insights', 'progress'],
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    description: 'Workspace preferences',
    keywords: ['settings', 'profile', 'preferences'],
  },
];

export const workspaceHighlights = [
  {
    label: 'AI-first workflow',
    value: 'Upload once, review across cards and quizzes',
    icon: Sparkles,
  },
];
