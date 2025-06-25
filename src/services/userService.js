import api from '../api/api';

const login = async (usuario, password) => {
  const response = await api.post("/login", { usuario, password });
  return response.data;
};

const register = async (nombre, usuario, password) => {
  const response = await api.post("/registro", { nombre, usuario, password });
  return response.data;
};

const edit = async (id,nombre,password) => {
    const response = await api.put(`/usuarios/${id}`, {nombre,password});
    return response.data;
}


export default {
    login,
    register,
    edit,
};
