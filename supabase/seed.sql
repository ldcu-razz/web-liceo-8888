-- Seed file for initial data
-- Run this after applying the initial migration

-- Insert sample departments
INSERT INTO departments (id, name, abbv, description, keywords, status) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Information Technology', 'IT', 'Handles all technology-related issues and maintenance', ARRAY['computer', 'network', 'software', 'hardware', 'internet'], 'active'),
    ('22222222-2222-2222-2222-222222222222', 'Facilities Management', 'FM', 'Manages building facilities and maintenance', ARRAY['building', 'maintenance', 'repair', 'facilities', 'infrastructure'], 'active'),
    ('33333333-3333-3333-3333-333333333333', 'Human Resources', 'HR', 'Handles employee-related concerns', ARRAY['employee', 'staff', 'personnel', 'benefits', 'payroll'], 'active'),
    ('44444444-4444-4444-4444-444444444444', 'Security', 'SEC', 'Handles security and safety concerns', ARRAY['security', 'safety', 'emergency', 'incident', 'access'], 'active'),
    ('55555555-5555-5555-5555-555555555555', 'Administration', 'ADMIN', 'General administrative concerns', ARRAY['admin', 'general', 'inquiry', 'documents', 'records'], 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample complaint categories
INSERT INTO complaints_categories (id, name, default_department, status) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Computer Issues', '11111111-1111-1111-1111-111111111111', 'active'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Network Problems', '11111111-1111-1111-1111-111111111111', 'active'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Building Maintenance', '22222222-2222-2222-2222-222222222222', 'active'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Electrical Issues', '22222222-2222-2222-2222-222222222222', 'active'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Plumbing', '22222222-2222-2222-2222-222222222222', 'active'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Security Concern', '44444444-4444-4444-4444-444444444444', 'active'),
    ('99999999-9999-9999-9999-999999999999', 'General Inquiry', '55555555-5555-5555-5555-555555555555', 'active'),
    ('88888888-8888-8888-8888-888888888888', 'Employee Concern', '33333333-3333-3333-3333-333333333333', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert initial super admin user
-- NOTE: This is a sample password. In production, make sure to:
-- 1. Hash the password properly (bcrypt, argon2, etc.)
-- 2. Change the password immediately after first login
-- Password: Admin123! (You MUST hash this before using in production!)
INSERT INTO users (id, rfid_number, firstname, lastname, sex, birthdate, email, contact_number, username, password, role, department_id) VALUES
    (
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        'ADMIN001',
        'System',
        'Administrator',
        'male',
        '1990-01-01',
        'admin@liceo8888.edu',
        '+63-900-000-0000',
        'admin',
        '$2a$10$YourHashedPasswordHere', -- REPLACE THIS WITH ACTUAL HASHED PASSWORD
        'super_admin',
        '55555555-5555-5555-5555-555555555555'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert sample department staff users
INSERT INTO users (id, rfid_number, firstname, lastname, sex, birthdate, email, contact_number, username, password, role, department_id) VALUES
    (
        'staff001-1111-1111-1111-111111111111',
        'IT001',
        'John',
        'Tech',
        'male',
        '1995-05-15',
        'john.tech@liceo8888.edu',
        '+63-900-111-1111',
        'john.tech',
        '$2a$10$YourHashedPasswordHere', -- REPLACE THIS WITH ACTUAL HASHED PASSWORD
        'department_staff',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        'staff002-2222-2222-2222-222222222222',
        'FM001',
        'Maria',
        'Facilities',
        'female',
        '1992-03-20',
        'maria.facilities@liceo8888.edu',
        '+63-900-222-2222',
        'maria.facilities',
        '$2a$10$YourHashedPasswordHere', -- REPLACE THIS WITH ACTUAL HASHED PASSWORD
        'department_staff',
        '22222222-2222-2222-2222-222222222222'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert a sample regular user
INSERT INTO users (id, rfid_number, firstname, lastname, sex, birthdate, email, contact_number, username, password, role, department_id) VALUES
    (
        'user0001-1111-1111-1111-111111111111',
        'STU001',
        'Juan',
        'Dela Cruz',
        'male',
        '2000-08-10',
        'juan.delacruz@student.liceo8888.edu',
        '+63-900-333-3333',
        'juan.delacruz',
        '$2a$10$YourHashedPasswordHere', -- REPLACE THIS WITH ACTUAL HASHED PASSWORD
        'user',
        '55555555-5555-5555-5555-555555555555'
    )
ON CONFLICT (id) DO NOTHING;

-- Optional: Insert a sample complaint for testing
-- Uncomment if you want to test with sample data
-- INSERT INTO complaints (id, complaint_category, code, subject, description, priority, status, created_by) VALUES
--     (
--         'complaint-1111-1111-1111-111111111111',
--         'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
--         'CMPL-2024-0001',
--         'Computer not starting',
--         'My computer in Room 301 is not starting up. When I press the power button, nothing happens.',
--         'high',
--         'backlog',
--         'user0001-1111-1111-1111-111111111111'
--     )
-- ON CONFLICT (id) DO NOTHING;

-- Verify the data
SELECT 'Departments' as table_name, COUNT(*) as row_count FROM departments
UNION ALL
SELECT 'Complaint Categories', COUNT(*) FROM complaints_categories
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Complaints', COUNT(*) FROM complaints;

