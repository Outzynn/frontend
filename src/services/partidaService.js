import api from "../api/api";

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
    crearPartida,
    getCartas,
    jugarRonda
};