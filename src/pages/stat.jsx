import { useEffect, useState } from "react";
import { getStats } from "../services/statService";

export default function Stats() {
  const [estadisticas, setEstadisticas] = useState([]);
  const [orden, setOrden] = useState("desc");
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStats();
        const datosConPromedio = res.estadisticas.map((usuario) => {
          const ganadas = parseInt(usuario.partidas_ganadas);
          const perdidas = parseInt(usuario.partidas_perdidas);
          const empatadas = parseInt(usuario.partidas_empatadas);
          const total = ganadas + perdidas + empatadas;
          const promedio = total > 0 ? (ganadas / total).toFixed(2) : 0;
          return { ...usuario, total, promedio };
        });
        setEstadisticas(datosConPromedio);
      } catch (err) {
        console.error("Error al obtener estadísticas", err);
      }
    };

    fetchData();
  }, []);

  const estadisticasOrdenadas = [...estadisticas].sort((a, b) => {
    return orden === "desc"
      ? b.promedio - a.promedio
      : a.promedio - b.promedio;
  });

  const mejorJugador = estadisticasOrdenadas[0];

  // Paginación
  const totalPaginas = Math.ceil(estadisticas.length / resultadosPorPagina);
  const inicio = (paginaActual - 1) * resultadosPorPagina;
  const paginados = estadisticasOrdenadas.slice(inicio, inicio + resultadosPorPagina);

  return (
    <div className="statPage">
      <h2>Estadísticas de usuarios</h2>
      <button onClick={() => setOrden(orden === "desc" ? "asc" : "desc")}>
        Ordenar por {orden === "desc" ? "peor" : "mejor"} performance
      </button>

      <ul>
        {paginados.map((user, i) => (
          <li key={i} className={user === mejorJugador ? "mejorJugador" : ""}>
            <strong>{user.nombre}</strong> - Partidas: {user.total} | Ganadas: {user.partidas_ganadas} | Perdidas: {user.partidas_perdidas} | Empatadas: {user.partidas_empatadas} | Promedio: {user.promedio}
          </li>
        ))}
      </ul>

      {/* Paginación */}
      <div className="paginacion">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={paginaActual === i + 1 ? "activo" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
