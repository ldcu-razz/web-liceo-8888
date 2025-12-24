-- Useful SQL Queries for Liceo-8888 Database
-- Copy and paste these in Supabase SQL Editor as needed

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Count rows in all tables
SELECT 'Departments' as table_name, COUNT(*) as row_count FROM departments
UNION ALL
SELECT 'Complaint Categories', COUNT(*) FROM complaints_categories
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Complaints', COUNT(*) FROM complaints;

-- Check all indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================================================
-- DATA QUERIES
-- ============================================================================

-- Get all active departments with count of users
SELECT 
    d.id,
    d.name,
    d.abbv,
    d.status,
    COUNT(u.id) as user_count
FROM departments d
LEFT JOIN users u ON d.id = u.department_id
WHERE d.status = 'active'
GROUP BY d.id, d.name, d.abbv, d.status
ORDER BY d.name;

-- Get complaints with full details
SELECT 
    c.id,
    c.code,
    c.subject,
    c.status,
    c.priority,
    cc.name as category_name,
    u.firstname || ' ' || u.lastname as created_by_name,
    d.name as assigned_department,
    au.firstname || ' ' || au.lastname as assigned_user_name,
    c.created_at
FROM complaints c
JOIN complaints_categories cc ON c.complaint_category = cc.id
JOIN users u ON c.created_by = u.id
LEFT JOIN departments d ON c.current_department_assigned = d.id
LEFT JOIN users au ON c.current_user_assigned = au.id
ORDER BY c.created_at DESC;

-- Get users with their departments
SELECT 
    u.id,
    u.username,
    u.firstname,
    u.lastname,
    u.email,
    u.role,
    d.name as department_name,
    d.abbv as department_abbv
FROM users u
JOIN departments d ON u.department_id = d.id
ORDER BY u.role, u.lastname, u.firstname;

-- Get complaint statistics by status
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM complaints
GROUP BY status
ORDER BY count DESC;

-- Get complaint statistics by priority
SELECT 
    priority,
    COUNT(*) as count
FROM complaints
GROUP BY priority
ORDER BY 
    CASE priority
        WHEN 'highest' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
        WHEN 'lowest' THEN 5
    END;

-- Get department workload
SELECT 
    d.name as department,
    COUNT(c.id) as total_complaints,
    COUNT(CASE WHEN c.status NOT IN ('done', 'archived') THEN 1 END) as active_complaints,
    COUNT(CASE WHEN c.status = 'done' THEN 1 END) as completed_complaints
FROM departments d
LEFT JOIN complaints c ON d.id = c.current_department_assigned
GROUP BY d.id, d.name
ORDER BY active_complaints DESC;

-- Get user workload
SELECT 
    u.firstname || ' ' || u.lastname as user_name,
    u.role,
    d.name as department,
    COUNT(c.id) as assigned_complaints,
    COUNT(CASE WHEN c.status NOT IN ('done', 'archived') THEN 1 END) as active_complaints
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN complaints c ON u.id = c.current_user_assigned
WHERE u.role IN ('department_staff', 'admin', 'super_admin')
GROUP BY u.id, u.firstname, u.lastname, u.role, d.name
ORDER BY active_complaints DESC;

-- ============================================================================
-- MAINTENANCE QUERIES
-- ============================================================================

-- Find orphaned records (should return 0 rows if everything is OK)

-- Users without valid departments (should be 0)
SELECT * FROM users u
WHERE NOT EXISTS (SELECT 1 FROM departments d WHERE d.id = u.department_id);

-- Complaints without valid categories (should be 0)
SELECT * FROM complaints c
WHERE NOT EXISTS (SELECT 1 FROM complaints_categories cc WHERE cc.id = c.complaint_category);

-- Complaints without valid creators (should be 0)
SELECT * FROM complaints c
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = c.created_by);

-- ============================================================================
-- CLEANUP QUERIES (Use with caution!)
-- ============================================================================

-- Archive old completed complaints (older than 1 year)
-- UNCOMMENT TO USE:
-- UPDATE complaints
-- SET status = 'archived'
-- WHERE status = 'done' 
-- AND created_at < NOW() - INTERVAL '1 year';

-- Soft delete inactive departments with no users
-- UNCOMMENT TO USE:
-- UPDATE departments
-- SET status = 'archived'
-- WHERE status = 'inactive'
-- AND NOT EXISTS (SELECT 1 FROM users WHERE department_id = departments.id);

-- ============================================================================
-- PERFORMANCE QUERIES
-- ============================================================================

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

-- Check query performance on complaints table
EXPLAIN ANALYZE
SELECT * FROM complaints 
WHERE status = 'in_progress'
AND priority IN ('high', 'highest')
ORDER BY created_at DESC
LIMIT 10;

-- ============================================================================
-- RESET QUERIES (Development only - BE VERY CAREFUL!)
-- ============================================================================

-- DANGER: These will delete all data!
-- Only use in development environments
-- Uncomment carefully:

-- Clear all complaints
-- DELETE FROM complaints;

-- Clear all users (except system users)
-- DELETE FROM users WHERE role NOT IN ('super_admin');

-- Clear all complaint categories
-- DELETE FROM complaints_categories;

-- Clear all departments (will fail if users exist due to foreign key)
-- DELETE FROM departments;

-- Reset auto-increment sequences (if using serial instead of UUID)
-- ALTER SEQUENCE departments_id_seq RESTART WITH 1;

-- ============================================================================
-- RLS POLICY QUERIES
-- ============================================================================

-- View all RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Disable RLS on all tables (Development only!)
-- UNCOMMENT TO USE:
-- ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE complaints_categories DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE complaints DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS on all tables
-- UNCOMMENT TO USE:
-- ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE complaints_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

