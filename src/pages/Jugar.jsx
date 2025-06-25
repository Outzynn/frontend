import { useParams } from "react-router-dom";

export default function Jugar(){
    const {id} = useParams();
    return <div>
        <h1>Jugando con el mazo #{id}</h1>
        <h1>crear la partida,creo el tablero con las cartas</h1>
    
    </div>
}