const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse simple .env since node 20 --env-file might have issues inside some setups
const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if(match) process.env[match[1].trim()] = match[2].trim();
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setup() {
  console.log('Setting up buckets...');
  const buckets = ['product-images', 'category-images', 'banner-images', 'blog-images', 'cms-images', 'legacy-images'];
  for (const b of buckets) {
    const { data, error } = await supabase.storage.createBucket(b, { public: true });
    if (error && !error.message.includes('already exists') && !error.message.includes('Duplicate')) {
        console.error(`Error creating bucket ${b}:`, error);
    } else {
        console.log(`Bucket ${b} is ready.`);
    }
  }
  
  console.log('Seeding super admin...');
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: 'admin@jammipharma.com',
    password: 'Jammi@007',
    email_confirm: true
  });
  
  if (authError && !authError.message.includes('already has an account') && !authError.message.includes('already registered')) {
    console.error('Auth error:', authError);
  }
  
  // Find user if already exists
  let userId = authUser?.user?.id;
  if (!userId) {
      const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
      if (!listErr) {
          const u = users.find(u => u.email === 'admin@jammipharma.com');
          if (u) userId = u.id;
      }
  }
  
  if (userId) {
    const { data: profiles, error: dbError } = await supabase.from('admin_users').select('id').eq('email', 'admin@jammipharma.com');
    if (dbError && dbError.code === '42P01') {
        console.log('Table admin_users might not exist yet. Please run the SQL migration first!');
    } else if (!profiles || profiles.length === 0) {
        await supabase.from('admin_users').insert({
          auth_user_id: userId,
          name: 'Jammi Admin',
          email: 'admin@jammipharma.com',
          role: 'super_admin',
          status: 'active'
        });
        console.log('Super admin seeded.');
    } else {
        console.log('Super admin already seeded.');
    }
  }
  console.log('Setup finished.');
}
setup();
