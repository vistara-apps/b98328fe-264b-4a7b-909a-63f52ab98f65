export interface User {
  userId: string;
  farcasterId?: string;
  displayName: string;
  bio: string;
  avatar?: string;
  linkedProjects: string[];
}

export interface ProjectProfile {
  projectId: string;
  userId: string;
  title: string;
  description: string;
  skillsRequired: string[];
  vision: string;
  workStyle: string;
  createdAt: Date;
  status: 'active' | 'paused' | 'completed';
  imageUrl?: string;
}

export interface Swipe {
  swipeId: string;
  swiperUserId: string;
  swipedProjectId: string;
  swipeDirection: 'left' | 'right';
  createdAt: Date;
}

export interface Match {
  matchId: string;
  projectProfile1Id: string;
  projectProfile2Id: string;
  createdAt: Date;
  status: 'active' | 'archived';
}

export interface ChatMessage {
  messageId: string;
  matchId: string;
  senderUserId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

export interface Task {
  taskId: string;
  matchId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  dueDate?: Date;
}

export type SwipeDirection = 'left' | 'right';
export type ViewMode = 'discover' | 'matches' | 'profile' | 'chat' | 'create';
