import { useState, useContext } from "react";
import userService from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await userService.login(usuario, password);

      login(data.usuario, data.token);

      setSuccess("Inicio de sesión exitoso. Redirigiendo...");
    
      setTimeout(() => {
        navigate("/");
        }, 1500);

    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Faltan datos. Completa todos los campos.");
            break;
          case 401:
            setError("Credenciales incorrectas.");
            break;
          case 500:
            setError("Error en el servidor. Intenta más tarde.");
            break;
          default:
            setError("Error desconocido.");
        }
      } else {
        setError("No se pudo conectar al servidor.");
      }
    }
  };

    return (
    <div className="divLogin">
      <h2 className="LoginTitle">Iniciar sesión</h2>

      {error && <p className="errorMessage">{error}</p>}
      {success && <p className="successMessage">{success}</p>}

      <form onSubmit={handleSubmit} className="loginForm">
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="placeholderUser"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="placeholderPassword"
          required
        />
        <button
          type="submit"
          className="submitButton"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
