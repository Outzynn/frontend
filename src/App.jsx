import React from 'react';
import AppRoutes from './routes/AppRoutes';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import NavBarComponent from './components/NavBarComponent/NavBarComponent';

function App() {
  return (
    <>
      <HeaderComponent/>
      <NavBarComponent/>
      <AppRoutes />
      <FooterComponent/>
      
    </>
  );
}

export default App;
