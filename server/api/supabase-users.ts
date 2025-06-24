import { Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'
import { Database } from '../../shared/supabase-types'

// Server-side Supabase client with service role key
const supabaseAdmin = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

interface CreateUserRequest {
  email: string
  name: string
  clerkUserId: string
  avatar?: string
  companyName?: string
  companyRole?: string
  industry?: string
  companySize?: string
  specialization?: string
  subscriptionPlan?: string
}

interface UpdateUserRequest {
  name?: string
  avatar?: string
  companyName?: string
  companyRole?: string
  industry?: string
  companySize?: string
  specialization?: string
  subscriptionPlan?: string
  subscriptionStatus?: string
  maxProjects?: number
}

// Create or update user in Supabase
export const createOrUpdateUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserRequest = req.body

    // Validate required fields
    if (!userData.email || !userData.name || !userData.clerkUserId) {
      return res.status(400).json({
        error: 'Missing required fields: email, name, and clerkUserId are required'
      })
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', userData.email)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing user:', fetchError)
      return res.status(500).json({ error: 'Failed to check existing user' })
    }

    let result
    if (existingUser) {
      // Update existing user
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          name: userData.name,
          avatar: userData.avatar,
          company_name: userData.companyName,
          company_role: userData.companyRole,
          industry: userData.industry,
          company_size: userData.companySize,
          specialization: userData.specialization,
          subscription_plan: userData.subscriptionPlan || 'solo',
          last_login_at: new Date().toISOString(),
        })
        .eq('email', userData.email)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        return res.status(500).json({ error: 'Failed to update user' })
      }

      result = { user: data, created: false }
    } else {
      // Create new user
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([{
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          company_name: userData.companyName,
          company_role: userData.companyRole,
          industry: userData.industry,
          company_size: userData.companySize,
          specialization: userData.specialization,
          subscription_plan: userData.subscriptionPlan || 'solo',
          subscription_status: 'active',
          max_projects: userData.subscriptionPlan === 'pro' ? -1 : 3,
          last_login_at: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating user:', error)
        return res.status(500).json({ error: 'Failed to create user' })
      }

      result = { user: data, created: true }
    }

    console.log(`${result.created ? 'Created' : 'Updated'} user:`, result.user.email)
    res.json(result)
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get user by email
export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' })
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'User not found' })
      }
      console.error('Error fetching user:', error)
      return res.status(500).json({ error: 'Failed to fetch user' })
    }

    res.json({ user: data })
  } catch (error) {
    console.error('Error in getUserByEmail:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params
    const updates: UpdateUserRequest = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' })
    }

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    )

    if (Object.keys(cleanUpdates).length === 0) {
      return res.status(400).json({ error: 'No update fields provided' })
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(cleanUpdates)
      .eq('email', email)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'User not found' })
      }
      console.error('Error updating user:', error)
      return res.status(500).json({ error: 'Failed to update user' })
    }

    console.log('Updated user:', data.email)
    res.json({ user: data })
  } catch (error) {
    console.error('Error in updateUser:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Delete user (soft delete)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' })
    }

    // Soft delete by setting is_active to false
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ 
        is_active: false,
        // You might want to anonymize data here
      })
      .eq('email', email)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'User not found' })
      }
      console.error('Error deleting user:', error)
      return res.status(500).json({ error: 'Failed to delete user' })
    }

    console.log('Soft deleted user:', data.email)
    res.json({ user: data, message: 'User deactivated successfully' })
  } catch (error) {
    console.error('Error in deleteUser:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get user's usage statistics
export const getUserUsage = async (req: Request, res: Response) => {
  try {
    const { email } = req.params

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' })
    }

    // Get user ID first
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, subscription_plan, max_projects')
      .eq('email', email)
      .single()

    if (userError) {
      if (userError.code === 'PGRST116') {
        return res.status(404).json({ error: 'User not found' })
      }
      console.error('Error fetching user:', userError)
      return res.status(500).json({ error: 'Failed to fetch user' })
    }

    // Get project count
    const { count: projectCount, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    if (projectError) {
      console.error('Error counting projects:', projectError)
      return res.status(500).json({ error: 'Failed to count projects' })
    }

    // Get collaborator count
    const { count: collaboratorCount, error: collaboratorError } = await supabaseAdmin
      .from('user_collaborations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (collaboratorError) {
      console.error('Error counting collaborators:', collaboratorError)
      return res.status(500).json({ error: 'Failed to count collaborators' })
    }

    // Get storage usage (sum of all assets)
    const { data: storageData, error: storageError } = await supabaseAdmin
      .from('assets')
      .select('size')
      .eq('owner_id', user.id)

    if (storageError) {
      console.error('Error calculating storage:', storageError)
      return res.status(500).json({ error: 'Failed to calculate storage usage' })
    }

    const storageUsed = storageData?.reduce((total, asset) => total + (asset.size || 0), 0) || 0

    const usage = {
      projects: {
        used: projectCount || 0,
        limit: user.max_projects === -1 ? 'unlimited' : user.max_projects,
        percentage: user.max_projects === -1 ? 0 : Math.round(((projectCount || 0) / user.max_projects) * 100)
      },
      collaborators: {
        used: collaboratorCount || 0,
        limit: user.subscription_plan === 'pro' ? 'unlimited' : 0,
        percentage: user.subscription_plan === 'pro' ? 0 : 100
      },
      storage: {
        used: storageUsed,
        usedFormatted: formatBytes(storageUsed),
        limit: user.subscription_plan === 'pro' ? 100 * 1024 * 1024 * 1024 : 5 * 1024 * 1024 * 1024, // 100GB or 5GB
        limitFormatted: user.subscription_plan === 'pro' ? '100 GB' : '5 GB',
        percentage: Math.round((storageUsed / (user.subscription_plan === 'pro' ? 100 * 1024 * 1024 * 1024 : 5 * 1024 * 1024 * 1024)) * 100)
      }
    }

    res.json({
      user: {
        id: user.id,
        email,
        subscription_plan: user.subscription_plan
      },
      usage
    })
  } catch (error) {
    console.error('Error in getUserUsage:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Helper function to format bytes
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}