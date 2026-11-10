CREATE DATABASE IF NOT EXISTS rastreo_ambiental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rastreo_ambiental;

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(30),
  direccion VARCHAR(255),
  tipo_usuario ENUM('ciudadano','funcionario','administrador','conductor') NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ciudadano (
  id_ciudadano INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS funcionario (
  id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  cargo VARCHAR(100),
  dependencia VARCHAR(100),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS administrador (
  id_administrador INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  nivel_acceso VARCHAR(30) DEFAULT 'basico',
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conductor (
  id_conductor INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  num_documento VARCHAR(50),
  licencia VARCHAR(50),
  vehiculo_asignado VARCHAR(100),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);
