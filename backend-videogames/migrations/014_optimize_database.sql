-- Optimizar la tabla games
ALTER TABLE games
  MODIFY COLUMN title VARCHAR(255) NOT NULL,
  MODIFY COLUMN platform ENUM('ps5', 'xbox', 'pc', 'switch') NOT NULL DEFAULT 'pc',
  MODIFY COLUMN base_price DECIMAL(10,2) NOT NULL,
  MODIFY COLUMN stock INT NOT NULL DEFAULT 0,
  MODIFY COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  MODIFY COLUMN release_date DATE NOT NULL;

-- Asegurar que las claves foráneas tengan índices
ALTER TABLE games
  ADD CONSTRAINT fk_developer FOREIGN KEY (developer_id) REFERENCES developers(developer_id),
  ADD INDEX idx_title (title),
  ADD INDEX idx_platform_price (platform, base_price),
  ADD INDEX idx_release_date (release_date);

-- Optimizar la tabla developers
ALTER TABLE developers
  MODIFY COLUMN name VARCHAR(255) NOT NULL,
  ADD UNIQUE INDEX idx_developer_name (name); 