const express = require('express');
const router = express.Router();
var session = require('express-session');
const URI = process.env.MONGODB_URI;
var mongoose = require('mongoose');
// Ruta pública para mantener MongoDB activo (sin redirecciones ni middlewares)
router.get('/ping-mongo', async (req, res) => {
  try {
    // Realiza una operación mínima en la base de datos
    await usuarios_reloj.findOne().limit(1).lean();
    res.status(200).send('MongoDB activo');
  } catch (err) {
    console.error('Error al hacer ping a MongoDB:', err);
    res.status(500).send('Error');
  }
});
const uri = 'mongodb://127.0.0.1:27017/mi_db';
//mongoose.connect(uri);
mongoose.connect(URI);
var esquemaUsuario = mongoose.Schema({
    id: String,
    password: String,
    preferencias: {
      color_fondo: String,
      color_fuente: String,
      tamano_hora: Number,
      tamano_segundos: Number,
      tamano_fecha: Number
    }
  });
  var usuarios_reloj = mongoose.model("usuarios_reloj", esquemaUsuario);
  router.use(session({
    saveUninitialized: false,
    resave: true,
    secret: 'un-secreto-muy-seguro'
  }));
router.get('/login', function (req, res) {
    res.render("login")
  })
router.post('/login', function(req, res){
    //console.log(req.body.id +' ha iniciado sesión');
    if(!req.body.id || !req.body.password){
        res.render('login', {message: "Por favor, introduce tanto el ID como la contraseña"});
    } else {
        usuarios_reloj.findOne({id: req.body.id}).then((resBuscUno) => {
        if (resBuscUno == null) {
            res.render('signup_reloj_sin_main', {message: "Usuario no encontrado. Regístrese"})
        } else {
            if(resBuscUno.id === req.body.id && resBuscUno.password === req.body.password){
            req.session.user = resBuscUno;
            //res.redirect('/plantilla_sin_main_protegida_reloj');
            let uri_usuario = `/acceso/reloj/${req.body.id}`;
            res.redirect(uri_usuario);
            } else {
            res.render('login', {message: "Credenciales no válidas."});
            }
        }
        
        
        });
    }
});
function checkSignIn(req, res, next){
    if(req.session.user){
        next(); //Si la sesión existe, continúa a la página
    } else {
        var err = new Error("No has iniciado sesión.");
        //console.log(req.session.user.id);
        next(err); //Error, intentando acceder a una página no autorizada
    }
}
router.get('/reloj/:id', checkSignIn, function(req, res){
  usuarios_reloj.findOne({id: req.session.user.id}).then((resBuscUno) => {
    //console.log(resBuscUno);
    res.render('plantilla_sin_main_protegida_reloj', {
      id: resBuscUno.id,
      color_fondo: resBuscUno.preferencias.color_fondo,
      color_fuente: resBuscUno.preferencias.color_fuente,
      tamano_hora: resBuscUno.preferencias.tamano_hora,
      tamano_segundos: resBuscUno.preferencias.tamano_segundos,
      tamano_fecha: resBuscUno.preferencias.tamano_fecha,
    });
  });
});

router.get('/logout', function(req, res){
  req.session.destroy(function(){
     //console.log("Usuario desconectado.")
  });
  res.redirect('/');
});
router.get('/registrarse', function(req, res){
    res.render('signup_reloj_sin_main');
});
router.post('/registrarse', function(req, res){
  var reqBody = req.body;
  if (!reqBody.id || !reqBody.password) {
    res.render('signup_reloj_sin_main', {
      mensaje: "Lo siento, proporcionaste información incorrecta", 
      tipo: "error"
    });
  } else {
    usuarios_reloj.findOne({id: reqBody.id}).then((resBuscUno) => {
      if (resBuscUno) {
        // Si el usuario ya existe, muestra un mensaje de error
        res.render('login', {
          mensaje: "El usuario ya existe, inicie sesión", 
          tipo: "error"
        });
      } else {
        // Si el usuario no existe, crea uno nuevo

        const preferencias = reqBody.preferencias || {
          color_fondo: '#000',
          color_fuente: '#00ff00',
          tamaño_hora: 90,
          tamaño_segundos: 45,
          tamaño_fecha: 25
        };

        var newUser = new usuarios_reloj({
          id: reqBody.id,
          password: reqBody.password,
          preferencias: preferencias
        });

        newUser.save().then(() => {
          res.render('login', {
            mensaje: "Usuario creado correctamente. Inicie sesión", 
            tipo: "éxito", 
            persona: reqBody
          });
          //console.log('Document saved successfully');
        }).catch(err => {
          res.render('signup_reloj_sin_main', {
            mensaje: "Error de base de datos. Inténtelo de nuevo más tarde", 
            tipo: "error"
          });
          console.error('Error saving document:', err);
        });
      }
    }).catch(err => {
      // Manejar errores de la búsqueda de usuario
      res.render('signup_reloj_sin_main', {
        mensaje: "Error de base de datos. Inténtelo de nuevo más tarde", 
        tipo: "error"
      });
      console.error('Error searching for document:', err);
    });
    //console.log(reqBody);
  }
});
router.use('/reloj/:id', function(err, req, res, next){
    console.log(err);
    //El usuario debe estar autenticado. Redirígelo para iniciar sesión.
    res.redirect('/login');
});
router.get('/eliminar-cuenta', function (req,res) {
  res.render('eliminar_cuenta');
})
router.post('/eliminar-cuenta', async function(req, res){
  const colecciónPersona = mongoose.model('usuarios_reloj');
  const persona_encontrada = await colecciónPersona.findOneAndDelete({
    id: req.body.id,
    password: req.body.password
  });
  if (persona_encontrada) {
    res.render('signup_reloj_sin_main', {
        mensaje: "Cuenta eliminada con éxito", 
        tipo: "éxito",
    });
  }else{
    res.render('signup_reloj_sin_main', {
      mensaje: "Error al borrar: No se encontró la cuenta", 
      tipo: "error"
    });
  };
}
);
router.post('/editar-fondo/:id', async function(req, res){
    const usuarios_reloj = mongoose.model('usuarios_reloj');
    const persona_encontrada = await usuarios_reloj.findOne({id: req.params.id});
    const persona_editada = await usuarios_reloj.findOneAndUpdate({id: req.params.id}, {
      preferencias: {
        color_fondo: req.body.color_fondo,
        color_fuente: persona_encontrada.preferencias.color_fuente,
        tamano_hora: persona_encontrada.preferencias.tamano_hora,
        tamano_segundos: persona_encontrada.preferencias.tamano_segundos,
        tamano_fecha: persona_encontrada.preferencias.tamano_fecha
      }
    });

    if (persona_encontrada){
      //console.log(persona_encontrada.preferencias)
    }else{
      console.log('Error: no se encontró el usuario');
    }
});
router.post('/editar-fuente/:id', async function(req, res){
    const usuarios_reloj = mongoose.model('usuarios_reloj');
    const persona_encontrada = await usuarios_reloj.findOne({id: req.params.id});
    const persona_editada = await usuarios_reloj.findOneAndUpdate({id: req.params.id}, {
      preferencias: {
        color_fondo: persona_encontrada.preferencias.color_fondo,
        color_fuente: req.body.color_fuente,
        tamano_hora: persona_encontrada.preferencias.tamano_hora,
        tamano_segundos: persona_encontrada.preferencias.tamano_segundos,
        tamano_fecha: persona_encontrada.preferencias.tamano_fecha
      }
    });

    if (persona_encontrada){
      //console.log(persona_encontrada.preferencias)
    }else{
      console.log('Error: no se encontró el usuario');
    }
});
router.post('/editar-hora/:id', async function(req, res){
    const usuarios_reloj = mongoose.model('usuarios_reloj');
    const persona_encontrada = await usuarios_reloj.findOne({id: req.params.id});
    const persona_editada = await usuarios_reloj.findOneAndUpdate({id: req.params.id}, {
      preferencias: {
        color_fondo: persona_encontrada.preferencias.color_fondo,
        color_fuente: persona_encontrada.preferencias.color_fuente,
        tamano_hora: req.body.tamano_hora,
        tamano_segundos: persona_encontrada.preferencias.tamano_segundos,
        tamano_fecha: persona_encontrada.preferencias.tamano_fecha
      }
    });

    if (persona_encontrada){
      //console.log(persona_encontrada.preferencias)
    }else{
      console.log('Error: no se encontró el usuario');
    }
});
router.post('/editar-fecha/:id', async function(req, res){
  const usuarios_reloj = mongoose.model('usuarios_reloj');
  const persona_encontrada = await usuarios_reloj.findOne({id: req.params.id});
  const persona_editada = await usuarios_reloj.findOneAndUpdate({id: req.params.id}, {
    preferencias: {
      color_fondo: persona_encontrada.preferencias.color_fondo,
      color_fuente: persona_encontrada.preferencias.color_fuente,
      tamano_hora: persona_encontrada.preferencias.tamano_hora,
      tamano_segundos: persona_encontrada.preferencias.tamano_segundos,
      tamano_fecha: req.body.tamano_fecha
    }
  });

  if (persona_encontrada){
    //console.log(persona_encontrada.preferencias)
  }else{
    console.log('Error: no se encontró el usuario');
  }
});
router.get("/acceso/cron", function(req, res) {
  // Crea una instancia de XMLHttpRequest
  var xhr = new XMLHttpRequest();

  // Configura la solicitud HTTP
  xhr.open("GET", "https://pebble-reliable-vision.glitch.me", true);

  // Envía la solicitud HTTP
  xhr.send();

  // Escucha el evento `onload` para procesar la respuesta
  xhr.onload = function() {
    if (xhr.status === 200) {
      // La solicitud HTTP se realizó correctamente
      var datos = JSON.parse(xhr.responseText);
      res.send(datos);
        //console.log(datos);
    } else {
      // La solicitud HTTP no se realizó correctamente
      res.status(xhr.status).send(xhr.statusText);
    }
  };
});
router.get('*', function(req, res){
    res.redirect('/');
  });
module.exports = router;
