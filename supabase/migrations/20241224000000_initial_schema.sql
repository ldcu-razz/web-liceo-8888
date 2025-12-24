-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE sex_enum AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE base_status_enum AS ENUM ('active', 'inactive', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('super_admin', 'admin', 'user', 'department_staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE complaint_priority_enum AS ENUM ('lowest', 'low', 'medium', 'high', 'highest');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE complaint_status_enum AS ENUM ('backlog', 'ready', 'in_progress', 'in_review', 'done', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    abbv TEXT NOT NULL,
    description TEXT DEFAULT '',
    keywords TEXT[] DEFAULT '{}',
    avatar TEXT,
    status base_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create complaints_categories table
CREATE TABLE IF NOT EXISTS complaints_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    default_department UUID REFERENCES departments(id) ON DELETE SET NULL,
    status base_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfid_number TEXT NOT NULL UNIQUE,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    sex sex_enum NOT NULL,
    birthdate DATE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contact_number TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'user',
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_category UUID NOT NULL REFERENCES complaints_categories(id) ON DELETE RESTRICT,
    code TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    priority complaint_priority_enum NOT NULL DEFAULT 'medium',
    status complaint_status_enum NOT NULL DEFAULT 'backlog',
    current_department_assigned UUID REFERENCES departments(id) ON DELETE SET NULL,
    current_user_assigned UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_departments_status ON departments(status);
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);

CREATE INDEX IF NOT EXISTS idx_complaints_categories_status ON complaints_categories(status);
CREATE INDEX IF NOT EXISTS idx_complaints_categories_default_department ON complaints_categories(default_department);

CREATE INDEX IF NOT EXISTS idx_users_department_id ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_rfid_number ON users(rfid_number);

CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(complaint_category);
CREATE INDEX IF NOT EXISTS idx_complaints_current_department ON complaints(current_department_assigned);
CREATE INDEX IF NOT EXISTS idx_complaints_current_user ON complaints(current_user_assigned);
CREATE INDEX IF NOT EXISTS idx_complaints_created_by ON complaints(created_by);
CREATE INDEX IF NOT EXISTS idx_complaints_code ON complaints(code);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_categories_updated_at
    BEFORE UPDATE ON complaints_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at
    BEFORE UPDATE ON complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (you can customize these based on your needs)

-- Departments policies
CREATE POLICY "Allow read access to all authenticated users" 
    ON departments FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow insert for super_admin and admin" 
    ON departments FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Allow update for super_admin and admin" 
    ON departments FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'admin')
        )
    );

-- Complaints Categories policies
CREATE POLICY "Allow read access to all authenticated users" 
    ON complaints_categories FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow insert for super_admin and admin" 
    ON complaints_categories FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Allow update for super_admin and admin" 
    ON complaints_categories FOR UPDATE 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'admin')
        )
    );

-- Users policies
CREATE POLICY "Users can read their own data and admins can read all" 
    ON users FOR SELECT 
    TO authenticated 
    USING (
        id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Only super_admin can insert users" 
    ON users FOR INSERT 
    TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'super_admin'
        )
    );

CREATE POLICY "Users can update their own data and admins can update all" 
    ON users FOR UPDATE 
    TO authenticated 
    USING (
        id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'admin')
        )
    );

-- Complaints policies
CREATE POLICY "Allow read access to all authenticated users" 
    ON complaints FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow authenticated users to create complaints" 
    ON complaints FOR INSERT 
    TO authenticated 
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow users to update their own complaints and assigned users" 
    ON complaints FOR UPDATE 
    TO authenticated 
    USING (
        created_by = auth.uid() OR 
        current_user_assigned = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('super_admin', 'admin', 'department_staff')
        )
    );

-- Add comments for documentation
COMMENT ON TABLE departments IS 'Stores department information';
COMMENT ON TABLE complaints_categories IS 'Stores complaint category types';
COMMENT ON TABLE users IS 'Stores user information and authentication data';
COMMENT ON TABLE complaints IS 'Stores complaint/ticket information';

COMMENT ON COLUMN complaints.image_url IS 'URL to complaint attachment image';
COMMENT ON COLUMN complaints.code IS 'Unique complaint tracking code';
COMMENT ON COLUMN users.rfid_number IS 'RFID card number for user identification';

