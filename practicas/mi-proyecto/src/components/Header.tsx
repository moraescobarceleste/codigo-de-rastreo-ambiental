import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{
      backgroundColor: '#1990df',
      color: 'white',
      padding: '1rem',
      textAlign: 'center'
    }}>
      <h1>Mi Aplicación React con dilan Andrey Rincon Suarez</h1>
      <nav>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem'
        }}>
          <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Inicio</a></li>
          <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Acerca de</a></li>
          <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;