import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../shared/supabase-types';

// Server-side Supabase client with service role key
const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
  organizationId?: string;
}

// Middleware to verify Clerk session and extract user information
export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const sessionToken = authHeader.substring(7);
    
    // Verify the session token with Clerk
    const session = await clerkClient.sessions.verifySession(sessionToken, {
      // Add any verification options if needed
    });

    if (!session || !session.userId) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    // Get user metadata from Clerk
    const user = await clerkClient.users.getUser(session.userId);
    const publicMetadata = user.publicMetadata as any;

    req.userId = session.userId;
    req.userRole = publicMetadata?.role || 'client';
    req.organizationId = publicMetadata?.organizationId;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Middleware to check if user has required role
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.userRole
      });
    }
    next();
  };
};

// Middleware to check if user is admin
export const requireAdmin = requireRole(['admin']);

// Middleware to check if user is admin or team member
export const requireTeamAccess = requireRole(['admin', 'team_member']);

// Middleware to get user profile from Supabase
export const getUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user profile from Supabase
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    // If profile exists, update role information
    if (profile) {
      req.userRole = profile.role || req.userRole;
      req.organizationId = profile.organization_id || req.organizationId;
    }

    next();
  } catch (error) {
    console.error('Error in getUserProfile middleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to check project access
export const checkProjectAccess = async (userId: string, projectId: string, userRole: string): Promise<boolean> => {
  try {
    // Admins have access to all projects
    if (userRole === 'admin') {
      return true;
    }

    // Check if user is assigned to the project
    const { data: teamMember } = await supabase
      .from('project_team_members')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .single();

    if (teamMember) {
      return true;
    }

    // Check if user is the project client
    const { data: project } = await supabase
      .from('projects')
      .select('client_id')
      .eq('id', projectId)
      .single();

    if (project && userRole === 'client') {
      // For clients, check if they are associated with the project
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('id', project.client_id)
        .eq('user_id', userId)
        .single();

      return !!client;
    }

    return false;
  } catch (error) {
    console.error('Error checking project access:', error);
    return false;
  }
};

// Middleware to check project access
export const requireProjectAccess = (projectIdParam: string = 'projectId') => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params[projectIdParam];
      
      if (!projectId) {
        return res.status(400).json({ error: 'Project ID is required' });
      }

      if (!req.userId || !req.userRole) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const hasAccess = await checkProjectAccess(req.userId, projectId, req.userRole);
      
      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied to this project' });
      }

      next();
    } catch (error) {
      console.error('Error in project access middleware:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export { AuthenticatedRequest };