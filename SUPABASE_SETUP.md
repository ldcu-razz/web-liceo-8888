# Supabase Setup Guide for Liceo-8888

This guide will help you set up your Supabase database from scratch.

## Prerequisites

- A Supabase account ([sign up here](https://supabase.com))
- Supabase CLI installed (optional but recommended)
- Your Supabase project credentials

## Step 1: Set Up Your Supabase Project

### Option A: Create New Project in Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **New Project**
3. Fill in project details:
   - **Name**: liceo-8888
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your location
4. Wait for project to be provisioned (~2 minutes)

### Option B: Use Existing Project

If you already have a Supabase project, you can use that.

## Step 2: Get Your Project Credentials

1. Go to **Project Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**
   - **service_role key** (keep this secret!)

## Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# .env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**: Add `.env` to your `.gitignore` file to keep credentials secure!

## Step 4: Update Supabase Client

Update your Supabase client configuration in `src/lib/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
```

## Step 5: Install Supabase Client Library

If not already installed:

```bash
npm install @supabase/supabase-js
# or
bun add @supabase/supabase-js
```

## Step 6: Run Database Migration

### Method 1: Using Supabase Dashboard (Easiest)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire content from `supabase/migrations/20241224000000_initial_schema.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Wait for completion (you should see "Success")

### Method 2: Using Supabase CLI

```bash
# Install CLI if needed
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Method 3: Using psql (Advanced)

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" \
  -f supabase/migrations/20241224000000_initial_schema.sql
```

## Step 7: Seed Initial Data (Optional but Recommended)

After running the migration, populate your database with initial data:

### Update the Seed File First

1. Open `supabase/seed.sql`
2. Replace all `$2a$10$YourHashedPasswordHere` placeholders with actual hashed passwords
   - You can use [bcrypt online generator](https://bcrypt-generator.com/) 
   - Or use the password hashing in your app
3. Update user details as needed

### Run the Seed File

**Via Supabase Dashboard:**
1. Go to **SQL Editor**
2. Copy content from `supabase/seed.sql`
3. Click **Run**

**Via CLI:**
```bash
supabase db seed
```

## Step 8: Verify Your Setup

Run this query in the SQL Editor to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- `departments`
- `complaints_categories`
- `users`
- `complaints`

## Step 9: Set Up Authentication (Important!)

The Row Level Security (RLS) policies assume you're using Supabase Auth. 

### Option 1: Use Supabase Auth (Recommended)

Update your auth flow to use Supabase Authentication:

```typescript
// Login example
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### Option 2: Disable RLS (Not Recommended for Production)

If you want to handle auth separately, you can disable RLS:

```sql
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaints_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaints DISABLE ROW LEVEL SECURITY;
```

**⚠️ Warning**: Only do this for development. In production, always use RLS!

## Step 10: Update Your API Endpoints

I've created an example server endpoint for you. To integrate with Supabase:

1. Check out `src/routes/api/departments/+server.example.ts`
2. Use it as reference to update your actual `+server.ts` files
3. The example shows:
   - How to query Supabase
   - How to handle snake_case ↔ camelCase conversion
   - How to validate data with Zod schemas
   - Proper error handling

## Database Schema Notes

### Column Naming Convention

- **Database**: Uses `snake_case` (e.g., `created_at`, `department_id`)
- **TypeScript/Frontend**: Uses `camelCase` (e.g., `createdAt`, `departmentId`)

We've created utility functions in `src/lib/utils/database.utils.ts` to handle conversion:

```typescript
import { objectToCamelCase, objectToSnakeCase } from '$lib/utils/database.utils';

// When saving to database
const dbData = objectToSnakeCase(frontendData);

// When reading from database
const frontendData = objectToCamelCase(dbData);
```

### Timestamp Handling

- Database stores timestamps as `TIMESTAMPTZ` (timezone-aware)
- Automatically managed by triggers (`created_at`, `updated_at`)
- You don't need to set these manually

### Foreign Keys

- `users.department_id` → `departments.id` (RESTRICT)
- `complaints.complaint_category` → `complaints_categories.id` (RESTRICT)
- `complaints.current_department_assigned` → `departments.id` (SET NULL)
- `complaints.current_user_assigned` → `users.id` (SET NULL)
- `complaints.created_by` → `users.id` (RESTRICT)

## Testing Your Setup

### Test 1: Create a Department

```typescript
const { data, error } = await supabase
  .from('departments')
  .insert({
    name: 'Test Department',
    abbv: 'TEST',
    description: 'Testing',
    status: 'active'
  })
  .select()
  .single();

console.log(data);
```

### Test 2: Fetch Departments

```typescript
const { data, error } = await supabase
  .from('departments')
  .select('*');

console.log(data);
```

### Test 3: Update a Department

```typescript
const { data, error } = await supabase
  .from('departments')
  .update({ description: 'Updated description' })
  .eq('id', 'your-department-id')
  .select()
  .single();

console.log(data);
```

## Common Issues & Troubleshooting

### Issue: "permission denied for table departments"

**Solution**: Check RLS policies. Either:
1. Set up Supabase Auth properly, OR
2. Disable RLS for development (see Step 9)

### Issue: "relation 'departments' does not exist"

**Solution**: Migration wasn't run. Go back to Step 6.

### Issue: "duplicate key value violates unique constraint"

**Solution**: You're trying to insert data with an ID that already exists. Let the database auto-generate IDs by not including the `id` field.

### Issue: Data comes back as snake_case

**Solution**: Use the conversion utilities:
```typescript
import { objectToCamelCase } from '$lib/utils/database.utils';
const camelData = objectToCamelCase(snakeData);
```

### Issue: "password authentication failed"

**Solution**: In seed.sql, make sure you're using properly hashed passwords, not the placeholder text.

## Next Steps

1. ✅ Run migration
2. ✅ Seed initial data
3. ✅ Test CRUD operations
4. 🔲 Set up Supabase Auth
5. 🔲 Update API endpoints
6. 🔲 Test RLS policies
7. 🔲 Deploy to production

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

## Need Help?

- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Supabase GitHub Discussions: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

---

**Last Updated**: December 24, 2025

