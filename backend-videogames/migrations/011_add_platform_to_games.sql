-- Desactivar temporalmente el modo seguro
SET SQL_SAFE_UPDATES = 0;

-- Verificar si la columna platform existe y si no, crearla
SET @exist := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'games'
    AND COLUMN_NAME = 'platform'
);

SET @query = IF(
    @exist = 0,
    'ALTER TABLE games ADD COLUMN platform ENUM("ps5", "xbox", "pc", "switch") DEFAULT "pc"',
    'SELECT "Column platform already exists"'
);

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Actualizar los juegos existentes con una plataforma por defecto usando el ID
UPDATE games SET platform = 'pc' WHERE platform IS NULL AND game_id > 0;

-- Reactivar el modo seguro
SET SQL_SAFE_UPDATES = 1; 