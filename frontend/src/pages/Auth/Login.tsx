import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/ambiental2.png";

export default function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      correo === "admin@rastreo.com" &&
      password === "123456"
    ) {
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          nombre: "Administrador",
          correo: "admin@rastreo.com",
          tipo_usuario: "administrador",
        })
      );

      navigate("/administrador/dashboard");
      return;
    }

    setError("Correo o contraseña incorrectos");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-area">
          <img src={logo} alt="Logo" />
          <h1>RASTREO AMBIENTAL</h1>
          <p>Crear nueva cuenta</p>
        </div>

        <h1>Iniciar sesión</h1>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div>
            <label htmlFor="correo">
              Correo electrónico
            </label>

            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
          </div>

          <div>
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Iniciar sesión
          </button>

        </form>

      </div>
    </div>
  );
}