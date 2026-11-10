import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/ambiental2.png";
import { register } from "../../services/api";

type Role = "" | "ciudadano" | "funcionario" | "administrador" | "conductor";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("");
  const [form, setForm] = useState<Record<string, string>>({
    nombre: "", apellido: "", correo: "", password: "", telefono: "", direccion: "",
    num_documento: "", licencia: "", vehiculo_asignado: "", cargo: "", dependencia: "",
    nivel_acceso: "basico",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update(name: string, value: string) {
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await register({ ...form, tipo_usuario: role });
      setMessage("Registro realizado correctamente.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el usuario.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="logo-area">
          <img src={logo} alt="Logo" />
          <h1>RASTREO AMBIENTAL</h1>
          <p>Crear nueva cuenta</p>
        </div>

        <form className="auth-form register-form" onSubmit={handleSubmit}>
          <input placeholder="Nombre" value={form.nombre} onChange={e => update("nombre", e.target.value)} required />
          <input placeholder="Apellido" value={form.apellido} onChange={e => update("apellido", e.target.value)} required />
          <input type="email" placeholder="Correo electrónico" value={form.correo} onChange={e => update("correo", e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={form.password} onChange={e => update("password", e.target.value)} required />
          <input placeholder="Teléfono" value={form.telefono} onChange={e => update("telefono", e.target.value)} />
          <input placeholder="Dirección" value={form.direccion} onChange={e => update("direccion", e.target.value)} />

          <select value={role} onChange={e => setRole(e.target.value as Role)} required>
            <option value="">Seleccione tipo de usuario</option>
            <option value="ciudadano">Ciudadano</option>
            <option value="funcionario">Funcionario</option>
            <option value="administrador">Administrador</option>
            <option value="conductor">Conductor</option>
          </select>

          {role === "conductor" && (
            <div className="extra-fields">
              <input placeholder="Número documento" value={form.num_documento} onChange={e => update("num_documento", e.target.value)} required />
              <input placeholder="Número licencia" value={form.licencia} onChange={e => update("licencia", e.target.value)} required />
              <input placeholder="Vehículo asignado" value={form.vehiculo_asignado} onChange={e => update("vehiculo_asignado", e.target.value)} required />
            </div>
          )}

          {role === "funcionario" && (
            <div className="extra-fields">
              <input placeholder="Cargo" value={form.cargo} onChange={e => update("cargo", e.target.value)} required />
              <input placeholder="Dependencia" value={form.dependencia} onChange={e => update("dependencia", e.target.value)} required />
            </div>
          )}

          {role === "administrador" && (
            <div className="extra-fields">
              <select value={form.nivel_acceso} onChange={e => update("nivel_acceso", e.target.value)}>
                <option value="basico">Acceso Básico</option>
                <option value="medio">Acceso Medio</option>
                <option value="super">Acceso Super</option>
              </select>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <button type="submit">CREAR CUENTA</button>

          <div className="register-link">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
