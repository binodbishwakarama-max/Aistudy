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
    description: 'Due cards and your next exam sprint',
    keywords: ['home', 'overview', 'dashboard', 'recent', 'due'],
  },
  {
    label: 'Study',
    path: '/study',
    icon: BookOpen,
    description: '45-min sprint: cards, quizzes, library',
    keywords: ['study', 'flashcards', 'cards', 'review', 'quiz', 'quizzes', 'adaptive', 'library', 'sprint'],
  },
  {
    label: 'Upload',
    path: '/upload',
    icon: Upload,
    description: 'PDF → auto-generate your sprint deck',
    keywords: ['upload', 'notes', 'pdf', 'source', 'sprint'],
  },
  {
    label: 'Progress',
    path: '/analytics',
    icon: BarChart3,
    description: 'Sprint accuracy and review momentum',
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
