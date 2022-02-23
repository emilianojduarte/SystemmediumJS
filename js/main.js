/*-------------------------VARIABLES--------------------*/
const arrayData = [
  {
    id: 1,
    type: "ram",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/ram1.jpg",
    enviogratis: false,
    recomendado: true,
    price: 3500,
    description: "1x4GB Kingston ValueRAM DDR3",
  },
  {
    id: 2,
    type: "ram",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/ram2.jpg",
    enviogratis: true,
    recomendado: false,
    price: 5499,
    description: "1x8GB Kingston Fury DDR4",
  },
  {
    id: 3,
    type: "ram",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/ram3.jpg",
    enviogratis: true,
    recomendado: true,
    price: 16108,
    description: "2x16GB Kingston Fury Beast DDR4",
  },
  {
    id: 4,
    type: "cpuintel",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/i3.jpg",
    enviogratis: true,
    recomendado: true,
    price: 26950,
    description: "10ma Generación Intel i3",
  },
  {
    id: 5,
    type: "cpuintel",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/i5.jpg",
    enviogratis: true,
    recomendado: true,
    price: 24999,
    description: "10ma Generación Intel i5",
  },
  {
    id: 6,
    type: "cpuintel",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/i7.jpg",
    enviogratis: false,
    recomendado: true,
    price: 43399,
    description: "10ma Generación Intel i7",
  },
  {
    id: 7,
    type: "cpuintel",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/i9.jpg",
    enviogratis: true,
    recomendado: false,
    price: 55900,
    description: "10ma Generación Intel i9",
  },
  {
    id: 8,
    type: "cpuamd",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/r3.jpg",
    enviogratis: true,
    recomendado: false,
    price: 32662,
    description: "3ra Generación Ryzen 3",
  },
  {
    id: 9,
    type: "cpuamd",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/r5.jpg",
    enviogratis: false,
    recomendado: true,
    price: 41999,
    description: "3ra Generación Ryzen 5",
  },
  {
    id: 10,
    type: "cpuamd",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/r7.jpg",
    enviogratis: true,
    recomendado: true,
    price: 61722,
    description: "3ra Generación Ryzen 7",
  },
  {
    id: 11,
    type: "cpuamd",
    url: "https://emilianojduarte.github.io/SystemmediumJS/images/r9.jpg",
    enviogratis: true,
    recomendado: false,
    price: 77400,
    description: "3ra Generación Ryzen 9",
  },
];
let stringRecomendado = "";
let stringEnvio = "";
let total = 0;
let l = 0;
let formEnvio;
/*--------------------------CLASES------------------------ */
//Clase Carrito, sirve para crear el array carrito, que si bien es el único que se utilizará,
//tiene los métodos para todas las acciones relacionadas a este
class Carrito {
  constructor() {
    this.productos = [];
  }
  initCart() {
    //revisa  si existen datos locales para cargarlo
    const cartExist = JSON.parse(localStorage.getItem("cart"));
    if (!!cartExist && cartExist.length > 0 && Array.isArray(cartExist)) {
      cartExist.forEach((producto) => this.productos.push(producto));
    }else{
      this.productos = [];
    }
    this.counterCart();
  }
  addToCart(id) {
    //añade un producto al carrito
    const indiceEncontrado = this.productos.findIndex((producto) => {
      return producto.id === id;
    });
    if (indiceEncontrado === -1) {
      const productoAgregar = arrayData.find((producto) => producto.id === id);
      productoAgregar.cantidad = 1;
      this.productos.push(productoAgregar);
      this.updateStorage();
    } else {
      this.productos[indiceEncontrado].cantidad += 1;
      this.updateStorage();
    }
    if (page === "SYSTEMMEDIUM - Carrito") {
      if (localStorage.getItem("cart")) {
        dibujarCart();
      } else {
        $("#sectionMainCart").append(`<h2>Carrito Vacio</h2>`);
      }
    }
  }
  removeOne(id) {
    //resta 1 unidad del seleccionado producto
    const indiceEncontrado = this.productos.findIndex((producto) => {
      return producto.id === id;
    });
    if (indiceEncontrado === -1) {
      return;
    } else {
      if (this.productos[indiceEncontrado].cantidad > 0) {
        this.productos[indiceEncontrado].cantidad -= 1;
        this.updateStorage();
        dibujarCart(carrito);
      }
    }
  }
  removeItem(id) {
    //elimina el producto del carrito
    const indiceEncontrado = this.productos.findIndex((producto) => {
      return producto.id === id;
    });
    this.productos.splice(indiceEncontrado, 1);
    this.updateStorage();
    dibujarCart(carrito);
  }
  updateStorage() {
    //actualiza los datos locales
    localStorage.setItem("cart", JSON.stringify(this.productos));
    this.counterCart();
  }
  getCarrito() {
    //devuele lo que haya en el array carrito
    return this.productos;
  }
  emptyCart() {
    //limpia el carrito
    localStorage.removeItem("cart");
  }
  counterCart(){
    l = this.productos.length;
    $("#counter").text(`${l}`);
  }
}

/*---------------------------------- MAIN -------------------------------*/
//Lo primero que hace le programa es crear el único carrito que se utiliza y lo inicializa
let carrito = new Carrito();
carrito.initCart();
carrito.counterCart();

//Acá lo que se me ocurrió es usar el "document.title" para saber en qué página estoy
const page = document.title;

/*------------------Log in---------------*/
//Reviso si ya está logueado
$("document").ready(() => {
  if (localStorage.getItem("token")) {
    const user = localStorage.getItem("email").split("@")[0];
    $("#loginBtn").text(user);
  }
});
//Hago click en el boton login, y entra en condición según si ya está logueado o no
$("#loginBtn").click(function () {
  if (localStorage.getItem("token")) {
    //llama al modal log off y lo dibuja
    $("#modalContainerOff").fadeIn("slow", function () {
      var modalBkg = document.getElementById("modalContainerOff");
      $(window).click(function (e) {
        if (e.target == modalBkg) {
          $("#modalContainerOff").fadeOut("slow");
        }
      });
    });
  }else{
    //llama al modal log in y lo dibuja
    $("#modalContainerIn").fadeIn("slow", function () {
      var modalBkg = document.getElementById("modalContainerIn");
      $(window).click(function (e) {
        if (e.target == modalBkg) {
          $("#modalContainerIn").fadeOut("slow");
        }
      });
    });
  }
});
//Deslogueo
$("#logoffForm").submit(function (e) {
  e.preventDefault();
  localStorage.clear();
  location.reload();
});
//Llamada a la API luego de presionar el boton de login
$("#loginForm").submit(async (e) => {
  e.preventDefault();
  $("#loginForm--error").text("");
  const email = $("#loginForm--email").val();
  const password = $("#loginForm--pass").val();
  const resultPetition = await enviarDatos("https://reqres.in/api/login", {
    email,
    password,
  });
  if (!!resultPetition.token) {
    $("#modalContainerIn").fadeOut("slow");
    localStorage.setItem("token", resultPetition.token);
    localStorage.setItem("email", email);
    //Las 2 lineas siguientes son para que luego de loguearme correctamente
    //no requiera refrescar la página para que se me actualice el nombre
    const user = localStorage.getItem("email").split("@")[0];
    $("#loginBtn").text(user);
  } else {
    $("#loginForm--error").addClass("text-danger");
    $("#loginForm--error").text("Correo o contraseña incorrecto.");
  }
});
const enviarDatos = async (url = "", data = {}) => {
  $("#btnLogin").text("Cargando...");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  $("#btnLogin").text("Ingresar");
  return response.json();
};

/*---------Sección de generación de card----------*/
//Acá lo que hago en que depenende en qué página estoy, capturo la sección principal correspondiente.
//Luego leo el array que contienen los productos (que emularia una base de datos) y dibujo las cards.
if (page === "SYSTEMMEDIUM - Memorias RAM") {
  arrayData.forEach((producto) => {
    if (producto.type === "ram") {
      if (producto.recomendado == true) {
        stringRecomendado = '<span class="card__txt--p1">Recomendado</span>';
      }
      if (producto.enviogratis == true) {
        stringEnvio = '<span class="card__txt--p4">Envio Gratis</span>';
      }
      $("#sectionMainMemories")
        .append(`<div class="card"><div><img src="${producto.url}" class="card__img"
                alt="foto de producto - memoria ram"></div>
                <div class="card__txt">
                    <p>
                      ${stringRecomendado}
                      ${stringEnvio}
                    </p>
                    <p class="card__txt--p2">$${producto.price}</p>
                    <p class="card__txt--p3">${producto.description}</p>
                    <button class="card__txt--p5" onclick="carrito.addToCart(${producto.id})">
                      Agregar al carrito
                    </button>
                </div></div>`);
      a = ""; // vuelvo a vaciar las variables, si no me queda con el valor cacheado
      b = "";
    }
  });
}
//genera tarjetas en la sección de ProcesadoresIntel
if (page === "SYSTEMMEDIUM - Procesadores Intel") {
  arrayData.forEach((producto) => {
    if (producto.type === "cpuintel") {
      if (producto.recomendado == true) {
        stringRecomendado = '<span class="card__txt--p1">Recomendado</span>';
      }
      if (producto.enviogratis == true) {
        stringEnvio = '<span class="card__txt--p4">Envio Gratis</span>';
      } //Se reemplaza el getElementById por los selectores de jquery
      $("#sectionMainIntel")
        .append(`<div class="card"><div><img src="${producto.url}" class="card__img"
                alt="foto de producto - procesador intel"></div>
                <div class="card__txt">
                    <p>
                      ${stringRecomendado}
                      ${stringEnvio}
                    </p>
                    <p class="card__txt--p2">$${producto.price}</p>
                    <p class="card__txt--p3">${producto.description}</p>
                    <button class="card__txt--p5" onclick="carrito.addToCart(${producto.id})">
                      Agregar al carrito
                    </button>
                </div></div>`);
      a = ""; // vuelvo a vaciar las variables si no me queda con el valor cacheado
      b = "";
    }
  });
}
//genera tarjetas en la sección de ProcesadoresAmd
if (page === "SYSTEMMEDIUM - Procesadores AMD") {
  arrayData.forEach((producto) => {
    if (producto.type === "cpuamd") {
      if (producto.recomendado == true) {
        stringRecomendado = '<span class="card__txt--p1">Recomendado</span>';
      }
      if (producto.enviogratis == true) {
        stringEnvio = '<span class="card__txt--p4">Envio Gratis</span>';
      } //Se reemplaza el getElementById por los selectores de jquery
      $("#sectionMainAmd")
        .append(`<div class="card"><div><img src="${producto.url}" class="card__img"
      alt="foto de producto - procesador amd"></div>
      <div class="card__txt">
          <p>
            ${stringRecomendado}
            ${stringEnvio}
          </p>
          <p class="card__txt--p2">$${producto.price}</p>
          <p class="card__txt--p3">${producto.description}</p>
          <button class="card__txt--p5" onclick="carrito.addToCart(${producto.id})">
            Agregar al carrito
          </button>
      </div></div>`);
      a = ""; // vuelvo a vaciars la variables si no me queda con el valor cacheado
      b = "";
    }
  });
}

/*---------Sección de generación de carrito----------*/
//Reviso si estoy la página del carrito
if (page === "SYSTEMMEDIUM - Carrito") {
  dibujarCart();
}
//Funcion para escribir la sección del carrito.
function dibujarCart() {
  if (localStorage.getItem("cart") && l > 0){
    $("#sectionMainCart").html("");
    carrito.getCarrito().forEach((producto) => {
      total = total + producto.price * producto.cantidad;
      $("#sectionMainCart").append(`
        <div class="cartStyle">
          <div class="cartStyle__img">
            <img src="${
              producto.url
            }" class="cartStyle__img--img" alt="imagen del producto">
          </div>
          <div class="cartStyle__data">
            <div class="cartStyle__data--detail">
                <p>${producto.description}</p>
            </div>
            <div class="cartStyle__data__counters">
              <div class="cartStyle__data__counters--signs" onclick="carrito.removeOne(${
                producto.id
              })">
                - 
              </div>
              <div>${producto.cantidad}</div>
              <div class="cartStyle__data__counters--signs" onclick="carrito.addToCart(${
                producto.id
              })">
                + 
              </div>
            </div>
            <div class="cartStyle__data__price">
              <div class="cartStyle__data__price--amount">$${
                producto.price * producto.cantidad
              }</div>
              <button class="cartStyle__data__price--btn removeProduct" onclick="carrito.removeItem(${
                producto.id
              })">
              Quitar
              </button>
            </div>
          </div>
        </div>
      `);
    });
    //Dibujo la sección final con el total y envio
    $("#sectionMainCart").append(`<div class="cartCheckout">
      <p>Total = $${total}</p> 
      <button class="cartCheckout--btnPay" onclick="deliver()">Enviar</button>
      </div>
    `);
  }else {
    $("#sectionMainCart").html("");
    $("#sectionMainCart").append(`<h2>Carrito Vacio</h2>
    <p>No hay nada en el carrito, es hora de elegir algunos productos!</p>
    `);
  }
}

function deliver() {
  $("#titleCart").html("");
  $("#titleCart").text("Formulario de envio");
  $("#sectionMainCart").html("");
  $("#sectionMainCart").append(`<form class="delivery" id="delivery">
    <fieldset class="">
      <legend class="">Datos Personales</legend>
      <div class="">
          <label for="inputNombre" class="form-label">Nombre/s</label>
          <input type="text" class="form-control" id="inputNombre"
              placeholder="Ingrese su nombre o nombres" required>
      </div>
      <div class="">
          <label for="inputApellido" class="form-label">Apellido/s</label>
          <input type="text" class="form-control" id="inputApellido"
              placeholder="Ingrese su apellido o apellidos" required>
      </div>
      <div class="">
          <label for="inputEdad" class="form-label">Edad</label>
          <input type="number" class="form-control" id="inputEdad" placeholder="Ingrese su edad" required>
      </div>
      <div class="">
          <label for="inputDni" class="form-label">DNI</label>
          <input type="number" class="form-control" id="inputDni" placeholder="Ingrese su DNI" required>
      </div>
    </fieldset>
    <fieldset class="">
        <legend class="">Dirección de entrega</legend>
        <div class="">
            <label for="inputDireccion" class="form-label">Dirección</label>
            <input type="text" class="form-control" id="inputDireccion" placeholder="Nombre de Calle 12345" required>
        </div>
        <div class="">
            <label for="inputCp" class="form-label">Código Postal</label>
            <input type="number" class="form-control" id="inputCp" placeholder="Ingrese su CP" required>
        </div>
        <div class="">
            <label for="inputProvincia" class="form-label">Provincia</label>
            <select id="inputProvincia" class="form-select">
                <option selected>Seleccione...</option>
                <option>CABA</option>
                <option>Buenos Aires</option>
                <option>Catamarca</option>
                <option>Chaco</option>
                <option>Chubut</option>
                <option>Córdoba</option>
                <option>Corrientes</option>
                <option>Entre Rios</option>
                <option>Formosa</option>
                <option>Jujuy</option>
                <option>La Pampa</option>
                <option>La Rioja</option>
                <option>Mendoza</option>
                <option>Misiones</option>
                <option>Neuquén</option>
                <option>Río Negro</option>
                <option>Salta</option>
                <option>San Juan</option>
                <option>San Luis</option>
                <option>Santa Cruz</option>
                <option>Santa Fe</optio>
                <option>Santiago del Estero</option>
                <option>Tierra del Fuego</option>
                <option>Tucumán</option>
            </select>
        </div>
    </fieldset>
    <fieldset clas="">
        <legend class="">Datos de contacto</legend>
        <div class="">
            <label for="inputMail" class="form-label">Email</label>
            <input type="email" class="form-control" id="inputMail" placeholder="Ingrese su email" required>
        </div>
        <div class="">
            <label for="inputCel" class="form-label">Celular</label>
            <input type="number" class="form-control" id="inputCel" placeholder="Ingrese su celular" required>
        </div>
    </fieldset>
    <fieldset class="delivery__end">
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="gridCheck" required>
            <label class="form-check-label" for="gridCheck">Acepto los Términos y
                Condiciones</label>
        </div>
        <div class="delivery__end__buttons">
            <button type="submit" class="btn btn-secondary">Enviar</button>
            <button type="reset" class="btn btn-secondary">Limpiar</button>
        </div>
    </fieldset>
  </form>`)
  .hide()
  .fadeIn("slow")
  .on("submit", messageDeliverySucces);
}

function messageDeliverySucces() {
  $("#titleCart").html("");
  $("#titleCart").text("Muchas Gracias");
  const nombreCliente = document.getElementById("inputNombre").value;
  $("#sectionMainCart").html("");
  $("#sectionMainCart").append(`
  <div>
    <p>Muchas gracias por su compra ${nombreCliente}!<p>
    <p>Estará recibiendo su compra en las próximas 48hs.<p>
    <p>No olvide revisar su correo para realizar el seguimiento.<p>
  `).hide().fadeIn("slow");
  carrito.emptyCart();
  carrito.initCart();
}

if (page === "SYSTEMMEDIUM - Contacto") {
  $("#sectionMainContact").on("submit", messageContactSucces);
}
function messageContactSucces(){
  $("#titleContact").html("");
  $("#titleContact").text("Gracias por su contacto");
  const nombreCliente = document.getElementById("inputNombre").value;
  $("#sectionMainContact").html("");
  $("#sectionMainContact").append(`
  <p>Le agradecemos que se tome el tiempo para contactarnos ${nombreCliente}</p>
  <p>En las próximas 24 hs háblies un representante lo estará contactando</p>
  `);
}


//----Pendiente
//pasar el array de productos a un archivo JSON
//animacion de los botones
//quizas un switch case para saber en que hoja estoy en lugar de if sueltos
