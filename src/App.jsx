import React from 'react';
import AppRoutes from './routes/AppRoutes';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import NavBarComponent from './components/NavBarComponent/NavBarComponent';

function App() {
  return (
    <div className="app-container">
      <HeaderComponent />
      <NavBarComponent />
      <main className="contenido">
        <AppRoutes />
      </main>
      <FooterComponent />
    </div>
  );
}

export default App;