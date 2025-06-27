import {Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/RegistroPage';
import EditUser from '../pages/EditUser';
import Stats from '../pages/stat';
import Mazos from '../pages/Mazos';
import Jugar from '../pages/Jugar';
import AltaMazo from '../pages/CreateMazo';

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Stats />} />
        <Route path="/inicio-de-sesion" element={<Login/>} />
        <Route path="/registro" element={<Register/>} />
        <Route path="/editar-perfil" element={<EditUser/>} />
        <Route path="/mis-mazos" element={<Mazos/>}/>
        <Route path="/crear-mazo" element={<AltaMazo/>} />
        <Route path="/jugar/:id" element={<Jugar/>}/>
    
      </Routes>
  );
}

export default AppRoutes;
