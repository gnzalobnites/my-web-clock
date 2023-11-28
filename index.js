const express = require('express');
const path = require('path'); 
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');
const app = express();
const acceso = require('./acceso.js')
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use('/acceso', acceso);
app.set('view engine', 'pug');
app.set('views', [
  './views'
]);
app.use(express.static('public'));
app.get('/', function (req, res) {
    // Agregar encabezados para deshabilitar la caché
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
	res.render('plantilla_sin_main_reloj', {
        title: "Mi reloj web",
        google_site_verification_content:"IlwE29oPx3IJib2qhYUc07f7uJp7SpVM12hd1DnPiqE",
        apple_touch_icon_180_href: 'https://my-web-clock.onrender.com/apple-touch-icon.png',
        icon_32_href: '/favicon-32x32.png',
        icon_16_href: '/favicon-16x16.png',
        manifest_href: '/site.webmanifest',
        icon_safari_color: '#da532c',
        theme_color_content: '#ffffff',
        description_content: 'Reloj personalizado para tu escritorio. Elige el color y tamaño de fondo y fuente para crear un reloj único y a tu medida.',
        og_site_name: 'My Web Clock',
        og_title: 'Reloj personalizado para tu escritorio',
        og_description: 'Reloj personalizado para tu escritorio. Elige el color y tamaño de fondo y fuente para crear un reloj único y a tu medida.',
        og_url: 'https://my-web-clock.onrender.com',
        og_image: 'https://my-web-clock.onrender.com/og_image1.jpg',
        article_tag_1: 'Clock',
        article_tag_2: 'Customizable',
        article_tag_3: 'App',
        //modo: req.cookies.modo
      });      
});
app.get('*', function(req, res){
  res.redirect('/');
});
app.listen(PORT, function () {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});