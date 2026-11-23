import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { conductoresApi, type Conductor } from "../../services/api";

export default function Conductores() {
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    conductoresApi
      .listar()
      .then(setConductores)
      .catch((e) => setError(e instanceof Error ? e.message : "No se pudieron cargar los conductores."))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="page-container">
      <Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link>
      <h2 className="page-title">Conductores</h2>
      {error && <p className="error-message">{error}</p>}
      {cargando && <p>Cargando conductores...</p>}
      {!cargando && conductores.length === 0 && !error && (
        <p>No hay conductores registrados. Se crean desde el registro eligiendo el rol conductor.</p>
      )}
      {conductores.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Documento</th><th>Licencia</th></tr></thead>
            <tbody>
              {conductores.map((c) => (
                <tr key={c.id_conductor}>
                  <td>{c.nombre}</td><td>{c.correo}</td><td>{c.telefono ?? "—"}</td>
                  <td>{c.num_documento ?? "—"}</td><td>{c.licencia ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
