const express = require('express');
const path = require('path'); 
const PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

app.set('view engine', 'pug');
app.set('views', [
  './views'
]);
app.use(express.static('public'));
var session = require('express-session');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/mi_db');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(session({
  saveUninitialized: false,
  resave: true,
  secret: 'un-secreto-muy-seguro'
}));
app.get('/', function (req, res) {
    // Agregar encabezados para deshabilitar la caché
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
	res.render('plantilla_sin_main_reloj', {
        title: "Mi reloj web",
        google_site_verification_content:"IlwE29oPx3IJib2qhYUc07f7uJp7SpVM12hd1DnPiqE",
        apple_touch_icon_180_href: 'https://gonzalo-web-pages.onrender.com/mi-reloj-web/apple-touch-icon.png',
        icon_32_href: '/favicon-32x32.png',
        icon_16_href: '/favicon-16x16.png',
        manifest_href: '/site.webmanifest',
        icon_safari_color: '#da532c',
        theme_color_content: '#ffffff',
        description_content: 'Reloj personalizado para tu escritorio. Elige el color y tamaño de fondo y fuente para crear un reloj único y a tu medida.',
        og_site_name: 'My Web Clock',
        og_title: 'Reloj personalizado para tu escritorio',
        og_description: 'Reloj personalizado para tu escritorio. Elige el color y tamaño de fondo y fuente para crear un reloj único y a tu medida.',
        og_url: 'https://gonzalo-web-pages.onrender.com/mi-reloj-web-pug',
        og_image: 'https://gonzalo-web-pages.onrender.com/mi-reloj-web/og_image1.jpg',
        article_tag_1: 'Clock',
        article_tag_2: 'Customizable',
        article_tag_3: 'App',
        //modo: req.cookies.modo
      });      
});
app.get('/login-reloj', function (req, res) {
    res.render("login_reloj_sin_main")
  })
app.post('/login-reloj', function(req, res){
    console.log(req.body.id +' '+ req.body.password);
    if(!req.body.id || !req.body.password){
        res.render('login', {message: "Por favor, introduce tanto el ID como la contraseña"});
    } else {
        Usuarios_reloj.findOne({id: req.body.id}).then((resBuscUno) => {
        if (resBuscUno == null) {
            res.render('signup_reloj_sin_main', {message: "Usuario no encontrado. Regístrese"})
        } else {
            if(resBuscUno.id === req.body.id && resBuscUno.password === req.body.password){
            req.session.user = resBuscUno;
            res.redirect('/plantilla_sin_main_protegida_reloj');
            } else {
            res.render('login_reloj_sin_main', {message: "Credenciales no válidas."});
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
        console.log(req.session.user);
        next(err); //Error, intentando acceder a una página no autorizada
    }
}
app.get('/plantilla_sin_main_protegida_reloj', checkSignIn, function(req, res){
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
app.get('/logout', function(req, res){
  req.session.destroy(function(){
     console.log("Usuario desconectado.")
  });
  res.redirect('/');
});
app.get('/registrarse', function(req, res){
    res.render('signup_reloj_sin_main');
});
app.post('/registrarse', function(req, res){
  var reqBody = req.body;
  if (!reqBody.id || !reqBody.password) {
    res.render('mostrar_mensaje', {
      mensaje: "Lo siento, proporcionaste información incorrecta", 
      tipo: "error"
    });
  } else {
    Usuarios_reloj.findOne({id: reqBody.id}).then((resBuscUno) => {
      if (resBuscUno) {
        // Si el usuario ya existe, muestra un mensaje de error
        res.render('mostrar_mensaje', {
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
          res.render('login_reloj_sin_main', {
            mensaje: "Usuario creado correctamente. Inicie sesión", 
            tipo: "éxito", 
            persona: reqBody
          });
          console.log('Document saved successfully');
        }).catch(err => {
          res.render('mostrar_mensaje', {
            mensaje: "Error de base de datos", 
            tipo: "error"
          });
          console.error('Error saving document:', err);
        });
      }
    }).catch(err => {
      // Manejar errores de la búsqueda de usuario
      res.render('mostrar_mensaje', {
        mensaje: "Error de base de datos", 
        tipo: "error"
      });
      console.error('Error searching for document:', err);
    });
    console.log(reqBody);
  }
});
app.use('/plantilla_sin_main_protegida_reloj', function(err, req, res, next){
    console.log(err);
    //El usuario debe estar autenticado. Redirígelo para iniciar sesión.
    res.redirect('/login-reloj');
});
app.get('/signup-reloj', function (req, res) {
    res.render("signup_reloj_sin_main")
});
app.post('/editar-fondo/:id', async function(req, res){
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
      console.log(persona_encontrada.preferencias)
    }else{
      console.log('Error: no se encontró el usuario');
    }
});
app.post('/editar-fuente/:id', async function(req, res){
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
      console.log(persona_encontrada.preferencias)
    }else{
      console.log('Error: no se encontró el usuario');
    }
});
app.post('/editar-hora/:id', async function(req, res){
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
      console.log(persona_encontrada.preferencias)
    }else{
      console.log('Error: no se encontró el usuario');
    }
});
app.post('/editar-fecha/:id', async function(req, res){
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
    console.log(persona_encontrada.preferencias)
  }else{
    console.log('Error: no se encontró el usuario');
  }
});

app.listen(PORT, function () {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});