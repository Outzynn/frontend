import { useState} from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function EditUser(){
    const { usuario } = useContext(AuthContext);
    const { editName } = useContext(AuthContext);
    const [nameUser, setNameUser] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const validarDatos = () => {
        const errores = [];

        if(!nameUser || nameUser.length > 30){
            errores.push("El nombre de usuario no puede ser vacío y debe tener como máximo 30 caracteres. ")
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if(!passwordRegex.test(password)){
            errores.push("La password tiene que tener por lo menos 8 caracteres y que tenga mayúsculas, minúsculas, números y caracteres especiales.");
        }

        if(password != confirmPassword){
            errores.push("Las contraseñas no coinciden.")
        }

        return errores;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const errores = validarDatos()
        if(errores.length > 0){
            setError(errores.join("\n"));
            return
        }

        try{
            const response = await userService.edit(usuario.id,nameUser,password);
            setSuccess(response.mensaje);
            editName(nameUser);
            setTimeout(() => navigate("/"), 1000);

        }catch (err){
            if(err.response){
                const {status,data} = err.response;

                switch(status){
                    case 401:
                        setError(data.error || "No tienes permiso para editar este usuario");
                        break;
                    case 400:
                        setError(data.error || "Faltan datos o formato incorrecto.");
                        break;
                    default:
                        setError(data.error || " Error al actualizar el usuario");
                        
                }
            }else{
                setError("No se pudo conectar al servidor");
            }
        }
    }
    return (
  <>
    {!usuario ? (
      <div className="divUserEdit">
        <h2 className="titleUserEdit">Editar Usuario</h2>
        <p className="errorMessage">Usted no está logueado.</p>
      </div>
    ) : (
      <div className="divUserEdit">
        <h2 className="titleUserEdit">Editar Usuario</h2>
        {success && <p className="successMessage">{success}</p>}
        {error && <p className="errorMessage">{error}</p>}

        <form onSubmit={handleSubmit} className="userEditForm">
          <input
            type="text"
            placeholder="Nuevo nombre"
            value={nameUser}
            onChange={(e) => setNameUser(e.target.value)}
            className="placeholderName"
            required
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="placeholderPassword"
            required
          />
          <input
            type="password"
            placeholder="Repetir contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="placeholderPassword"
            required
          />
          <button type="submit" className="submitButton">
            Editar
          </button>
        </form>
      </div>
    )}
  </>
);

};
