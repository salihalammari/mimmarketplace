-- Drop existing tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS public.verifications CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.sellers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

