function BotonMensaje({ onClic }: { onClic: () => void }) {
  return <button onClick={onClic}>Enviar producto</button>;
}

export default BotonMensaje;