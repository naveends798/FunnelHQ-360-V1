import { createClient } from '@supabase/supabase-js'

// Basic type definitions for immediate use
interface User {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

interface Client {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

interface Project {
  id: number;
  title: string;
  status: string;
  [key: string]: any;
}

// Minimal IStorage interface for basic operations
interface IStorage {
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  updateUser(id: number, updates: any): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: any): Promise<Client>;
  updateClient(id: number, client: any): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: any): Promise<Project>;
  updateProject(id: number, project: any): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  getStats(): Promise<any>;
  [key: string]: any; // Allow other methods for compatibility
}

export class SupabaseStorage implements IStorage {
  private supabase

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration. Check VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
    console.log('🔗 Connected to Supabase production database')
  }

  // Users
  async getUsers(): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching users:', error)
      throw error
    }
    return data || []
  }

  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching user:', error)
      throw error
    }
    return data || undefined
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user by username:', error)
      throw error
    }
    return data || undefined
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert([{
        ...user,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      throw error
    }
    console.log('✅ User created:', data.id)
    return data
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user:', error)
      throw error
    }
    return data || undefined
  }

  async deleteUser(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting user:', error)
      throw error
    }
    return true
  }

  // Clients
  async getClients(): Promise<Client[]> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .order('joined_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
    return data || []
  }

  async getClient(id: number): Promise<Client | undefined> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching client:', error)
      throw error
    }
    return data || undefined
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching client by email:', error)
      throw error
    }
    return data || undefined
  }

  async getClientWithProjects(id: number): Promise<ClientWithProjects | undefined> {
    const { data: client, error: clientError } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (clientError && clientError.code !== 'PGRST116') {
      console.error('Error fetching client:', clientError)
      throw clientError
    }
    
    if (!client) return undefined

    const { data: projects, error: projectsError } = await this.supabase
      .from('projects')
      .select('*')
      .eq('client_id', id)
    
    if (projectsError) {
      console.error('Error fetching client projects:', projectsError)
      throw projectsError
    }

    return {
      ...client,
      projects: projects || []
    }
  }

  async createClient(client: InsertClient): Promise<Client> {
    const { data, error } = await this.supabase
      .from('clients')
      .insert([{
        ...client,
        joined_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating client:', error)
      throw error
    }
    console.log('✅ Client created:', data.id)
    return data
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const { data, error } = await this.supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating client:', error)
      throw error
    }
    return data || undefined
  }

  async deleteClient(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting client:', error)
      throw error
    }
    return true
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
    return data || []
  }

  async getProjectsForUser(userId: number, organizationId: number): Promise<ProjectWithTeamMembers[]> {
    // Get projects where user is owner or team member
    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        clients:client_id(*),
        project_team_members(
          *,
          users:user_id(*)
        )
      `)
      .or(`owner_id.eq.${userId},project_team_members.user_id.eq.${userId}`)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user projects:', error)
      throw error
    }
    return data || []
  }

  async getProject(id: number): Promise<Project | undefined> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching project:', error)
      throw error
    }
    return data || undefined
  }

  async getProjectWithClient(id: number): Promise<ProjectWithClient | undefined> {
    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        clients:client_id(*)
      `)
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching project with client:', error)
      throw error
    }
    return data || undefined
  }

  async getProjectWithTeamMembers(id: number): Promise<ProjectWithTeamMembers | undefined> {
    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        clients:client_id(*),
        project_team_members(
          *,
          users:user_id(*)
        )
      `)
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching project with team:', error)
      throw error
    }
    return data || undefined
  }

  async getProjectsByClient(clientId: number): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching projects by client:', error)
      throw error
    }
    return data || []
  }

  async createProject(project: InsertProject): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert([{
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating project:', error)
      throw error
    }
    console.log('✅ Project created:', data.id)
    return data
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const { data, error } = await this.supabase
      .from('projects')
      .update({
        ...project,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating project:', error)
      throw error
    }
    return data || undefined
  }

  async deleteProject(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting project:', error)
      throw error
    }
    return true
  }

  // Basic implementation for other required methods
  // (You'll need to implement all the remaining methods from the IStorage interface)
  
  async getStats(): Promise<any> {
    const [users, clients, projects] = await Promise.all([
      this.getUsers(),
      this.getClients(),
      this.getProjects()
    ])

    return {
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalClients: clients.length,
      monthlyRevenue: 5000, // Calculate from billing data
      hoursThisMonth: 342 // Calculate from time tracking
    }
  }

  // Placeholder implementations for remaining methods
  // TODO: Implement all remaining IStorage methods
  async getProjectTeamMembers(projectId: number): Promise<(ProjectTeamMember & { user: User })[]> {
    const { data, error } = await this.supabase
      .from('project_team_members')
      .select(`
        *,
        users:user_id(*)
      `)
      .eq('project_id', projectId)
      .eq('is_active', true)
    
    if (error) {
      console.error('Error fetching project team members:', error)
      throw error
    }
    return data || []
  }

  async addProjectTeamMember(member: InsertProjectTeamMember): Promise<ProjectTeamMember> {
    const { data, error } = await this.supabase
      .from('project_team_members')
      .insert([{
        ...member,
        assigned_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding project team member:', error)
      throw error
    }
    return data
  }

  async updateProjectTeamMember(id: number, member: Partial<InsertProjectTeamMember>): Promise<ProjectTeamMember | undefined> {
    const { data, error } = await this.supabase
      .from('project_team_members')
      .update(member)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating project team member:', error)
      throw error
    }
    return data || undefined
  }

  async removeProjectTeamMember(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('project_team_members')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) {
      console.error('Error removing project team member:', error)
      throw error
    }
    return true
  }

  async getUserProjectRole(projectId: number, userId: number): Promise<ProjectTeamMember | undefined> {
    const { data, error } = await this.supabase
      .from('project_team_members')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user project role:', error)
      throw error
    }
    return data || undefined
  }

  // Add minimal implementations for other required methods to satisfy interface
  async getMilestonesByProject(projectId: number): Promise<Milestone[]> { return [] }
  async getMilestone(id: number): Promise<Milestone | undefined> { return undefined }
  async createMilestone(milestone: InsertMilestone): Promise<Milestone> { throw new Error('Not implemented') }
  async updateMilestone(id: number, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined> { return undefined }
  async deleteMilestone(id: number): Promise<boolean> { return false }
  
  async getActivities(limit?: number): Promise<ActivityWithDetails[]> { return [] }
  async getActivitiesByProject(projectId: number): Promise<Activity[]> { return [] }
  async createActivity(activity: InsertActivity): Promise<Activity> { throw new Error('Not implemented') }
  
  async getDocumentsByProject(projectId: number): Promise<Document[]> { return [] }
  async getDocument(id: number): Promise<Document | undefined> { return undefined }
  async createDocument(document: InsertDocument): Promise<Document> { throw new Error('Not implemented') }
  async deleteDocument(id: number): Promise<boolean> { return false }
  
  // Add all other required methods with minimal implementations
  // This allows the interface to be satisfied while you implement production features incrementally
  
  async getMessagesByProject(projectId: number): Promise<Message[]> { return [] }
  async getProjectMessages(projectId: number): Promise<Message[]> { return [] }
  async createMessage(message: InsertMessage): Promise<Message> { throw new Error('Not implemented') }
  async markMessageAsRead(id: number): Promise<boolean> { return false }
  async markProjectMessagesAsRead(projectId: number, userId: number): Promise<boolean> { return false }
  async getConversations(userId: number): Promise<any[]> { return [] }
  async getProjectParticipants(projectId: number): Promise<any[]> { return [] }
  
  async createDirectMessage(message: InsertDirectMessage): Promise<DirectMessage> { throw new Error('Not implemented') }
  async getDirectMessages(clientId: number): Promise<DirectMessage[]> { return [] }
  async markDirectMessagesAsRead(clientId: number, userId: number): Promise<boolean> { return false }
  async getClientConversations(): Promise<any[]> { return [] }
  
  async createTeamDirectMessage(message: InsertTeamDirectMessage): Promise<TeamDirectMessage> { throw new Error('Not implemented') }
  async getTeamDirectMessages(userId: number): Promise<TeamDirectMessage[]> { return [] }
  async markTeamDirectMessagesAsRead(userId: number, currentUserId: number): Promise<boolean> { return false }
  async getTeamMemberConversations(): Promise<any[]> { return [] }
  
  // Continue with all other method stubs...
  // This is a starting implementation - you'll need to complete all methods
}