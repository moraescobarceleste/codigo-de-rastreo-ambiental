import Producto from "./components/Producto";
import BotonMensaje from "./components/BotonMensaje";

function App() {
  function mostrarMensaje() {
    alert("¡XDDDDDDDDDDDDDD!");
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Mi Tienda</h1>

      <Producto image="https://techterms.com/img/xl/laptop_586.png" nombre="Laptop" precio={800} />
      <Producto image="https://media.rs-online.com/image/upload/bo_1.5px_solid_white,b_auto,c_pad,dpr_2,f_auto,h_399,q_auto,w_710/c_pad,h_399,w_710/F1846693-01?pgw=1" nombre="Mouse" precio={20} />
      <Producto image="https://www.steren.com.co/media/catalog/product/cache/0236bbabe616ddcff749ccbc14f38bf2/image/223560a5c/teclado-usb-con-funciones-multimedia.jpg" nombre="Teclado" precio={50} />

      <BotonMensaje onClic={mostrarMensaje} />
      <BotonMensaje onClic={mostrarMensaje} />
      <BotonMensaje onClic={mostrarMensaje} />
    </div>
  );
}

export default App;