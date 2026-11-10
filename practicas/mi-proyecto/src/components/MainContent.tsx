import React from 'react';
const MainContent: React.FC = () => {
  return (
    <main style={{
      padding: '2rem',
      minHeight: '60vh',
      backgroundColor: '#f5f5f5'
    }}>
      <h2 style={{ color: '#aa0000', marginBottom: '1rem' }}>
        lo que me gusta
      </h2>
      <p style={{ lineHeight: '1.6', color: '#333' }}>
        las series y los videojuegos
      </p>
      <p style={{ lineHeight: '1.6', color: '#333' }}>
        me gusta la programacion
        
      </p>
    </main>
  );
};

export default MainContent;