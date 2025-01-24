-- Modificar la tabla developers para agregar el campo created_at
ALTER TABLE developers
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
