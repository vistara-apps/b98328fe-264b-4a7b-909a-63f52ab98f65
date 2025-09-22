import { User, ProjectProfile, Swipe, Match, ChatMessage, Task } from './types';

// In-memory database for development - replace with real database in production
class Database {
  private users: Map<string, User> = new Map();
  private projects: Map<string, ProjectProfile> = new Map();
  private swipes: Map<string, Swipe> = new Map();
  private matches: Map<string, Match> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();
  private tasks: Map<string, Task> = new Map();

  // User operations
  async createUser(user: Omit<User, 'userId'> & { userId?: string }): Promise<User> {
    const userId = user.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = { ...user, userId };
    this.users.set(userId, newUser);
    return newUser;
  }

  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getUsersByFarcasterId(farcasterId: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.farcasterId === farcasterId) {
        return user;
      }
    }
    return null;
  }

  // Project operations
  async createProject(project: Omit<ProjectProfile, 'projectId' | 'createdAt'>): Promise<ProjectProfile> {
    const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newProject: ProjectProfile = {
      ...project,
      projectId,
      createdAt: new Date(),
    };
    this.projects.set(projectId, newProject);
    return newProject;
  }

  async getProject(projectId: string): Promise<ProjectProfile | null> {
    return this.projects.get(projectId) || null;
  }

  async getProjectsByUser(userId: string): Promise<ProjectProfile[]> {
    return Array.from(this.projects.values()).filter(p => p.userId === userId);
  }

  async getAllActiveProjects(): Promise<ProjectProfile[]> {
    return Array.from(this.projects.values()).filter(p => p.status === 'active');
  }

  async updateProject(projectId: string, updates: Partial<ProjectProfile>): Promise<ProjectProfile | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const updatedProject = { ...project, ...updates };
    this.projects.set(projectId, updatedProject);
    return updatedProject;
  }

  // Swipe operations
  async createSwipe(swipe: Omit<Swipe, 'swipeId' | 'createdAt'>): Promise<Swipe> {
    const swipeId = `swipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSwipe: Swipe = {
      ...swipe,
      swipeId,
      createdAt: new Date(),
    };
    this.swipes.set(swipeId, newSwipe);
    return newSwipe;
  }

  async getSwipe(swiperUserId: string, swipedProjectId: string): Promise<Swipe | null> {
    for (const swipe of this.swipes.values()) {
      if (swipe.swiperUserId === swiperUserId && swipe.swipedProjectId === swipedProjectId) {
        return swipe;
      }
    }
    return null;
  }

  async getSwipesByUser(userId: string): Promise<Swipe[]> {
    return Array.from(this.swipes.values()).filter(s => s.swiperUserId === userId);
  }

  // Match operations
  async createMatch(match: Omit<Match, 'matchId' | 'createdAt'>): Promise<Match> {
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMatch: Match = {
      ...match,
      matchId,
      createdAt: new Date(),
      status: 'active',
    };
    this.matches.set(matchId, newMatch);
    return newMatch;
  }

  async getMatch(matchId: string): Promise<Match | null> {
    return this.matches.get(matchId) || null;
  }

  async getMatchesByUser(userId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(m =>
      m.projectProfile1Id.startsWith(`project_${userId}`) ||
      m.projectProfile2Id.startsWith(`project_${userId}`)
    );
  }

  async checkMutualMatch(projectId1: string, projectId2: string): Promise<boolean> {
    // Check if there's already a match between these projects
    for (const match of this.matches.values()) {
      const projects = [match.projectProfile1Id, match.projectProfile2Id];
      if (projects.includes(projectId1) && projects.includes(projectId2)) {
        return true;
      }
    }
    return false;
  }

  // Chat operations
  async createChatMessage(message: Omit<ChatMessage, 'messageId' | 'timestamp'>): Promise<ChatMessage> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMessage: ChatMessage = {
      ...message,
      messageId,
      timestamp: new Date(),
      type: message.type || 'text',
    };
    this.chatMessages.set(messageId, newMessage);
    return newMessage;
  }

  async getChatMessages(matchId: string, limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(m => m.matchId === matchId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-limit);
  }

  // Task operations
  async createTask(task: Omit<Task, 'taskId' | 'createdAt'>): Promise<Task> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTask: Task = {
      ...task,
      taskId,
      createdAt: new Date(),
    };
    this.tasks.set(taskId, newTask);
    return newTask;
  }

  async getTask(taskId: string): Promise<Task | null> {
    return this.tasks.get(taskId) || null;
  }

  async getTasksByMatch(matchId: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(t => t.matchId === matchId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    const updatedTask = { ...task, ...updates };
    this.tasks.set(taskId, updatedTask);
    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<boolean> {
    return this.tasks.delete(taskId);
  }

  // Utility methods
  async getStats(): Promise<{
    users: number;
    projects: number;
    matches: number;
    messages: number;
    tasks: number;
  }> {
    return {
      users: this.users.size,
      projects: this.projects.size,
      matches: this.matches.size,
      messages: this.chatMessages.size,
      tasks: this.tasks.size,
    };
  }

  // Initialize with sample data
  async initializeSampleData() {
    // This will be called during app initialization
    console.log('Database initialized with sample data');
  }
}

// Export singleton instance
export const db = new Database();

