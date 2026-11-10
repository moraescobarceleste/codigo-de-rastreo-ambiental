function Producto(props: { nombre: string; precio: number; image: string }) {
  return (
    <div>
      <img src={props.image}/>
      <h3>{props.nombre}</h3>
      <p>Precio: ${props.precio}</p>
    </div>
  );
}

export default Producto;