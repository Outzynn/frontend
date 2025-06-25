import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  userService  from "../services/userService";

export default function Register(){
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validarDatos = () => {
    const errores = [];

    if (!nombre || nombre.length > 30) {
      errores.push("El nombre no puede estar vacío y debe tener hasta 30 caracteres.");
    }

    const usuarioRegex = /^[a-zA-Z0-9]{6,20}$/;
    if (!usuarioRegex.test(usuario)) {
      errores.push("El usuario debe ser alfanumérico y tener entre 6 y 20 caracteres.");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      errores.push("La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas, números y caracteres especiales.");
    }

    return errores;
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errores = validarDatos();

    if (errores.length > 0) {
      setError(errores.join("\n"));
      return;
    }

    try{
      const response = await userService.register(nombre, usuario, password);
      setSuccess(response.mensaje);
      setTimeout(() => navigate("/login"), 2000);

    }catch (err) {
    if (err.response) {
      const { status, data } = err.response;

      switch (status) {
        case 400:
          setError(data.error || "Datos inválidos. Verifica los campos.");
          break;
        case 409:
          setError("Ese nombre de usuario ya está registrado.");
          break;
        case 500:
          setError("Error del servidor. Intenta más tarde.");
          break;
        default:
          setError("Ocurrió un error desconocido.");
      }
    } else {
      setError("No se pudo conectar al servidor.");
    }
  }
  };

  return (
    <div className="divRegister">
      <h2 className="RegisterTitle">Registro de usuario</h2>

      {success && <p className="successMessage">{success}</p>}
      {error && <p className="errorMessage">{error}</p>}

      <form onSubmit={handleSubmit} className="registerForm">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="placeholderName"
          required
        />
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
        <button type="submit" className="submitButton">
          Registrarse
        </button>
      </form>
    </div>
  );
}