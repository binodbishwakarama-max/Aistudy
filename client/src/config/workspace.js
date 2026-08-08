import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  Settings,
  Upload,
} from 'lucide-react';

export const workspaceNavigation = [
  {
    label: 'Home',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Next actions and recent work',
    keywords: ['home', 'overview', 'dashboard', 'recent'],
  },
  {
    label: 'Study',
    path: '/study',
    icon: BookOpen,
    description: 'Cards, quizzes, and library',
    keywords: ['study', 'flashcards', 'cards', 'review', 'quiz', 'quizzes', 'adaptive', 'library'],
  },
  {
    label: 'Upload',
    path: '/upload',
    icon: Upload,
    description: 'Import notes and PDFs',
    keywords: ['upload', 'notes', 'pdf', 'source'],
  },
  {
    label: 'Progress',
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

export const workspaceHighlights = [];
