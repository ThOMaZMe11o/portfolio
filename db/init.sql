CREATE DATABASE IF NOT EXISTS meubanco;
USE meubanco;

CREATE TABLE IF NOT EXISTS home (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    subtitulo TEXT
);

INSERT INTO home (titulo, subtitulo)
VALUES ('Thomaz Mello', 'Desenvolvedor Fullstack apaixonado por tecnologia');

CREATE TABLE IF NOT EXISTS projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    descricao TEXT
);
