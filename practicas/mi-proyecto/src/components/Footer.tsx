import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#1900f8',
      color: 'white',
      textAlign: 'center',
      padding: '1rem',
      position: 'relative',
      bottom: 0,
      width: '100%'
    }}>
      <p style={{ margin: '0.5rem 0' }}>
        &copy; {currentYear} Mi Aplicación. Todos los derechos reservados.
      </p>
      <p style={{ margin: '0.5rem 0' }}>
        Creado con React y TypeScript
      </p>
    </footer>
  );
};

export default Footer;