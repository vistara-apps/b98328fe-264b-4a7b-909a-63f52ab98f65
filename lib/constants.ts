export const APP_CONFIG = {
  name: 'CollabFlow',
  tagline: 'Build better, together',
  description: 'Tinder for creative projects',
  version: '1.0.0',
} as const;

export const SKILL_CATEGORIES = [
  'Design',
  'Development',
  'Marketing',
  'Writing',
  'Photography',
  'Video',
  'Music',
  'Business',
  'Research',
  'Strategy',
] as const;

export const WORK_STYLES = [
  'Remote',
  'In-person',
  'Hybrid',
  'Flexible',
] as const;

export const PROJECT_STATUSES = [
  'active',
  'paused',
  'completed',
] as const;

export const SWIPE_THRESHOLD = 100; // pixels
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_TITLE_LENGTH = 100;
export const MAX_BIO_LENGTH = 200;

export const COLORS = {
  bg: 'hsl(210 25% 95%)',
  accent: 'hsl(30 90% 65%)',
  primary: 'hsl(200 70% 50%)',
  surface: 'hsl(210 25% 100%)',
  textPrimary: 'hsl(210 25% 15%)',
  textSecondary: 'hsl(210 25% 45%)',
  success: 'hsl(142 76% 36%)',
  warning: 'hsl(38 92% 50%)',
  error: 'hsl(0 84% 60%)',
} as const;

export const SAMPLE_PROJECTS = [
  {
    projectId: '1',
    userId: 'user1',
    title: 'AI-Powered Recipe App',
    description: 'Building a mobile app that uses AI to suggest recipes based on available ingredients. Looking for a UI/UX designer to help create an intuitive and beautiful interface.',
    skillsRequired: ['UI/UX Design', 'Mobile Design', 'Prototyping'],
    vision: 'Make cooking accessible and fun for everyone',
    workStyle: 'Remote',
    createdAt: new Date('2024-01-15'),
    status: 'active' as const,
    imageUrl: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Recipe+App',
  },
  {
    projectId: '2',
    userId: 'user2',
    title: 'Sustainable Fashion Platform',
    description: 'Creating an e-commerce platform for sustainable fashion brands. Need a full-stack developer to help build the marketplace and payment integration.',
    skillsRequired: ['Full-Stack Development', 'E-commerce', 'Payment Systems'],
    vision: 'Revolutionize fashion industry sustainability',
    workStyle: 'Hybrid',
    createdAt: new Date('2024-01-20'),
    status: 'active' as const,
    imageUrl: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Fashion+Platform',
  },
  {
    projectId: '3',
    userId: 'user3',
    title: 'Local Community Garden Network',
    description: 'Building a platform to connect local gardeners and share resources. Looking for someone with marketing expertise to help grow our community.',
    skillsRequired: ['Digital Marketing', 'Community Building', 'Social Media'],
    vision: 'Strengthen local communities through gardening',
    workStyle: 'In-person',
    createdAt: new Date('2024-01-25'),
    status: 'active' as const,
    imageUrl: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Garden+Network',
  },
] as const;

export const SAMPLE_USERS = [
  {
    userId: 'user1',
    displayName: 'Alex Chen',
    bio: 'Full-stack developer passionate about AI and user experience',
    avatar: 'https://via.placeholder.com/100x100/6366F1/FFFFFF?text=AC',
    linkedProjects: ['1'],
  },
  {
    userId: 'user2',
    displayName: 'Sarah Johnson',
    bio: 'Sustainable fashion advocate and e-commerce expert',
    avatar: 'https://via.placeholder.com/100x100/EC4899/FFFFFF?text=SJ',
    linkedProjects: ['2'],
  },
  {
    userId: 'user3',
    displayName: 'Mike Rodriguez',
    bio: 'Community organizer and digital marketing specialist',
    avatar: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=MR',
    linkedProjects: ['3'],
  },
] as const;
