import { useState, useEffect, useContext } from "react";
import {enlistarCartas, crearMazo} from "../services/mazosService";
import { AuthContext } from "../context/AuthContext";


export default function AltaMazo(){

    const [nombreMazo, setNombreMazo] = useState("");
    const [cartas, setCartas] = useState([]);
    const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroAtributo, setFiltroAtributo] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const {usuario} = useContext(AuthContext);

    useEffect(() => {
        const fetchCartas = async () => {
            try {
            const response = await enlistarCartas(filtroAtributo,filtroNombre);
            setCartas(response.data);
            } catch (error) {
            setError( error.response?.data?.error || "Error al cargar las cartas.");
            }
        };
        fetchCartas();
    }, [filtroNombre, filtroAtributo]);

    const handleCrearMazo = async () => {
        setError("");
        setSuccess("");

        if (nombreMazo.length === 0 || nombreMazo.length > 20) {
            return setError("El nombre del mazo debe tener entre 1 y 20 caracteres.");
        }

        if (cartasSeleccionadas.length !== 5) {
            return setError("Debés seleccionar exactamente 5 cartas.");
        }
        try {
            const response = await crearMazo(nombreMazo,cartasSeleccionadas);
            setSuccess("Mazo creado correctamente.");
        } catch (error) {
            setError(error.response?.data?.error || "No se pudo guardar el mazo.");
        }
    };

    const toggleSeleccion = (id) => {
        if (cartasSeleccionadas.includes(id)) {
            setCartasSeleccionadas(cartasSeleccionadas.filter((c) => c !== id));
        } else if (cartasSeleccionadas.length < 5) {
            setCartasSeleccionadas([...cartasSeleccionadas, id]);
        }
    };


    return(
            <>
            {!usuario ? (
                <p className="errorMessage">Usted no esta logueado.</p>
            ):
            (<>
            
            <h2>Crear nuevo Mazo</h2>
            <div className="formulario-mazo">
                <div className="columna">
                    <input
                    type="text"
                    value={nombreMazo}
                    maxLength={20}
                    onChange={(e) => setNombreMazo(e.target.value)}
                    placeholder="Nombre del mazo"
                    />

                    <input
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                </div>

                <div className="columna">
                    <select value={filtroAtributo} onChange={(e) => setFiltroAtributo(e.target.value)}>
                    <option value="">Todos los atributos</option>
                    <option value="agua">Agua</option>
                    <option value="fuego">Fuego</option>
                    <option value="tierra">Tierra</option>
                    <option value="volador">Volador</option>
                    <option value="normal">Normal</option>
                    <option value="piedra">Piedra</option>
                    <option value="planta">Planta</option>
                    </select>


                    <button onClick={() => {
                    setFiltroNombre("");
                    setFiltroAtributo("");
                    }}>Limpiar filtros</button>
                </div>
            </div>

            <button className="boton-guardar-mazo"onClick={handleCrearMazo}>Guardar mazo</button>
            {error && <p className="errorMessage">{error}</p>}
            {success && <p className="successMessage">{success}</p>}

            <div className="cartas-grid">
                {Array.isArray(cartas) && cartas.length >0 ? (
                    cartas.map(carta => (
                    <div key={carta.id} className={`carta ${cartasSeleccionadas.includes(carta.id) ? 'seleccionada' : ''}`}>
                        <img
                        src={`/cartas/${carta.id}.png`}
                        alt={carta.nombre}
                        onError={(e) => {
                            e.target.onerror = null; //
                            e.target.src = '/cartas/default.webp';
                        }}
                        />
                        <strong>
                            <p>{carta.nombre}</p>
                            <p>Ataque: {carta.ataque}</p>
                            <p>{carta.atributo}</p>
                        </strong>
                        <input
                            type="checkbox"
                            checked={cartasSeleccionadas.includes(carta.id)}
                            onChange={() => toggleSeleccion(carta.id)}
                            disabled={
                            !cartasSeleccionadas.includes(carta.id) &&
                            cartasSeleccionadas.length >= 5
                            }
                        />
                    </div>
                ))) : (
                    <strong>No se encontraron cartas con esos filtros.</strong>
                )}
            
            </div>

            </>)
            }
            </>

    );
}