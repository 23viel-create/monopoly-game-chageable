-- Step 2.1: User Management schema
-- Safe to run multiple times (IF NOT EXISTS).
-- gen_random_uuid() is built into PostgreSQL 13+.

CREATE TABLE IF NOT EXISTS users (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email              VARCHAR(255) UNIQUE NOT NULL,
    password_hash      VARCHAR(255) NOT NULL,
    is_verified        BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(10) DEFAULT 'he',
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
