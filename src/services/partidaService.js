import api from "../api/api";

const getEnCurso = async() =>{
        const response = await api.get('/partida-en-curso');
        return response.data;
}

const crearPartida = async(idDelMazo) => {
    const response = await api.post('/partidas', {idDelMazo});
    return response.data;
}

const getCartas = async(usuario,id_partida) => {
    const response = await api.get(`/usuarios/${usuario}/partidas/${id_partida}/cartas`);
    return response.data.cartas;
}

const jugarRonda = async(carta_id, partida_id) =>{
    const response = await api.post('/jugadas', {carta_id,partida_id});
    return response.data;
}

export default{
    getEnCurso,
    crearPartida,
    getCartas,
    jugarRonda
};