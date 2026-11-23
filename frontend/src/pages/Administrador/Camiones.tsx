import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { camionesApi, type Camion, type EstadoCamion } from "../../services/api";

const ESTADOS: EstadoCamion[] = ["activo", "mantenimiento", "inactivo"];
const FORM_VACIO = { placa: "", modelo: "", capacidad_kg: "", estado: "activo" as EstadoCamion };

export default function Camiones() {
  const [form, setForm] = useState(FORM_VACIO);
  const [camiones, setCamiones] = useState<Camion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    try {
      setCamiones(await camionesApi.listar());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar los camiones.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function agregar(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const nuevo = await camionesApi.crear({
        placa: form.placa,
        modelo: form.modelo,
        capacidad_kg: form.capacidad_kg ? Number(form.capacidad_kg) : null,
        estado: form.estado,
      });
      setCamiones((prev) => [nuevo, ...prev]);
      setForm(FORM_VACIO);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el camión.");
    }
  }

  async function cambiarEstado(c: Camion) {
    const siguiente = ESTADOS[(ESTADOS.indexOf(c.estado) + 1) % ESTADOS.length];
    try {
      const { id_camion, ...datos } = c;
      const actualizado = await camionesApi.actualizar(id_camion, { ...datos, estado: siguiente });
      setCamiones((prev) => prev.map((x) => (x.id_camion === id_camion ? actualizado : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar el estado.");
    }
  }

  async function eliminar(c: Camion) {
    if (!window.confirm(`¿Eliminar el camión ${c.placa}?`)) return;
    try {
      await camionesApi.eliminar(c.id_camion);
      setCamiones((prev) => prev.filter((x) => x.id_camion !== c.id_camion));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar el camión.");
    }
  }

  return (
    <div className="page-container">
      <Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link>
      <h2 className="page-title">Gestión de camiones</h2>

      <form className="card form-card" onSubmit={agregar}>
        <input className="form-control" placeholder="Placa (ABC123)" value={form.placa} maxLength={6}
          onChange={(e) => setForm({ ...form, placa: e.target.value.toUpperCase() })} required />
        <input className="form-control" placeholder="Modelo" value={form.modelo}
          onChange={(e) => setForm({ ...form, modelo: e.target.value })} required />
        <input className="form-control" type="number" min={1} placeholder="Capacidad (kg)" value={form.capacidad_kg}
          onChange={(e) => setForm({ ...form, capacidad_kg: e.target.value })} />
        <select className="form-control" value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoCamion })}>
          {ESTADOS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-success" type="submit">Agregar</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {cargando && <p>Cargando camiones...</p>}
      {!cargando && camiones.length === 0 && !error && <p>Aún no hay camiones registrados.</p>}

      {camiones.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Placa</th><th>Modelo</th><th>Capacidad (kg)</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {camiones.map((c) => (
                <tr key={c.id_camion}>
                  <td>{c.placa}</td>
                  <td>{c.modelo}</td>
                  <td>{c.capacidad_kg ?? "—"}</td>
                  <td>{c.estado}</td>
                  <td>
                    <button className="btn btn-warning btn-sm" onClick={() => cambiarEstado(c)}>Cambiar estado</button>{" "}
                    <button className="btn btn-danger btn-sm" onClick={() => eliminar(c)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
