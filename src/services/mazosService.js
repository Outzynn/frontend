import api from "../api/api";

export const getMazos = async(userId) => {
    const response = await api.get(`/usuarios/${userId}/mazos`)
    return response;
}

export const deleteMazo = async(mazoId) => {
    const response = await api.delete(`/mazos/${mazoId}`);
    return response;
}

export const getCartasDelMazo= async(mazoId) => {
    const response = await api.get(`/mazos/${mazoId}`);
    return response;
}

export const editDeck = async(mazoId, nombre) => {
    const response = await api.put(`/mazos/${mazoId}`, {nombre});
    return response;
}

export const enlistarCartas = async(filtroAtributo,filtroNombre) => {
    
    const response = api.get("/cartas", {
                params: {
                nombre: filtroNombre,
                atributo: filtroAtributo
                }
            })
    return response;
}

export const crearMazo = async(nombre,ids) => {
    const response = api.post("/mazos", {ids,nombre});
    return response;
}