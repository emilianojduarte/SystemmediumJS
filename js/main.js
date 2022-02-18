/*-------------------------VARIABLES--------------------*/
const arrayData = [
  {
    id: 1,
    type: "ram",
    url: "../images/ram1.jpg",
    enviogratis: false,
    recomendado: true,
    price: 3500,
    description: "1x4GB Kingston ValueRAM DDR3",
  },
  {
    id: 2,
    type: "ram",
    url: "../images/ram2.jpg",
    enviogratis: true,
    recomendado: false,
    price: 5499,
    description: "1x8GB Kingston Fury DDR4",
  },
  {
    id: 3,
    type: "ram",
    url: "../images/ram3.jpg",
    enviogratis: true,
    recomendado: true,
    price: 16108,
    description: "2x16GB Kingston Fury Beast DDR4",
  },
  {
    id: 4,
    type: "cpuintel",
    url: "../../images/i3.jpg",
    enviogratis: true,
    recomendado: true,
    price: 26950,
    description: "10ma Generación Intel i3",
  },
  {
    id: 5,
    type: "cpuintel",
    url: "../../images/i5.jpg",
    enviogratis: true,
    recomendado: true,
    price: 24999,
    description: "10ma Generación Intel i5",
  },
  {
    id: 6,
    type: "cpuintel",
    url: "../../images/i7.jpg",
    enviogratis: false,
    recomendado: true,
    price: 43399,
    description: "10ma Generación Intel i7",
  },
  {
    id: 7,
    type: "cpuintel",
    url: "../../images/i9.jpg",
    enviogratis: true,
    recomendado: false,
    price: 55900,
    description: "10ma Generación Intel i9",
  },
  {
    id: 8,
    type: "cpuamd",
    url: "../../images/r3.jpg",
    enviogratis: true,
    recomendado: false,
    price: 32662,
    description: "3ra Generación Ryzen 3",
  },
  {
    id: 9,
    type: "cpuamd",
    url: "../../images/r5.jpg",
    enviogratis: false,
    recomendado: true,
    price: 41999,
    description: "3ra Generación Ryzen 5",
  },
  {
    id: 10,
    type: "cpuamd",
    url: "../../images/r7.jpg",
    enviogratis: true,
    recomendado: true,
    price: 61722,
    description: "3ra Generación Ryzen 7",
  },
  {
    id: 11,
    type: "cpuamd",
    url: "../../images/r9.jpg",
    enviogratis: true,
    recomendado: false,
    price: 77400,
    description: "3ra Generación Ryzen 9",
  },
];
let stringRecomendado = "";
let stringEnvio = "";
/*--------------------------CLASES------------------------ */

class Carrito {
  constructor() {
    this.productos = [];
  }
  inicializarCarrito() {
    const cartExist = JSON.parse(localStorage.getItem("cart"));
    if (!!cartExist && cartExist.length > 0 && Array.isArray(cartExist)) {
      cartExist.forEach((producto) => this.productos.push(producto));
    }
  }
  addToCart(id) {
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
    const indiceEncontrado = this.productos.findIndex((producto) => {
      return producto.id === id;
    });
    this.productos.splice(indiceEncontrado, 1);
    this.updateStorage();
    dibujarCart(carrito);
  }
  updateStorage() {
    localStorage.setItem("cart", JSON.stringify(this.productos));
  }
  getCarrito() {
    return this.productos;
  }
}

/*---------------------------------- MAIN -------------------------------*/
//Lo primero que hace le programa es crear el único carrito que se utiliza y lo inicializa
let carrito = new Carrito();
carrito.inicializarCarrito();

const page = document.title;
//Acá lo que se me ocurrió es usar el "document.title" para saber en qué página estoy

/*---Log in---*/
//Reviso si ya está logueado
$("document").ready(() => {
  if (localStorage.getItem("token")) {
    const user = localStorage.getItem("email").split("@")[0];
    $("#loginBtn").text(user);
  }
});
//Hago click en el boton login, despliega el modal
$("#loginBtn").click(function () {
  //llamar al modal y dibujarlo
  $(".modal").fadeIn("slow", function () {
    var modalBkg = document.getElementById("modalContainer");
    $(window).click(function (e) {
      if (e.target == modalBkg) {
        $("#modalContainer").fadeOut("slow");
      }
    });
  });
});
//llamada a la API luego de presionar el boton de login
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
    $("#modalContainer").fadeOut("slow");
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

/*---Sección de generación de card---*/
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
      a = ""; // vuelvo a vaciar la variable si no me queda con el valor cacheado
      b = ""; // vuelvo a vaciar la variable si no me queda con el valor cacheado
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
                alt="foto de producto - memoria procesador intel"></div>
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
      a = ""; // vuelvo a vaciar la variable si no me queda con el valor cacheado
      b = ""; // vuelvo a vaciar la variable si no me queda con el valor cacheado
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
        .append(`<div class="card">
                  <div>
                    <img src="${producto.url}" class="card__img" alt="foto de producto - memoria intel amd">
                  </div>
                <div class="card__txt">
                    <p>
                        ${stringRecomendado}
                        ${stringEnvio}
                    </p>
                    <p class="card__txt--p2">$${producto.price}</p>
                    <p class="card__txt--p3">${producto.description}</p>
                    <a href="#" id ="addCart${producto.id}" onclick="carrito.addToCart(${producto.id})"><p class="card__txt--p5">Agregar al carrito</p></a>
                </div></div>`);
      a = ""; // vuelvo a vaciar la variable si no me queda con el valor cacheado
      b = ""; // vuelvo a vaciar la variable si no me queda con el valor cacheado
    }
  });
}

// //Reviso si estoy la página del carrito
if (page === "SYSTEMMEDIUM - Carrito") {
  if (localStorage.getItem("cart")) {
    dibujarCart();
  } else {
    $("#sectionMainCart").append(`<h2>Carrito Vacio</h2>`);
  }
}
//funcion para escribir la sección del carrito.
function dibujarCart() {
  let total = 0;
  $("#sectionMainCart").html("");
  carrito.getCarrito().forEach((producto) => {
    total = total + producto.price * producto.cantidad;
    $("#sectionMainCart").append(`
    <div class="cartStyle">
      <div class="cartStyle__img">
        <img src="${producto.url}" class="cartStyle__img--img" alt="imagen del producto">
      </div>
      <div class="cartStyle__data">
        <div class="cartStyle__data--detail">
            <p>${producto.description}</p>
        </div>
        <div class="cartStyle__data__counters">
          <div class="cartStyle__data__counters--signs" onclick="carrito.addToCart(${producto.id})">
            + 
          </div>
          <div>${producto.cantidad}</div>
          <div class="cartStyle__data__counters--signs" onclick="carrito.removeOne(${producto.id})">
            - 
          </div>
        </div>
        <div class="cartStyle__data__price">
          <div class="cartStyle__data__price--amount">$${producto.price * producto.cantidad}</div>
          <button class="cartStyle__data__price--btn removeProduct" onclick="carrito.removeItem(${producto.id})">
          Quitar
          </button>
        </div>
      </div>
    </div>`);
  });
  $("#sectionMainCart").append(`<div class="cartCheckout">
    <p>Total = $${total}</p> 
    <button class="cartCheckout--btnPay">Pagar</button>
    </div>`);
}
