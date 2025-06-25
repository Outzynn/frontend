import api from '../api/api';

export const getStats = async () => {
  try {
    const response = await api.get('/estadisticas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};