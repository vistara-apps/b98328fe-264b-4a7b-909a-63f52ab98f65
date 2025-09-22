import { MiniKit } from '@coinbase/minikit';

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  bio?: string;
  pfpUrl?: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: FarcasterUser | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async authenticateWithFarcaster(): Promise<FarcasterUser | null> {
    try {
      // Check if MiniKit is available
      if (!MiniKit.isInstalled()) {
        throw new Error('MiniKit is not installed');
      }

      // Request user authentication
      const authResult = await MiniKit.authenticate({
        appId: process.env.NEXT_PUBLIC_MINIKIT_APP_ID || 'collabflow',
        scopes: ['read_user', 'write_user'],
      });

      if (!authResult.user) {
        return null;
      }

      // Extract Farcaster user data
      const farcasterUser: FarcasterUser = {
        fid: authResult.user.fid,
        username: authResult.user.username,
        displayName: authResult.user.displayName || authResult.user.username,
        bio: authResult.user.bio,
        pfpUrl: authResult.user.pfpUrl,
      };

      this.currentUser = farcasterUser;
      return farcasterUser;
    } catch (error) {
      console.error('Farcaster authentication failed:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<FarcasterUser | null> {
    return this.currentUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    // Additional cleanup if needed
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = AuthService.getInstance();

