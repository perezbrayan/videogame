-- Crear tabla de desarrolladores
CREATE TABLE IF NOT EXISTS developers (
    developer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    country VARCHAR(100)
);

-- Crear tabla de plataformas
CREATE TABLE IF NOT EXISTS platforms (
    platform_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100)
);

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Crear tabla de juegos
CREATE TABLE IF NOT EXISTS games (
    game_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    developer_id INT,
    release_date DATE,
    base_price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (developer_id) REFERENCES developers(developer_id)
);

-- Crear tabla de relación juegos-plataformas
CREATE TABLE IF NOT EXISTS game_platforms (
    game_id INT,
    platform_id INT,
    price DECIMAL(10,2),
    PRIMARY KEY (game_id, platform_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(platform_id)
);

-- Crear tabla de relación juegos-categorías
CREATE TABLE IF NOT EXISTS game_categories (
    game_id INT,
    category_id INT,
    PRIMARY KEY (game_id, category_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Insertar algunas plataformas básicas
INSERT IGNORE INTO platforms (name, manufacturer) VALUES
('PC', 'Multiple'),
('PlayStation 5', 'Sony'),
('Xbox Series X', 'Microsoft'),
('Nintendo Switch', 'Nintendo');

-- Insertar algunas categorías básicas
INSERT IGNORE INTO categories (name, description) VALUES
('Acción', 'Juegos que requieren coordinación y reflejos rápidos'),
('Aventura', 'Juegos centrados en la exploración y resolución de puzzles'),
('RPG', 'Juegos de rol con desarrollo de personajes'),
('Deportes', 'Juegos basados en deportes reales'),
('Estrategia', 'Juegos que requieren pensamiento táctico y planificación');

-- Insertar algunos desarrolladores de ejemplo
INSERT IGNORE INTO developers (name, country) VALUES
('Electronic Arts', 'Estados Unidos'),
('Ubisoft', 'Francia'),
('Nintendo', 'Japón'),
('CD Projekt Red', 'Polonia'),
('Rockstar Games', 'Estados Unidos');
