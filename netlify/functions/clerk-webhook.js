const { Webhook } = require('svix');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook secret not configured' })
    };
  }

  const headers = event.headers;
  const payload = event.body;

  // Get Svix headers
  const svix_id = headers['svix-id'];
  const svix_timestamp = headers['svix-timestamp'];
  const svix_signature = headers['svix-signature'];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing svix headers' })
    };
  }

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Attempt to verify the incoming webhook
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid signature' })
    };
  }

  // Handle the webhook
  const { type, data } = evt;
  
  console.log(`Webhook received: ${type}`);
  console.log('Data:', JSON.stringify(data, null, 2));

  // Handle different event types
  switch (type) {
    case 'user.created':
      console.log('User created:', data.id);
      // Add your user creation logic here
      break;
    
    case 'user.updated':
      console.log('User updated:', data.id);
      // Add your user update logic here
      break;
    
    case 'user.deleted':
      console.log('User deleted:', data.id);
      // Add your user deletion logic here
      break;
    
    default:
      console.log(`Unhandled event type: ${type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};