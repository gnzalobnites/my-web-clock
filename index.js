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
    tamaño_hora: Number,
    tamaño_segundos: Number,
    tamaño_fecha: Number
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
        icon_32_href: '/mi-reloj-web/favicon-32x32.png',
        icon_16_href: '/mi-reloj-web/favicon-16x16.png',
        manifest_href: '/mi-reloj-web/site.webmanifest',
        icon_safari_color: '#da532c',
        theme_color_content: '#ffffff',
        description_content: 'Aprende JavaScript desde cero con este curso gratuito. En este curso aprenderás los fundamentos de Python, como variables, tipos de datos, operaciones, flujo de control, funciones, objetos, módulos y excepciones. También aprenderás a usar librerías populares de Python, como NumPy, Pandas y Matplotlib.',
        og_site_name: 'My Web Clock',
        og_title: 'Reloj personalizado para tu escritorio',
        og_description: 'Reloj personalizado para tu escritorio. Elige el color y tamaño de fondo y fuente para crear un reloj único y a tu medida."',
        og_url: 'https://gonzalo-web-pages.onrender.com/mi-reloj-web-pug',
        og_image: 'https://gonzalo-web-pages.onrender.com/mi-reloj-web/og_image1.jpg',
        article_tag_1: 'Clock',
        article_tag_2: 'Customizable',
        article_tag_3: 'App',
        //modo: req.cookies.modo
      });      
});

app.listen(PORT, function () {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});