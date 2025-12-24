# Supabase Migrations

This directory contains database migrations for your Liceo-8888 project.

## Database Schema Overview

The migration creates the following tables:

### 1. **departments**
- Stores department information
- Fields: id, name, abbv, description, keywords, avatar, status, timestamps

### 2. **complaints_categories**
- Stores complaint category types
- Fields: id, name, default_department, status, timestamps
- Foreign Key: default_department → departments(id)

### 3. **users**
- Stores user information and authentication
- Fields: id, rfid_number, firstname, lastname, sex, birthdate, email, contact_number, username, password, role, department_id, avatar, timestamps
- Foreign Key: department_id → departments(id)
- Roles: super_admin, admin, user, department_staff

### 4. **complaints**
- Stores complaint/ticket information
- Fields: id, complaint_category, code, subject, description, image_url, priority, status, current_department_assigned, current_user_assigned, created_by, timestamps
- Foreign Keys:
  - complaint_category → complaints_categories(id)
  - current_department_assigned → departments(id)
  - current_user_assigned → users(id)
  - created_by → users(id)

## How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
```bash
npm install -g supabase
# or
brew install supabase/tap/supabase
```

2. **Initialize Supabase** (if not already done):
```bash
supabase init
```

3. **Link to your Supabase project**:
```bash
supabase link --project-ref your-project-ref
```

4. **Apply the migration**:
```bash
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `migrations/20241224000000_initial_schema.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the migration

### Option 3: Manual Local Development

If you're running Supabase locally:

```bash
supabase start
supabase db reset
```

## Row Level Security (RLS)

The migration includes basic RLS policies:

- **Departments**: Read by all authenticated users, write by admin/super_admin
- **Complaints Categories**: Read by all authenticated users, write by admin/super_admin
- **Users**: Users can read/update own data, admins can read/update all
- **Complaints**: Read by all authenticated, create by owner, update by owner/assigned/staff/admin

**Note**: You may need to adjust these policies based on your specific security requirements.

## Important Notes

1. **Authentication Integration**: The RLS policies use `auth.uid()` which assumes you're using Supabase Auth. Make sure to set up authentication properly.

2. **Password Hashing**: The users table stores passwords. Make sure to hash passwords before storing them (use bcrypt or similar).

3. **Initial Data**: After running migrations, you'll need to:
   - Create at least one department
   - Create an initial super_admin user
   - Create some complaint categories

4. **Column Naming**: The migration uses snake_case for database columns (e.g., `created_at`) but your schemas use camelCase (e.g., `createdAt`). You may need to:
   - Update your Zod schemas to match the database, OR
   - Transform data between formats in your services

## Next Steps

1. Apply the migration
2. Create seed data for initial departments and categories
3. Create your first super_admin user
4. Test the RLS policies with different user roles
5. Adjust the RLS policies as needed for your use case

## Troubleshooting

- **Error: relation already exists**: The migration uses `IF NOT EXISTS` clauses, so it should be safe to run multiple times
- **Permission denied**: Make sure you have the right permissions on your Supabase project
- **RLS blocking queries**: Check that your auth.uid() matches a user in the users table

