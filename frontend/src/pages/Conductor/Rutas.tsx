import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { asignacionesApi, formatearFecha, type Asignacion, type EstadoAsignacion } from "../../services/api";

// Siguiente paso permitido para el conductor en cada estado
const SIGUIENTE: Partial<Record<EstadoAsignacion, { estado: EstadoAsignacion; texto: string }>> = {
  programada: { estado: "en_curso", texto: "Iniciar ruta" },
  en_curso: { estado: "completada", texto: "Finalizar ruta" },
};

export default function RutasConductor() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    asignacionesApi
      .listar()
      .then(setAsignaciones)
      .catch((e) => setError(e instanceof Error ? e.message : "No se pudieron cargar tus rutas."))
      .finally(() => setCargando(false));
  }, []);

  async function avanzar(a: Asignacion, estado: EstadoAsignacion) {
    setError("");
    try {
      const actualizada = await asignacionesApi.cambiarEstado(a.id_asignacion, estado);
      setAsignaciones((prev) => prev.map((x) => (x.id_asignacion === a.id_asignacion ? actualizada : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar la ruta.");
    }
  }

  return (
    <div className="page-container">
      <Link to="/conductor/dashboard" className="btn btn-dark">Volver</Link>
      <h2 className="page-title">Mis rutas asignadas</h2>
      {error && <p className="error-message">{error}</p>}
      {cargando && <p>Cargando rutas...</p>}
      {!cargando && asignaciones.length === 0 && !error && <p>No tienes rutas asignadas.</p>}
      {asignaciones.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Fecha</th><th>Ruta</th><th>Camión</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              {asignaciones.map((a) => {
                const paso = SIGUIENTE[a.estado];
                return (
                  <tr key={a.id_asignacion}>
                    <td>{formatearFecha(a.fecha)}</td>
                    <td>{a.ruta}</td>
                    <td>{a.placa}</td>
                    <td>{a.estado.replace("_", " ")}</td>
                    <td>
                      {paso ? (
                        <button className="btn btn-success btn-sm" onClick={() => avanzar(a, paso.estado)}>{paso.texto}</button>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
