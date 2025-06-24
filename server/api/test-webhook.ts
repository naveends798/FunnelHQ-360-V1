import { Request, Response } from 'express';

// Test endpoint to verify webhook setup
export function testWebhookEndpoint(req: Request, res: Response) {
  console.log('Test webhook received');
  console.log('Headers:', req.headers);
  console.log('Body type:', typeof req.body);
  console.log('Body:', req.body);
  
  res.json({ 
    success: true, 
    message: 'Webhook endpoint is working',
    bodyType: typeof req.body,
    hasRawBody: req.body instanceof Buffer
  });
}

// Simulate Clerk webhook events for testing
export async function simulateClerkWebhook(req: Request, res: Response) {
  const { event } = req.body;
  
  const events: Record<string, any> = {
    'user.created': {
      type: 'user.created',
      data: {
        id: 'user_test123',
        email_addresses: [{ email_address: 'test@example.com' }],
        first_name: 'Test',
        last_name: 'User',
        created_at: new Date().toISOString()
      }
    },
    'organization.created': {
      type: 'organization.created',
      data: {
        id: 'org_test123',
        name: 'Test Organization',
        created_by: 'user_test123',
        created_at: new Date().toISOString()
      }
    },
    'organizationMembership.created': {
      type: 'organizationMembership.created',
      data: {
        organization: { id: 'org_test123', name: 'Test Organization' },
        public_user_data: { user_id: 'user_test456' },
        role: 'member'
      }
    }
  };

  const eventData = events[event];
  if (!eventData) {
    return res.status(400).json({ error: 'Unknown event type' });
  }

  console.log(`🔧 Simulating ${event} webhook`);
  
  // Actually process the webhook like the real handler would
  if (event === 'user.created') {
    try {
      const { id, email_addresses, first_name, last_name } = eventData.data;
      
      const userData = {
        email: email_addresses?.[0]?.email_address,
        name: `${first_name || ''} ${last_name || ''}`.trim(),
        clerkUserId: id,
        subscriptionPlan: 'pro_trial'
      };

      console.log('🔧 Creating user in Supabase:', userData);

      // Call our internal API to create the user
      const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:3002'}/api/supabase/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user in Supabase: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🔧 Successfully synced user to Supabase:', result);
      
      return res.json({ 
        success: true, 
        message: `Simulated ${event} event and created user`,
        eventData,
        supabaseResult: result
      });
    } catch (error) {
      console.error('🔧 Error in simulated webhook:', error);
      return res.status(500).json({ 
        success: false, 
        message: `Error simulating ${event}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // Log what would happen for other events
  console.log('Event data:', JSON.stringify(eventData, null, 2));
  
  res.json({ 
    success: true, 
    message: `Simulated ${event} event`,
    eventData 
  });
}