-- Initial database setup for ConvoForms
-- This script runs when PostgreSQL container starts for the first time

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance (will be handled by Drizzle migrations)
-- This file is mainly for ensuring the database is properly initialized
