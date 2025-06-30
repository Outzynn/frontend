import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import partidaService from "../services/partidaService";
import { AuthContext } from "../context/AuthContext";


export default function Jugar(){
    const {id} = useParams();
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true);
    const {usuario} = useContext(AuthContext);
    const [userCartas, setUserCartas] = useState([]);
    const [serverCartas, setServerCartas] = useState([]);

    const [idPartida,setIdPartida] = useState(null);
    const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
    const [resultadoRonda,setResultadoRonda] = useState(null);

    useEffect(() => {
        if (!usuario) return;

        const iniciarPartida = async() => {
        try {
            const partida = await partidaService.getEnCurso();

            if (partida.en_curso && !partida.pertenece) {
                setError("La partida en curso no te pertenece.");
                return;
            }

            if (partida.pertenece && partida.mazo_id != id) {
                setError(`El mazo seleccionado no corresponde a la partida en curso. Mazo correcto: ${partida.mazo_id}`);
                return;
            }

            if(!partida.en_curso){
                const partida_creada = await partidaService.crearPartida(id);
                const cartas_servidor = await partidaService.getCartas(1, partida_creada.partida_id);

                setUserCartas(partida_creada.cartas);
                setServerCartas(cartas_servidor);

                setIdPartida(partida_creada.partida_id);
            }
            else{
                const cartas_usuario = await partidaService.getCartas(usuario.id, partida.id);
                const cartas_servidor = await partidaService.getCartas(1, partida.id);

                setUserCartas(cartas_usuario);
                setServerCartas(cartas_servidor);
                setIdPartida(partida.id);
            }

            } catch (error) {
                const mensaje = error?.response?.data?.error || error?.message || "Error inesperado al iniciar la partida.";
                setError(mensaje);
            } finally {
                setLoading(false);
            }
        }
        iniciarPartida();
    },[id,usuario]);



    const handleCartaDobleClick = async (carta) => {
        try{
            setCartaSeleccionada(carta);
            const response = await partidaService.jugarRonda(carta.id, idPartida);

            setResultadoRonda(response);
            setUserCartas(prevCartas => prevCartas.filter(c => c.id !== carta.id));

            setServerCartas(prevCartas => {
            const cartaServidorId = Number(response.carta_servidor.id);
            const filtradas = prevCartas.filter(c => Number(c.id) !== cartaServidorId);
            return filtradas;
            });


        }catch(error){
            const mensaje = error?.response?.data?.error || error?.message || "Error al jugar la ronda.";
            setError(mensaje);
        }
    };

    const reiniciarPartida = async () => {
        try {
            setLoading(true);
            setResultadoRonda(null);
            setCartaSeleccionada(null);
            setError("");
            
            const nuevaPartida = await partidaService.crearPartida(id);
            setIdPartida(nuevaPartida.partida_id);

            const nuevasCartasJugador = nuevaPartida.cartas;
            const nuevasCartasServidor = await partidaService.getCartas(1, nuevaPartida.partida_id);

            setUserCartas(nuevasCartasJugador);
            setServerCartas(nuevasCartasServidor);
        } catch (error) {
            const mensaje = error?.response?.data?.error || error?.message || "Error al reiniciar la partida.";
            setError(mensaje);
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <p className="loading">Cargando partida...</p>;
    if (error) return <p className="errorMessage">{error}</p>;

    return (
        <div className="tablero">
            {serverCartas.length>0 && 
                <>
                    <h1>Cartas del servidor</h1>
                    <div className="cartas-container">
                        {Array.isArray(serverCartas) && serverCartas.map((carta) => (
                            <div key={carta.id}
                            className="carta"
                            >
                                <img src = {'/cartas/default.webp'} //dada vuelta porq es la del servidor
                                alt = {carta.atributo_nombre}
                                />
                                <strong>
                                    {carta.atributo_nombre}
                                </strong>
                            </div>
                        ))}
                    </div>
                </>
            }
            

            <div className="centro">
                {resultadoRonda ? (
                    <div className="resultado-ronda">
                    <div className="cartas-container">
                        <div className="carta">
                        <h3>Tu carta</h3>
                        <img
                            src={`/cartas/${cartaSeleccionada.id}.png`}
                            alt={cartaSeleccionada.nombre}
                            onError={(e) => (e.target.src = "/cartas/default.webp")}
                        />
                        <p>{cartaSeleccionada.nombre} - {cartaSeleccionada.ataque} ({cartaSeleccionada.ataque_nombre})</p>
                        </div>

                        <div className="carta">
                        <h3>Carta del servidor</h3>
                        <img
                            src={`/cartas/${resultadoRonda.carta_servidor.id}.png`}
                            alt={resultadoRonda.carta_servidor.nombre}
                            onError={(e) => (e.target.src = "/cartas/default.webp")}
                        />
                        <p>{resultadoRonda.carta_servidor.nombre} - {resultadoRonda.carta_servidor.ataque} ({resultadoRonda.carta_servidor.ataque_nombre})</p>
                        </div>
                    </div>

                    <div className="ganador">
                        <strong>Ganador de la ronda:</strong> 
                        {resultadoRonda.el_usuario === "gano" ? "¡Vos!" : "Servidor"}
                        

                    {resultadoRonda.ultima_ronda && (
                        <>
                        <strong>Ganador del juego: {resultadoRonda.gano_el_juego === "el usuario" ? "¡Vos!" : "Servidor"}</strong>

                        <div className="jugar-otra-vez">
                        <button onClick={reiniciarPartida}>
                            Jugar otra vez?
                        </button>
                        </div>
                        </>
                        
                    )}
                        </div>
                    </div>
                ) : (
                    <div className="espaciador">
                    </div>
                )
                }
            </div>
           {userCartas.length>0 &&
            <>
                <div className="cartas-container">
                {Array.isArray(userCartas) && userCartas.map((carta) => (
                <div key={carta.id} className="carta">
                    <img
                    src={`/cartas/${carta.id}.png`}
                    alt={carta.nombre}
                    onError={(e) => (e.target.src = "/cartas/default.webp")}
                    onDoubleClick={() => handleCartaDobleClick(carta)}
                    />
                    <strong>{carta.nombre} 
                    <br></br> Ataque: {carta.ataque} 
                    <br></br>{carta.ataque_nombre} 
                    <br></br>({carta.atributo_nombre})
                    </strong>
                    </div>
                ))}
                </div>
                <h1>Tus cartas</h1>
            </>
           }
            
        </div>
    );
}