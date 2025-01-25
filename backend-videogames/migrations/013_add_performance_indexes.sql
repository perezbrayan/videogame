-- Agregar índices para mejorar el rendimiento
ALTER TABLE games ADD INDEX idx_platform (platform);
ALTER TABLE games ADD INDEX idx_developer_id (developer_id);
ALTER TABLE developers ADD INDEX idx_name (name); 