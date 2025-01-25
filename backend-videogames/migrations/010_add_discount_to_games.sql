-- Up Migration
ALTER TABLE games
ADD COLUMN discount_percentage INTEGER DEFAULT 0;

-- Down Migration
ALTER TABLE games
DROP COLUMN discount_percentage;
