const express = require('express');
const router = express.Router();
var session = require('express-session');
const URI = process.env.MONGODB_URI;
var mongoose = require('mongoose');
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
  var Usuarios_reloj = mongoose.model("Usuarios_reloj", esquemaUsuario);
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
        Usuarios_reloj.findOne({id: req.body.id}).then((resBuscUno) => {
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
  res.render('plantilla_sin_main_protegida_reloj', {
    id: req.session.user.id,
    //id: req.session.user.preferencias.color_fondo,
    color_fondo: req.session.user.preferencias.color_fondo,
    color_fuente: req.session.user.preferencias.color_fuente,
    tamano_hora: req.session.user.preferencias.tamano_hora,
    tamano_segundos: req.session.user.preferencias.tamano_segundos,
    tamano_fecha: req.session.user.preferencias.tamano_fecha,
  })
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
    Usuarios_reloj.findOne({id: reqBody.id}).then((resBuscUno) => {
      if (resBuscUno) {
        // Si el usuario ya existe, muestra un mensaje de error
        res.render('login', {
          mensaje: "El usuario ya existe, inicie sesión", 
          tipo: "error"
        });
      } else {
        // Si el usuario no existe, crea uno nuevo
        var newUser = new Usuarios_reloj({
          id: reqBody.id,
          password: reqBody.password,
          preferencias: {
            color_fondo: '#000',
            color_fuente: '#00ff00',
            tamano_hora: 90,
            tamano_segundos: 45,
            tamano_fecha: 25
          }
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
router.post('/editar-fondo/:id', async function(req, res){
    const Usuarios_reloj = mongoose.model('Usuarios_reloj');
    const persona_encontrada = await Usuarios_reloj.findOne({id: req.params.id});
    const persona_editada = await Usuarios_reloj.findOneAndUpdate({id: req.params.id}, {
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
    const Usuarios_reloj = mongoose.model('Usuarios_reloj');
    const persona_encontrada = await Usuarios_reloj.findOne({id: req.params.id});
    const persona_editada = await Usuarios_reloj.findOneAndUpdate({id: req.params.id}, {
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
    const Usuarios_reloj = mongoose.model('Usuarios_reloj');
    const persona_encontrada = await Usuarios_reloj.findOne({id: req.params.id});
    const persona_editada = await Usuarios_reloj.findOneAndUpdate({id: req.params.id}, {
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
  const Usuarios_reloj = mongoose.model('Usuarios_reloj');
  const persona_encontrada = await Usuarios_reloj.findOne({id: req.params.id});
  const persona_editada = await Usuarios_reloj.findOneAndUpdate({id: req.params.id}, {
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
router.get('*', function(req, res){
    res.redirect('/');
  });
module.exports = router;