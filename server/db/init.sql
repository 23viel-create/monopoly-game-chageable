-- Database schema
-- Safe to run multiple times (IF NOT EXISTS): existing tables and data are kept.
-- gen_random_uuid() is built into PostgreSQL 13+.

-- Step 2.1: User Management
CREATE TABLE IF NOT EXISTS users (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username           VARCHAR(50) NOT NULL,
    email              VARCHAR(255) UNIQUE NOT NULL,
    password_hash      VARCHAR(255) NOT NULL,
    is_verified        BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(10) DEFAULT 'he',
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3.1: Games created with the Game Creator wizard.
-- board_data holds the board layout (tiles, cards, assets) as JSONB.
CREATE TABLE IF NOT EXISTS games (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL,
    board_data JSONB DEFAULT '{}'::jsonb,
    status     VARCHAR(20) DEFAULT 'draft'
               CONSTRAINT games_status_check CHECK (status IN ('draft', 'published')),
    join_code  VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bring games tables created before these constraints existed up to date
ALTER TABLE games ALTER COLUMN user_id SET NOT NULL;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'games_status_check') THEN
        ALTER TABLE games ADD CONSTRAINT games_status_check CHECK (status IN ('draft', 'published'));
    END IF;
END $$;

-- Postgres does not index foreign keys automatically; this speeds up "my games" lookups
CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id);
