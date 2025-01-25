CREATE TABLE IF NOT EXISTS featured_games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    position INT DEFAULT 0,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);
