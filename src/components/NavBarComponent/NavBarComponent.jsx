import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import LogoutButton from '../LogoutButton/LogoutButton';

export default function Navbar() {
  const { usuario } = useContext(AuthContext);

  return (
    <nav>
      {usuario && (
        <div className="nav-saludo">
          Hola, {usuario.nombre}
        </div>
      )}

      <div className="nav-links">
        {usuario ? (
          <>
            <Link to="/mis-mazos">Mis mazos</Link>
            <Link to="/editar-perfil">Editar usuario</Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/registro">Registro de usuario</Link>
            <Link to="/inicio-de-sesion">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}