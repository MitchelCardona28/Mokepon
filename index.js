const express = require('express') //Importando la libreria de express al proyecto 
const cors = require('cors') //Importando CORS 

const app = express() //Crear aplicación de Express

app.use(express.static('public'))//Función para servir archivos estáticos como imágenes, archivos HTML, archivos CSS y archivos JavaScript. Se crea una carpeta 'public' dentro de la carpeta mokepon para luego guardar los tipos de archivos mencionados. Luego desde la misma red Wi-Fi se ejecuta http://localhost:8080 una vez esté el servidor encendido. Para ejecutar la aplicación en diferentes dispositivos: desde la terminal de comandos ejecutar el comando 'ipconfig' y copiar la IP de la Dirección Ipv4 al navegador y agregar el puerto :8080, pero antes se debe copiar esa Ip en el 'Fetch' del archivo JS del frontend.
app.use(cors())//Esta función ayuda a solucionar el error de CORS
app.use(express.json())//Habilita las peticiones tipo POST para datos con estructura tipo JSON

const jugadores = [] 

class Jugador {
  constructor(id) {
    this.id = id  
  }
  
  asignarMokepon(mokepon) {
    this.mokepon = mokepon
  }
  
  actualizarPosicion(x, y) {
    this.x = x 
    this.y = y
  }

  asignarAtaques(ataques) {
    this.ataques = ataques
  }
  
} 

class Mokepon {
  constructor (nombre) {
    this.nombre = nombre
  }
}

//Endpoint para obtener datos. Llamamos endpoint, o punto final, a cada URL que el backend expone para que el front-end utilice, ya sea para la obtención de datos, creación, actualización, etc.
app.get("/unirse", (req, res) => { //Esto se llama Arrow Function.
    const id = `${Math.random()}` //Se van a ingresar nuevos jugadores y a cada uno se les dara un id
    const jugador = new Jugador(id)
    jugadores.push(jugador)
    res.setHeader("Access-Control-Allow-Origin", "*") //setHeader() Función de cabecera que contiene metadatos sobre otorgar permisos de conexión al servidor. El asterísco indica que se puede ingresar al servidor desde todos los origenes (no recomendable). otra forma de resolver es: Habilita CORS instalando su respectiva dependencia con npm install cors y realizando la importación de la misma. Luego importamos CORS:
  //const cors = require('cors'); Activamos CORS: app.use(cors());
    res.send(id)
}) //Aplicación o función para responder la petición al cliente. Los parametros: 1.La url de solicitud de recurso, 2.Protocolo para responder la solicitud.
//Aplicando el método POST para recibir datos tipo JSON
app.post("/mokepon/:jugadorId", (req, res) => { //Forma de crear una variable en la URL con los dos puntos ej:/:jugadorid
  const jugadorId = req.params.jugadorId || "" // Capturamos parámetros de URL
  const nombre = req.body.mokepon || "" // Capturamos el cuerpo de la solicitud
  const mokepon = new Mokepon(nombre)

  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id) //Función para recorrer y buscar dentro de los indices del array jugadores

  if (jugadorIndex >= 0) { //Condicional para verificar si existe un id asigado y posteriormente asignar un mokepon
      jugadores[jugadorIndex].asignarMokepon(mokepon)
  }
  
  console.log(jugadores)
  console.log(jugadorId)
  res.end()//Método de finalizar la carga del navegador cuando se obtiene la respuesta
})
//Endpoint para recibir las coordenadas de los jugadores del lado del frontend
app.post("/mokepon/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    if (jugadorIndex >= 0) {       
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }

  const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id) //Función filter permite recorrer y filtrar elementos de un array para obtener un sub-array con menos cantidad de elementos a partir de una condición lógica.
  console.log(enemigos)
  res.send({
    enemigos
  }) //Solo se pueden enviar respuestas tipo JSON cuando se trata de una lista
})
//Endpoint para recibir los ataques del lado del frontend
app.post("/mokepon/:jugadorId/ataques", (req, res) => { //Forma de crear una variable en la URL con los dos puntos ej:/:jugadorid
  const jugadorId = req.params.jugadorId || "" // Capturamos parámetros de URL
  const ataques = req.body.ataques || [] // sino devuelve ataques entonces una lista vacía
  

  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id) //Función para recorrer y buscar dentro de los indices del array jugadores

  if (jugadorIndex >= 0) { //Condicional para verificar si existe un id asignado y posteriormente asignar un mokepon
      jugadores[jugadorIndex].asignarAtaques(ataques)
  }
  
  res.end()//Método de finalizar la carga del navegador cuando se obtiene la respuesta
})
//Endpoint para enviar los ataques que seleccionaron el jugador y el enemigo
app.get("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || ""
  const jugador = jugadores.find((jugador) => jugador.id === jugadorId) //Esta función devuelve falso o verdadero dependiendo de lo que se busque dentro de la lista o array
  res.send({
    ataques: jugador.ataques || []
  })
})

app.listen(5500, () => {
    console.log("Servidor funcionando")
}) //Aplicación o función para escuchar la petición del cliente. Los parametros: 1.Número del puerto para levantar el servidor web, 2.Callback. http://localhost:8080 para ver la respuesta de la petición desde el navegador.