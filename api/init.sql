-- Create the PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the admin user if it doesn't exist
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'admin') THEN

      CREATE USER admin WITH PASSWORD 'password';
   END IF;
END
$do$;

-- Grant privileges
ALTER USER admin WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE snappoint TO admin; 