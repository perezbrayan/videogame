-- Insertar desarrolladores populares
INSERT INTO developers (name, website, country) VALUES
('Nintendo', 'https://www.nintendo.com', 'Japón'),
('Sony Interactive Entertainment', 'https://www.sie.com', 'Japón'),
('Electronic Arts', 'https://www.ea.com', 'Estados Unidos'),
('Ubisoft', 'https://www.ubisoft.com', 'Francia'),
('Rockstar Games', 'https://www.rockstargames.com', 'Estados Unidos'),
('Square Enix', 'https://www.square-enix.com', 'Japón'),
('Capcom', 'https://www.capcom.com', 'Japón'),
('Bethesda Softworks', 'https://bethesda.net', 'Estados Unidos'),
('CD Projekt Red', 'https://www.cdprojektred.com', 'Polonia'),
('Activision Blizzard', 'https://www.activisionblizzard.com', 'Estados Unidos'),
('FromSoftware', 'https://www.fromsoftware.jp', 'Japón'),
('Epic Games', 'https://www.epicgames.com', 'Estados Unidos'),
('Valve Corporation', 'https://www.valvesoftware.com', 'Estados Unidos'),
('Bandai Namco', 'https://www.bandainamcoent.com', 'Japón'),
('2K Games', 'https://2k.com', 'Estados Unidos'),
('SEGA', 'https://www.sega.com', 'Japón'),
('Konami', 'https://www.konami.com', 'Japón'),
('BioWare', 'https://www.bioware.com', 'Canadá'),
('Naughty Dog', 'https://www.naughtydog.com', 'Estados Unidos'),
('Insomniac Games', 'https://insomniac.games', 'Estados Unidos')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
website = VALUES(website),
country = VALUES(country);
