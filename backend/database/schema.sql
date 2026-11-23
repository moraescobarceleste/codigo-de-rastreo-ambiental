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

-- Sesiones de express-session (persisten entre reinicios del servidor)
CREATE TABLE IF NOT EXISTS sesion (
  sid VARCHAR(128) PRIMARY KEY,
  data TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  INDEX idx_sesion_expires (expires_at)
);

-- ============================================================
-- Módulos operativos: camiones, rutas, asignaciones, reportes
-- (todas las relaciones con llave foránea para garantizar integridad)
-- ============================================================

CREATE TABLE IF NOT EXISTS camion (
  id_camion INT AUTO_INCREMENT PRIMARY KEY,
  placa VARCHAR(10) NOT NULL UNIQUE,
  modelo VARCHAR(100) NOT NULL,
  capacidad_kg INT,
  estado ENUM('activo','mantenimiento','inactivo') NOT NULL DEFAULT 'activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ruta (
  id_ruta INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  estado ENUM('activa','inactiva') NOT NULL DEFAULT 'activa',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS punto_ruta (
  id_punto INT AUTO_INCREMENT PRIMARY KEY,
  id_ruta INT NOT NULL,
  orden INT NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  latitud DECIMAL(10,7),
  longitud DECIMAL(10,7),
  UNIQUE KEY uq_punto_orden (id_ruta, orden),
  FOREIGN KEY (id_ruta) REFERENCES ruta(id_ruta) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS asignacion_ruta (
  id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
  id_ruta INT NOT NULL,
  id_camion INT NOT NULL,
  id_conductor INT NOT NULL,
  id_usuario_asigna INT NULL,
  fecha DATE NOT NULL,
  estado ENUM('programada','en_curso','completada','cancelada') NOT NULL DEFAULT 'programada',
  -- Un camión y un conductor no pueden tener dos rutas el mismo día
  UNIQUE KEY uq_camion_fecha (id_camion, fecha),
  UNIQUE KEY uq_conductor_fecha (id_conductor, fecha),
  FOREIGN KEY (id_ruta) REFERENCES ruta(id_ruta) ON DELETE RESTRICT,
  FOREIGN KEY (id_camion) REFERENCES camion(id_camion) ON DELETE RESTRICT,
  FOREIGN KEY (id_conductor) REFERENCES conductor(id_conductor) ON DELETE RESTRICT,
  FOREIGN KEY (id_usuario_asigna) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reporte (
  id_reporte INT AUTO_INCREMENT PRIMARY KEY,
  id_ciudadano INT NOT NULL,
  id_funcionario INT NULL,
  tipo ENUM('acumulacion','recoleccion_omitida','punto_critico','otro') NOT NULL DEFAULT 'otro',
  descripcion TEXT NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  latitud DECIMAL(10,7),
  longitud DECIMAL(10,7),
  estado ENUM('recibido','en_revision','resuelto','descartado') NOT NULL DEFAULT 'recibido',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_ciudadano) REFERENCES ciudadano(id_ciudadano) ON DELETE CASCADE,
  FOREIGN KEY (id_funcionario) REFERENCES funcionario(id_funcionario) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ubicacion (
  id_ubicacion INT AUTO_INCREMENT PRIMARY KEY,
  id_asignacion INT NOT NULL,
  latitud DECIMAL(10,7) NOT NULL,
  longitud DECIMAL(10,7) NOT NULL,
  registrada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ubicacion_asignacion (id_asignacion, registrada_en),
  FOREIGN KEY (id_asignacion) REFERENCES asignacion_ruta(id_asignacion) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recoleccion (
  id_recoleccion INT AUTO_INCREMENT PRIMARY KEY,
  id_asignacion INT NOT NULL,
  id_reporte INT NULL,
  toneladas DECIMAL(8,2) NOT NULL,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_asignacion) REFERENCES asignacion_ruta(id_asignacion) ON DELETE RESTRICT,
  FOREIGN KEY (id_reporte) REFERENCES reporte(id_reporte) ON DELETE SET NULL
);
