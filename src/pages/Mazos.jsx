import { useState, useContext, useEffect, Suspense } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMazos } from "../services/mazosService";
import { deleteMazo } from "../services/mazosService";
import { getCartasDelMazo } from "../services/mazosService";
import { editDeck } from "../services/mazosService";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Mazos(){
    const {usuario} = useContext(AuthContext);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [mazos, setMazos] = useState([]);
    const [cartas, setCartas] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    const [nuevoNombre, setNuevoNombre] = useState("");
    const [mazoEditando, setMazoEditando] = useState(null);

    const navigate = useNavigate();

    useEffect(() =>{
        const fetchData = async () => {
            try{
                const response = await getMazos(usuario.id);
                setMazos(response.data);
            }catch(error){
                setError(error.response?.data?.error || "Error al obtener los mazos");
            }
        };
        if(usuario){
            fetchData();
        }
    }, [usuario]);

    const handleEliminar = async(mazoId) =>  {
        try{
            await deleteMazo(mazoId);
            setMazos((prevMazos)=> prevMazos.filter((m) => m.id !== mazoId));
            
            setSuccess("Mazo eliminado correctamente.")
        }catch (error) {
            setError(
                error.response?.data?.error || "No se pudo eliminar el mazo. Asegurate de que no fue usado en una partida."
            );
        }
    };

    const verMazo = async(mazoId) => {
        try {
            const response = await getCartasDelMazo(mazoId);
            setCartas(response.data);
            setMostrarModal(true);
        } catch (error) {
            setError("No se pudieron cargar las cartas del mazo.");
        }
    };

    const editarMazo = async(mazoId) => {
      try {
        await editDeck(mazoId,nuevoNombre);
        setMazos((prevMazos) => prevMazos.map((m) => 
          m.id === mazoId ? {...m, nombre: nuevoNombre} : m
        ));

        setSuccess("Mazo actualizado correctamente.")
        setNuevoNombre("");
        setMazoEditando(null);
      } catch (error) {
        setError(
          error.response?.data?.error || "No se pudo editar el mazo."
          );
      }
    };


   return (
  <>
    {!usuario ? (
      <div className="divMazos">
        <h1>Usted no está logueado</h1>
        <p className="errorMessage">Debe iniciar sesión para ver sus mazos.</p>
      </div>
    ) : (
      <div className="divMazos">
        
        <h1>Mazos disponibles.</h1>

        <button 
          onClick={() => navigate('/crear-mazo')}
          className="alta-mazo" 
          disabled={mazos.length>=3}>
            Alta Nuevo Mazo
        </button>

        
        {error && <p className="errorMessage">{error}</p>}
        {success && <p className="successMessage"> {success}</p>}

        <ul>
          {mazos.map((mazo, i) => (
            <li key={i} className="lista-de-mazos">
              <span className="mazo-nombre">
                {mazoEditando === mazo.id ? (
                  <>
                    <input
                      type="text"
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      className="input-editar-mazo"
                    />
                    <button onClick={() => editarMazo(mazo.id)} className="boton-guardar">Guardar</button>
                    <button onClick={() => setMazoEditando(null)} className="boton-cancelar">Cancelar</button>
                  </>
                ) : (
                  mazo.nombre
                )}
              </span>

              <div className="acciones-mazo">
                <button
                  onClick={() => handleEliminar(mazo.id)}
                  className="botonEliminar"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => verMazo(mazo.id)}
                  className="botonVerMazo"
                >
                  Ver Mazo
                </button>
                <button
                    onClick={() => {
                      setMazoEditando(mazo.id);
                      setNuevoNombre(mazo.nombre);
                    }}
                    className="botonEditarMazo"
                  >
                    Editar
                </button>

                <Link to={`/jugar/${mazo.id}`} className="botonJugar">
                Jugar
                </Link>

              </div>
            </li>
          ))}
        </ul>

        {mostrarModal && (
          <div className="modalCartas">
            <div className="modal-contenido">
              <h2 className="title-modal">Cartas del Mazo</h2>
              <ul>
                {cartas.map((carta, idx) => (
                  <li key={idx}>
                    <img src={`/cartas/${carta.id}.png`} alt="Carta" className="imagen-carta"/>
                    <p className="carta-info">
                    <strong>{carta.nombre} 
                    <br></br> Ataque: {carta.ataque} 
                    <br></br>{carta.ataque_nombre} 
                    <br></br>({carta.atributo_nombre})
                    </strong>
                    </p>
                  </li>
                ))}
              </ul>
              <button onClick={() => setMostrarModal(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    )}
  </>
);
};
