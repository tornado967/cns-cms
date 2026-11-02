-- Run as the project owner on the NEW, dedicated Supabase project only.
-- Does not modify public/auth/storage schemas or store a password.
BEGIN;
CREATE ROLE cns_cms NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
CREATE SCHEMA cns_cms AUTHORIZATION cns_cms;
REVOKE ALL ON SCHEMA cns_cms FROM PUBLIC, anon, authenticated, service_role;
ALTER ROLE cns_cms SET search_path TO cns_cms;
ALTER DEFAULT PRIVILEGES FOR ROLE cns_cms IN SCHEMA cns_cms
  REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE cns_cms IN SCHEMA cns_cms
  REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE cns_cms
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
COMMIT;
-- Separately enable LOGIN and set a randomly generated password using the
-- provider's secure administration workflow. Never commit that password.
-- Do not add cns_cms to Data API exposed schemas or grant it other roles.
