const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Only allow POST requests for user creation
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Initialize Supabase client
  const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    const userData = JSON.parse(event.body);

    // Validate required fields
    if (!userData.email || !userData.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields',
          required: ['email', 'name']
        })
      };
    }

    console.log('🔄 Creating user in Supabase:', userData);

    // Insert or update user based on email (using upsert)
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .upsert({
        email: userData.email,
        name: userData.name,
        clerk_user_id: userData.clerkUserId,
        avatar: userData.avatar,
        company_name: userData.companyName,
        company_role: userData.companyRole,
        industry: userData.industry,
        company_size: userData.companySize,
        specialization: userData.specialization,
        subscription_plan: userData.subscriptionPlan || 'pro_trial',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Failed to create user',
          details: error.message
        })
      };
    }

    console.log('✅ User created/updated successfully:', user);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: user
      })
    };

  } catch (error) {
    console.error('❌ Error processing request:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};