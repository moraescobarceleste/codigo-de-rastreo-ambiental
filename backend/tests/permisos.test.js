// Pruebas de autorización y validación (no requieren base de datos:
// todas las respuestas se deciden antes de consultar MySQL).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import express from "express";

import routes from "../src/routes/index.js";
import { errorHandler, notFound } from "../src/middlewares/errorHandler.js";

let server;
let base;

before(async () => {
  const app = express();
  app.use(express.json());
  // Simula la sesión: el rol llega en la cabecera x-rol (solo para pruebas)
  app.use((req, _res, next) => {
    const rol = req.get("x-rol");
    req.session = rol ? { user: { id_usuario: 1, nombre: "Prueba", tipo_usuario: rol } } : {};
    next();
  });
  app.use("/api", routes);
  app.use(notFound);
  app.use(errorHandler);

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(() => server.close());

async function llamar(metodo, ruta, { rol, cuerpo, raw } = {}) {
  const res = await fetch(`${base}${ruta}`, {
    method: metodo,
    headers: { "Content-Type": "application/json", ...(rol ? { "x-rol": rol } : {}) },
    body: raw ?? (cuerpo ? JSON.stringify(cuerpo) : undefined),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

// ---------- Autenticación ----------
test("sin sesión, los módulos devuelven 401", async () => {
  for (const ruta of ["/camiones", "/rutas", "/asignaciones", "/reportes"]) {
    const { status } = await llamar("GET", ruta);
    assert.equal(status, 401, `GET ${ruta}`);
  }
});

// ---------- Autorización por rol ----------
test("camiones: solo el administrador crea, edita o elimina", async () => {
  const cuerpo = { placa: "ABC123", modelo: "Hino 500" };
  for (const rol of ["ciudadano", "conductor", "funcionario"]) {
    assert.equal((await llamar("POST", "/camiones", { rol, cuerpo })).status, 403, `POST como ${rol}`);
    assert.equal((await llamar("PUT", "/camiones/1", { rol, cuerpo })).status, 403, `PUT como ${rol}`);
    assert.equal((await llamar("DELETE", "/camiones/1", { rol })).status, 403, `DELETE como ${rol}`);
  }
});

test("camiones: el ciudadano no puede ni listar", async () => {
  assert.equal((await llamar("GET", "/camiones", { rol: "ciudadano" })).status, 403);
});

test("rutas: el conductor y el ciudadano no pueden gestionar", async () => {
  for (const rol of ["ciudadano", "conductor"]) {
    assert.equal((await llamar("POST", "/rutas", { rol, cuerpo: { nombre: "Ruta 1" } })).status, 403);
  }
  assert.equal((await llamar("DELETE", "/rutas/1", { rol: "funcionario" })).status, 403);
});

test("asignaciones: el ciudadano no accede", async () => {
  assert.equal((await llamar("GET", "/asignaciones", { rol: "ciudadano" })).status, 403);
  assert.equal((await llamar("POST", "/asignaciones", { rol: "conductor", cuerpo: {} })).status, 403);
});

test("reportes: solo el ciudadano crea; solo funcionario/admin cambian el estado", async () => {
  const cuerpo = { descripcion: "Basura acumulada", direccion: "Calle 1 # 2-3" };
  assert.equal((await llamar("POST", "/reportes", { rol: "funcionario", cuerpo })).status, 403);
  assert.equal((await llamar("POST", "/reportes", { rol: "conductor", cuerpo })).status, 403);
  assert.equal((await llamar("PATCH", "/reportes/1/estado", { rol: "ciudadano", cuerpo: { estado: "resuelto" } })).status, 403);
});

// ---------- Validación de datos ----------
test("camiones: rechaza placa inválida y campos faltantes", async () => {
  const placaMala = await llamar("POST", "/camiones", { rol: "administrador", cuerpo: { placa: "12", modelo: "X" } });
  assert.equal(placaMala.status, 400);
  assert.match(placaMala.data.message, /placa/i);

  const sinModelo = await llamar("POST", "/camiones", { rol: "administrador", cuerpo: { placa: "ABC123" } });
  assert.equal(sinModelo.status, 400);

  const estadoMalo = await llamar("POST", "/camiones", {
    rol: "administrador",
    cuerpo: { placa: "ABC123", modelo: "X", estado: "volando" },
  });
  assert.equal(estadoMalo.status, 400);
});

test("camiones: rechaza id no numérico", async () => {
  const { status } = await llamar("DELETE", "/camiones/abc", { rol: "administrador" });
  assert.equal(status, 400);
});

test("rutas: exige nombre y puntos bien formados", async () => {
  assert.equal((await llamar("POST", "/rutas", { rol: "administrador", cuerpo: {} })).status, 400);
  const puntoMalo = await llamar("POST", "/rutas", {
    rol: "administrador",
    cuerpo: { nombre: "R1", puntos: [{ direccion: "Calle 1", latitud: 999 }] },
  });
  assert.equal(puntoMalo.status, 400);
});

test("asignaciones: valida el formato de la fecha", async () => {
  const { status, data } = await llamar("POST", "/asignaciones", {
    rol: "administrador",
    cuerpo: { id_ruta: 1, id_camion: 1, id_conductor: 1, fecha: "mañana" },
  });
  assert.equal(status, 400);
  assert.match(data.message, /fecha/i);
});

test("reportes: valida el estado antes de actualizar", async () => {
  const { status } = await llamar("PATCH", "/reportes/1/estado", { rol: "administrador", cuerpo: { estado: "inventado" } });
  assert.equal(status, 400);
});

// ---------- Robustez general ----------
test("un JSON mal formado devuelve 400 y no 500", async () => {
  const { status } = await llamar("POST", "/camiones", { rol: "administrador", raw: "{no es json" });
  assert.equal(status, 400);
});

test("una ruta inexistente devuelve 404", async () => {
  assert.equal((await llamar("GET", "/no-existe", { rol: "administrador" })).status, 404);
});
