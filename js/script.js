//Variables funcion iniciarJuego();
const sectionSeleccionarAtaque = document.getElementById("Seleccionar-ataque")
const sectionReiniciar = document.getElementById("reiniciar")
const botonMascotaJugador = document.getElementById("boton-select")
const botonReiniciar = document.getElementById("boton-reset")
//variables funcion seleccionarMascotaJugador();
const sectionSeleccionarMascota = document.getElementById("Seleccionar-mascota")
const mascotaPlayer = document.getElementById("mascota-jugador")
//Variable funcion seleccionarMascotaPc();
const mascotaPc = document.getElementById("mascota-enemigo")
// variables funcion crearMensaje();
const parrafoMensajes = document.getElementById("resultado") 
const ataqueDelJugador = document.getElementById("ataque-del-jugador")
const ataqueDelEnemigo = document.getElementById("ataque-del-enemigo")
//Variables funcion resultadoCombate();
const contadorVictoriasJugador = document.getElementById("jugador-vida")
const contadorVictoriasEnemigo = document.getElementById("enemigo-vida")
//Variables funcion mensajeFinal();
const parrafoMensajeFinal = document.getElementById("resultado")
//Variable para traer el id del elemento <div> donde se van a imprimir los inputs de cada mokepon
const contenidoTarjetas = document.getElementById("contenedorTarjetas")
//Variable para traer el id del elemento <div> donde se van a imprimir los botones de ataques
const contenedorAtaques = document.getElementById("contenedor-ataques")
//Variables para traer el id del elemento <section> y <canvas>
const sectionVerMapa = document.getElementById("ver-mapa")
const canvasMapa = document.getElementById("mapa")

let jugadorId
let enemigoId
let opcionDeMokepones
let inputHipodoge 
let inputCapipepo 
let inputRatigueya
let indexAtaqueJugador
let indexAtaqueEnemigo
let botonFuego   
let botonAgua    
let botonTierra  
let botones = []
let ataqueJugador = []
let ataqueEnemigo = []
let mokepones = [] //Construccion de una variable tipo array
let mokeponesEnemigos = []
let ataqueMokeponEnemigo
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMokepon
let victoriasJugador = 0
let victoriasEnemigo = 0
let lienzo = canvasMapa.getContext("2d") //Variable para configurar el canvas en 2d
let intervalo
let mapaFondo = new Image()
mapaFondo.src = "./assets/mokemap.png"
let altoDelMapa
let anchoDelMapa = window.innerWidth - 20

//Declaracion de la clase Mokepon para nuestros personajes
class Mokepon {
  constructor(nombre, imagen, vida, fotoMapa, id = null) { // X y Y = 10 representan un numero por default en caso de no asignar valor en esta posición del constructor a la nueva instancia
    this.id = id
    this.nombre = nombre //La palabra reservada *this* para crear variables dentro de la clase
    this.imagen = imagen
    this.vida = vida
    this.ataques = [] // construccion de arrays dentro de los objetos para guardar solo informacion
    this.ancho = 40 //Tipo de asignación de valores para todas las instancias en general
    this.alto = 40 
    this.x = numAleatorio(0, canvasMapa.width)
    this.y = numAleatorio(0, canvasMapa.height) //Crear variables de x, y, ancho y alto para después automatizarlos
    this.mapaImagen = new Image()
    this.mapaImagen.src = fotoMapa
    this.velocidadX = 0 
    this.velocidadY = 0
  }
  //Así se crea un método o función en la clase para luego ser invocada ej: mascotaJugadorObjeto.pintarMokepon()
  pintarMokepon() {
    lienzo.drawImage(this.mapaImagen, this.x, this.y, this.ancho, this.alto) //Funcíon para dibujar la imagen dentro del canvas. Parametros de la función drawImage:imagen, posiciónX, posiciónY, ancho, alto
  }
}
//Creacion o instancia de los objetos de la clase Mokepon con la palabra reservada *new*
let hipodoge = new Mokepon("Hipodoge", "./assets/mokepons_mokepon_hipodoge_attack.png", 5, "./assets/hipodoge.png")
let capipepo = new Mokepon("Capipepo", "./assets/mokepons_mokepon_capipepo_attack.png", 5, "./assets/capipepo.png")
let ratigueya = new Mokepon("Ratigueya", "./assets/mokepons_mokepon_ratigueya_attack.png", 5, "./assets/ratigueya.png")


const hipodoge_ataques = [
  { nombre: "💧", id: "boton-agua" }, 
  { nombre: "💧", id: "boton-agua" },
  { nombre: "💧", id: "boton-agua" },
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "🌱", id: "boton-tierra" },
]

hipodoge.ataques.push(...hipodoge_ataques) //Los 3 puntos toman el valor dentro de una variable

const capipepo_ataques = [
  { nombre: "🌱", id: "boton-tierra" }, 
  { nombre: "🌱", id: "boton-tierra" },
  { nombre: "🌱", id: "boton-tierra" },
  { nombre: "💧", id: "boton-agua" },
  { nombre: "🔥", id: "boton-fuego" },
]
 
capipepo.ataques.push(...capipepo_ataques) // Invocar la propiedad ataques por cada instancia y agregar los datos 

const ratigueya_ataques = [
  { nombre: "🔥", id: "boton-fuego" }, 
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "💧", id: "boton-agua" },
  { nombre: "🌱", id: "boton-tierra" },
]

ratigueya.ataques.push(...ratigueya_ataques)

mokepones.push(hipodoge, capipepo, ratigueya) //El método push() sirve para agregar elementos dentro de la variable de array en este caso mokepones = []


function iniciarJuego() {
  sectionSeleccionarAtaque.style.display = "none" //Propiedad CSS para ocultar elementos de HTML en JS
  //Manipulando el DOM con iteradores
  //La funcion de iteración forEach() significa que recorre cada índice del array y luego ejecuta una orden para todos.
  sectionVerMapa.style.display = "none"
  mokepones.forEach((mokepon) => { //Mokepones comparte sus instancias guardadas con la variable mokepon
    opcionDeMokepones = `
    <input type="radio" name="mascota" id=${mokepon.nombre} />
      <label for=${mokepon.nombre} class="tarjeta-de-mokepon">
        <p>${mokepon.nombre}</p>
        <img src=${mokepon.imagen} alt=${mokepon.nombre}/>
      </label>
      `
    contenidoTarjetas.innerHTML += opcionDeMokepones //Los simbolos += ayuda a imprimir todo el contenido de la iteracion forEach() por cada objeto guardado en la variable mokepones
    //Forma de realizar una estructura de templates literarios que sirve para implementar una estructura de HTML en una variable y mezclarlo con JS // con Alt + 96 saca las comillas invertidas //Para inyectar el valor de las propiedades de los objetos se utiliza ésta sintaxis: ${mokepon.nombre}
    inputHipodoge = document.getElementById("Hipodoge") 
    inputCapipepo = document.getElementById("Capipepo")
    inputRatigueya = document.getElementById("Ratigueya") //Se capitalizan los nombres de id ya que el valor de la propiedad *nombre* en las instancias compartidas con la variable mokepon comienzan en mayúsculas
  })
  
  sectionReiniciar.style.display = "none"  
  botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador)
  botonReiniciar.addEventListener("click", reiniciarJuego)
  unirseAlJuego()
}
//Función para conectar el frontend con el backend
function unirseAlJuego() {
  fetch("http://localhost:5500/unirse") //fetch(url) hace un GET (una petición para obtener algo) a la URL que se le especifique. No podemos trabajar con lo que nos retorne directamente, ya que el servidor se tomará un tiempo en responder.
       .then(function (res) {
           if (res.ok) {
              res.text() //Respuesta en tipo texto
                 .then(function (respuesta) {
                     console.log(respuesta)
                     jugadorId = respuesta
                 })//Para eso utilizaremos el .then(func), que ejecutará el código de la función que le demos pasándole la respuesta del servidor como parámetro.
           }
         })
}

function seleccionarMascotaJugador() {
   // Condicional de seleccion de mascotas by checked
  if (inputHipodoge.checked) {
  //Manipulacion del DOM con la funcion innerHTML para imprimir el nombre de las mascotas seleccionadas
    mascotaPlayer.innerHTML = inputHipodoge.id //inputHipodoge ya es un objeto, la cual id es su atributo
    mascotaJugador = inputHipodoge.id
  } else if (inputCapipepo.checked) { 
    mascotaPlayer.innerHTML = inputCapipepo.id
    mascotaJugador = inputCapipepo.id
  } else if (inputRatigueya.checked) {    
    mascotaPlayer.innerHTML = inputRatigueya.id
    mascotaJugador = inputRatigueya.id
  } else {
    alert("¡Por favor selecciona una mascota!")
    return
  }

  sectionSeleccionarMascota.style.display = "none" 
  sectionSeleccionarAtaque.style.display = "none" //Para ocultar la seccion es con la regla display:"none" y para mostrar la seccion es con la regla display:"block"
  sectionVerMapa.style.display = "flex"
// Forma harcodeada de agregar imagenes dentro del canvas
// let imagenCapipepo = new Image() //Funcion para cargar una imagen desde el Pc al JS
// imagenCapipepo.src = capipepo.imagen //Imagen propiedad del objeto de la clase Mokepon 
  // lienzo.fillRect(5,15,20,40) //Función para crear un rectángulo dentro del canvas. Parametros: posiciónX, posiciónY, ancho, alto
  
  iniciarMapa()
  seleccionarMokepon(mascotaJugador)
  extraerAtaques()
}
//Función para enviar al backend el mokepon seleccionado y que éste nos devuelva un id
function seleccionarMokepon(mascotaJugador) {
    fetch(`http://localhost:5500/mokepon/${jugadorId}`, {//Estructura tipo JSON para agregar datos de tipo POST
         method: "post", // Indicamos que el endpoint es un POST
         headers: {//Cabecera de metadatos que la computadora interpreta como datos reales
            "Content-Type": "application/json" // Indicamos que estamos enviando un JSON
         },
         body: JSON.stringify({ // Creamos un JSON con la información para el backend
             mokepon: mascotaJugador
         })
  })
}

function extraerAtaques() { //Se crea esta función para extraer los ataques de cada instancia de Mokepon
  let ataques
  for (let i = 0; i < mokepones.length; i++) { //Para iterar en los indices del array mokepones
      if (mascotaJugador === mokepones[i].nombre) { 
         ataques = mokepones[i].ataques
      } // Guardar en la variable *mascotaJugador* el nombre de los mokepones ej: mascotaJugador = inputRatigueya.id para compararlos con el array con su propiedad *nombre*. Si son verdaderos ambos valores entonces extraer los ataques de cada mokepon en una variable para luego ser impresa
  }
  mostrarAtaques(ataques)
}
//Función para imprimir los botones de ataque
function mostrarAtaques(ataques) {
  ataques.forEach((ataque) => {
    ataquesMokepon = ` 
    <button id=${ataque.id} class="ataques BAtaque">${ataque.nombre}</button>
    `
    contenedorAtaques.innerHTML += ataquesMokepon
  })
  // Crear variables let para los botones de ataque y conectarlos con el id del array ataques dentro del array mokepones
  botonFuego = document.getElementById("boton-fuego")
  botonAgua = document.getElementById("boton-agua")
  botonTierra = document.getElementById("boton-tierra")

  botones = document.querySelectorAll(".BAtaque") // Función para seleccionar todos los elementos que tengan algo en común
  sequenciaAtaque()
}
// Eventos de click dinamicos
function sequenciaAtaque() {
  botones.forEach((boton) => { //Por cada boton dentro del array botones ejecutar el evento de click
    boton.addEventListener("click", (e) => { //Asignacion del Evento de click para cada boton
      if (e.target.textContent === "🔥") { // e(objeto que nos permite identicar el boton seleccionado), target(propiedad tomada de *PointerEvent* en la consola), textContent(propiedad de *target*)
         ataqueJugador.push("FUEGO") // Para guardar la secuencia de los ataques seleccionados por el jugador en el array ataqueJugador
         boton.disabled = true //Funcion para desactivar un boton en HTML desde Javascript
      } else if (e.target.textContent === "💧") {
         ataqueJugador.push("AGUA")
         boton.disabled = true
      } else if (e.target.textContent === "🌱") {
         ataqueJugador.push("TIERRA")
         boton.disabled = true
      } 
      
      if (ataqueJugador.length === 5) { 
          enviarAtaques()
      }
    })
  })
}

function enviarAtaques() {
    fetch(`http://localhost:5500/mokepon/${jugadorId}/ataques`, {
          method: "post",
          headers: {
              "Content-Type" : "application/json"
          },
          body: JSON.stringify({
              ataques: ataqueJugador
          })
    })
  intervalo = setInterval(obtenerAtaques, 500)
}
// Función para solicitar los ataques del enemigo y requerirlos cada milisegundo
function obtenerAtaques() {
    fetch(`http://localhost:5500/mokepon/${enemigoId}/ataques`)
          .then(function (res) {
              if (res.ok) {
                  res.json()
                      .then(function ({ataques}) { //Corregir condicional y guiarce con el algoritmo de la función sequenciaAtaque()
                          if (ataques.length === 5) {
                              ataqueEnemigo = ataques                        
                              resultadoCombate()
                          }
                      })
              }
          })
}

function seleccionarMascotaPc(enemigo) {
  mascotaPc.innerHTML = enemigo.nombre
}
// Funciones para los botones de ataque enemigo
//Otra forma de manipular el DOM
function crearMensaje(resultado) { //Funcion para imprimir los resultados del combate
  let nuevoAtaqueDelJugador = document.createElement("p")
  let nuevoAtaqueDelEnemigo = document.createElement("p")
  // let parrafo = document.createElement("p") funcion para crear un elemento de HTML desde Javascript, en este caso la etiqueta <p>

  //ElementoPadre.appendChild(ElementoHijo) Crea un nodo en el elemento HTML añadido
  ataqueDelJugador.appendChild(nuevoAtaqueDelJugador)
  ataqueDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
  
  parrafoMensajes.innerHTML = resultado
  nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
  nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo
}
//Función para guardar los indices de los ataques tanto del jugador como del enemigo
function indexRivales(jugador, enemigo) {
  indexAtaqueJugador = ataqueJugador[jugador]
  indexAtaqueEnemigo = ataqueEnemigo[enemigo]
} 

function resultadoCombate() {
  clearInterval(intervalo)
  
  for (let index = 0; index < ataqueJugador.length; index++) {//index guardará cada indice del array
      if (ataqueJugador[index] === ataqueEnemigo[index]) {
         indexRivales(index, index) //En ésta funcion es donde se guarda las secuencias de ataque Jugador/Enemigo
         crearMensaje("EMPATE!!!")
      } else if (ataqueJugador[index] === "AGUA" && ataqueEnemigo[index] === "FUEGO") { 
         indexRivales(index, index)
         crearMensaje("GANASTE!!!")
         victoriasJugador++
         contadorVictoriasJugador.innerHTML = victoriasJugador
      } else if (ataqueJugador[index] === "FUEGO" && ataqueEnemigo[index] === "TIERRA") {
         indexRivales(index, index)
         crearMensaje("GANASTE!!!")
         victoriasJugador++
         contadorVictoriasJugador.innerHTML = victoriasJugador
      } else if (ataqueJugador[index] === "TIERRA" && ataqueEnemigo[index] === "AGUA") {
         indexRivales(index, index)
         crearMensaje("GANASTE!!!")
         victoriasJugador++
         contadorVictoriasJugador.innerHTML = victoriasJugador
      } else {
         indexRivales(index, index)
         crearMensaje("PERDISTE!!!")
         victoriasEnemigo++
         contadorVictoriasEnemigo.innerHTML = victoriasEnemigo
      }
    }
  
  revisarVictorias()
}

function revisarVictorias() {
  if (victoriasJugador === victoriasEnemigo) {
    mensajeFinal("Ha sido un empate (-_-)")
  } else if (victoriasJugador < victoriasEnemigo) {
    mensajeFinal("Has perdido el combate (>...<)") 
  } else if (victoriasJugador > victoriasEnemigo) {
    mensajeFinal("Has ganado el combate (^o^)")
  }
}
//Funcion donde se desactivan los botones de ataque y se activa el boton reiniciar
function mensajeFinal(resultadoFinal) {
  sectionReiniciar.style.display = "block"
  parrafoMensajeFinal.innerHTML = resultadoFinal
} 

function reiniciarJuego() {
  location.reload() //Metodo para refrescar la pagina
}

function numAleatorio(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min)
}
//Función para dibujar el Canvas
function pintarCanvas() {
  mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
  mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
  lienzo.clearRect(0, 0, canvasMapa.width, canvasMapa.height) //Función para limpiar el canvas
  lienzo.drawImage(mapaFondo, 0, 0, canvasMapa.width, canvasMapa.height)// Se agrega imagen fondo
  mascotaJugadorObjeto.pintarMokepon() //Dibujar nuestra mascota
  enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)
  mokeponesEnemigos.forEach(function (mokepon) {
    mokepon.pintarMokepon()
    revisarColision(mokepon)
  })
  //Se plantea una condicional dentro de ésta función para verificar las colisiones si nuestra mascota está en movimiento: if (mascotaJugadorObjeto.velocidadX !== 0 || mascotaJugadorObjeto.velocidadY !== 0) { revisarColision(hipodogeEnemigo)}
}
//Función para enviar coordenadas de la posición del mokepon al backend
function enviarPosicion(x, y) {
    fetch(`http://localhost:5500/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            x,
            y //Estas dos variables hacen referencia a la abreviatura de (x = x) y (y = y)
        })
    })
      .then(function (res) { //Se captura la respuesta tipo JSON
        if (res.ok) {
            res.json()
                .then(function ({enemigos}) { //Respuesta de tipo JSON
                      console.log(enemigos)
                      // Aqui se realiza la condicional para dibujar el mokepon enemigo en el mapa
                      mokeponesEnemigos = enemigos.map(function (enemigo) { //Función map permite, además de recorrer cada elemento de un array, devolver otro array modificado a partir del original.
                          let mokeponEnemigo = null
                          const mokeponNombre = enemigo.mokepon.nombre || ""
                          if (mokeponNombre === "Hipodoge") {
                              mokeponEnemigo = new Mokepon("Hipodoge", "./assets/mokepons_mokepon_hipodoge_attack.png", 5, "./assets/hipodoge.png", enemigo.id)
                          } else if (mokeponNombre === "Capipepo") {
                              mokeponEnemigo = new Mokepon("Capipepo", "./assets/mokepons_mokepon_capipepo_attack.png", 5, "./assets/capipepo.png", enemigo.id)                          
                          } else if (mokeponNombre === "Ratigueya") {
                              mokeponEnemigo = new Mokepon("Ratigueya", "./assets/mokepons_mokepon_ratigueya_attack.png", 5, "./assets/ratigueya.png", enemigo.id)      
                          }        
                          mokeponEnemigo.x = enemigo.x
                          mokeponEnemigo.y = enemigo.y
                        
                          return mokeponEnemigo
                      })        
                })
        }
      })
}
//Función para mover al mokepon seleccionado con el evento onMouseDown
function moverDerecha() {
  mascotaJugadorObjeto.velocidadX = 5
}

function moverIzquierda() {
  mascotaJugadorObjeto.velocidadX = -5
}

function moverAbajo() {
  mascotaJugadorObjeto.velocidadY = 5
}

function moverArriba() {
  mascotaJugadorObjeto.velocidadY = -5
}

function detenerMovimiento() { //Función invocada desde HTML con el evento onMouseUp
  mascotaJugadorObjeto.velocidadX = 0
  mascotaJugadorObjeto.velocidadY = 0
}
//Función donde está la condicional switch para asignar las funciones a las flechas del teclado
function flechasTeclado(event) {
  switch (event.key) {
    case "ArrowUp":
      moverArriba()
      break;
    case "ArrowDown":
      moverAbajo()
      break;
    case "ArrowLeft":
     moverIzquierda()
      break;
    case "ArrowRight":
      moverDerecha()
      break;
      
    default:
      break;
  }
}
//Función para guadar los addEventListener que detectan las flechas del teclado al ser presionadas
function iniciarMapa() { 
  mascotaJugadorObjeto = obtenerObjetoMascota()
  intervalo = setInterval(pintarCanvas, 50) //Función que repite otra funcion en intervalos de tiempo. Parametros: Función a aplicar, tiempo en milisegundos
  window.addEventListener("keydown", flechasTeclado)
  window.addEventListener("keyup", detenerMovimiento)
  responsiveCanvas()
}

function obtenerObjetoMascota() {
  for (let i = 0; i < mokepones.length; i++) {
    if (mascotaJugador === mokepones[i].nombre) {
       return mokepones[i]
    }
  }
}
//Función para evaluar cuando nuestro mokepon colisiona con otro mokepon
function revisarColision(enemigo) {
  const arribaEnemigo = enemigo.y //La mascota enemigo empieza en posicion Y
  const abajoEnemigo = enemigo.y + enemigo.alto //Y termina en Y + alto
  const derechaEnemigo = enemigo.x + enemigo.ancho
  const izquierdaEnemigo = enemigo.x
  //Lo mismo para la mascota del jugador
  const arribaMascota = mascotaJugadorObjeto.y
  const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
  const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
  const izquierdaMascota = mascotaJugadorObjeto.x
  
  if (abajoMascota < arribaEnemigo || 
      arribaMascota > abajoEnemigo ||
      derechaMascota < izquierdaEnemigo ||
      izquierdaMascota > derechaEnemigo) {
    return //Cuando solo se quiere que se cumpla la condición sin ejecutar una orden
  } else {
    detenerMovimiento()
    clearInterval(intervalo)
    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = "flex"
    sectionVerMapa.style.display = "none"
    seleccionarMascotaPc(enemigo) 
  }
}
// Función para calcular las dimensiones del canvas para aplicar Responsive desde JS.
function responsiveCanvas() {
  altoDelMapa = anchoDelMapa * 600 / 800
  canvasMapa.width = anchoDelMapa
  canvasMapa.height = altoDelMapa
  
  if (canvasMapa.width <= 320) {
     canvasMapa.width = anchoDelMapa
     canvasMapa.height = altoDelMapa
  } else if (canvasMapa.width <= 425) {
     canvasMapa.width = anchoDelMapa
     canvasMapa.height = altoDelMapa
  } else if (canvasMapa.width <= 768) {
     canvasMapa.width = anchoDelMapa
     canvasMapa.height = altoDelMapa
  } else if (canvasMapa.width <= 1024) {
     canvasMapa.width = anchoDelMapa
     canvasMapa.height = altoDelMapa
  } else if (canvasMapa.width >= 1440) {
     canvasMapa.width = 1024
     canvasMapa.height = 768
  }
}

window.addEventListener("load", iniciarJuego)