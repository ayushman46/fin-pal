
// Mock data and services for the financial app

// User profile type
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Transaction types
export type TransactionCategory = 
  | 'food' 
  | 'shopping' 
  | 'transport' 
  | 'entertainment' 
  | 'utilities' 
  | 'rent' 
  | 'groceries'
  | 'health'
  | 'education'
  | 'other'
  | 'salary'
  | 'investment'
  | 'personal'
  | 'travel'
  | 'transportation'
  | 'housing'
  | 'healthcare';

export type TransactionType = 'need' | 'want' | 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: TransactionCategory;
  type: TransactionType;
}

// Savings goals definition
export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  dueDate?: string;
  category?: string;
  completed: boolean;
  streakDays?: number;
  achievement?: string;
  achievementLevel?: number;
}

// Nudge definition
export interface Nudge {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'achievement' | 'tip';
  date: string;
  read: boolean;
  actionable: boolean;
}

// Updated ChatMessage to include status property
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

// Mock user data
export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://i.pravatar.cc/150?img=11'
};

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    amount: -25.99,
    description: 'Food delivery - Zomato',
    date: '2025-04-04',
    category: 'food',
    type: 'want'
  },
  {
    id: 'tx-2',
    amount: -12.50,
    description: 'Coffee shop',
    date: '2025-04-03',
    category: 'food',
    type: 'want'
  },
  {
    id: 'tx-3',
    amount: -45.00,
    description: 'Grocery store',
    date: '2025-04-02',
    category: 'groceries',
    type: 'need'
  },
  {
    id: 'tx-4',
    amount: -35.20,
    description: 'Amazon purchase',
    date: '2025-04-01',
    category: 'shopping',
    type: 'want'
  },
  {
    id: 'tx-5',
    amount: -50.00,
    description: 'Phone bill',
    date: '2025-03-30',
    category: 'utilities',
    type: 'need'
  },
  {
    id: 'tx-6',
    amount: -15.75,
    description: 'Movie tickets',
    date: '2025-03-28',
    category: 'entertainment',
    type: 'want'
  },
  {
    id: 'tx-7',
    amount: -8.50,
    description: 'Transport',
    date: '2025-03-27',
    category: 'transport',
    type: 'need'
  },
  {
    id: 'tx-8',
    amount: -500.00,
    description: 'Rent payment',
    date: '2025-03-25',
    category: 'rent',
    type: 'need'
  },
  {
    id: 'tx-9',
    amount: 950.00,
    description: 'Salary deposit',
    date: '2025-03-25',
    category: 'other',
    type: 'need'
  },
  {
    id: 'tx-10',
    amount: -22.50,
    description: 'Restaurant dinner',
    date: '2025-03-23',
    category: 'food',
    type: 'want'
  }
];

// Mock savings goals
export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 2500,
    category: 'savings',
    completed: false
  },
  {
    id: 'goal-2',
    title: 'Vacation',
    targetAmount: 1200,
    currentAmount: 400,
    dueDate: '2025-08-15',
    category: 'travel',
    completed: false
  },
  {
    id: 'goal-3',
    title: 'New Laptop',
    targetAmount: 1000,
    currentAmount: 1000,
    category: 'tech',
    completed: true
  }
];

// Mock nudges
export const mockNudges: Nudge[] = [
  {
    id: 'nudge-1',
    message: "You've spent ₹38.49 on food delivery this week. That's 15% more than last week!",
    type: 'warning',
    date: '2025-04-04',
    read: false,
    actionable: true
  },
  {
    id: 'nudge-2',
    message: 'Save ₹100 more this week to reach your vacation savings goal!',
    type: 'tip',
    date: '2025-04-03',
    read: true,
    actionable: true
  },
  {
    id: 'nudge-3',
    message: 'Congratulations! You spent less on entertainment this month.',
    type: 'achievement',
    date: '2025-04-01',
    read: true,
    actionable: false
  }
];

// Mock chat history
export const mockChatHistory: ChatMessage[] = [
  {
    id: 'msg-1',
    content: 'Hi there! How can I help with your finances today?',
    sender: 'ai',
    timestamp: '2025-04-05T09:30:00'
  },
  {
    id: 'msg-2',
    content: 'How much did I spend on food this week?',
    sender: 'user',
    timestamp: '2025-04-05T09:31:00'
  },
  {
    id: 'msg-3',
    content: "You've spent ₹38.49 on food this week. Most of it was on food delivery services.",
    sender: 'ai',
    timestamp: '2025-04-05T09:31:10'
  }
];

// Helper functions for data manipulation
export function getCategorySpending(transactions: Transaction[], category: TransactionCategory): number {
  return transactions
    .filter(tx => tx.category === category && tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
}

export function getTotalSpendingByType(transactions: Transaction[], type: TransactionType): number {
  return transactions
    .filter(tx => tx.type === type && tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
}

export function getRecentTransactions(transactions: Transaction[], count: number): Transaction[] {
  return [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
}

export function getSavingsProgress(goal: SavingsGoal): number {
  return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
}

// Mock authentication service
export const authService = {
  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // In a real app, we would validate against a backend
      if (email === 'demo@example.com' && password === 'password') {
        setTimeout(() => resolve(mockUser), 800);
      } else {
        setTimeout(() => reject(new Error('Invalid email or password')), 800);
      }
    });
  },
  
  register: (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve) => {
      // In a real app, this would create a new user in the database
      setTimeout(() => resolve({...mockUser, name, email}), 1000);
    });
  },
  
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  }
};
