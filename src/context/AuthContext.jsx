import {createContext,useState,useEffect} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const userGuardado = localStorage.getItem("usuario");
    const tokenGuardado = localStorage.getItem("token");

    if (userGuardado && tokenGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(userGuardado));
    }
  }, []);

  const login = (usuario,token) => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);
    setUsuario(usuario);
    setToken(token)
  };

  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    setToken(null);
  };

  const editName = (nuevoNombre) => {
  if (usuario) {
    const usuarioActualizado = { ...usuario, nombre: nuevoNombre };
    setUsuario(usuarioActualizado);
    localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
  }
};

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, editName }}>
      {children}
    </AuthContext.Provider>
  );
};