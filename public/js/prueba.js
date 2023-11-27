
function mostrar_botones_sesión(){
    //alert("Hola desde /public/js")
    let div_int_reloj = document.getElementById('div_int_reloj');
    div_int_reloj.setAttribute('class', 'gap-1 d-none');
    let botones_sesion = document.getElementById('botones_sesion');
    botones_sesion.setAttribute('class', 'gap-1 d-block');
    let boton_cancelar = document.getElementById('boton_cancelar');
    boton_cancelar.setAttribute('class', 'nav-item d-block');
    let boton_acceder = document.getElementById('boton_acceder');
    boton_acceder.setAttribute('class', 'nav-item d-none');
}
function ocultar_botones_sesión() {
    let div_int_reloj = document.getElementById('div_int_reloj');
    div_int_reloj.setAttribute('class', 'gap-1 d-block');
    let botones_sesion = document.getElementById('botones_sesion');
    botones_sesion.setAttribute('class', 'gap-1 d-none');
    let boton_cancelar = document.getElementById('boton_cancelar');
    boton_cancelar.setAttribute('class', 'nav-item d-none');
    let boton_acceder = document.getElementById('boton_acceder');
    boton_acceder.setAttribute('class', 'nav-item d-block');
}
function enviarSolicitud() {
    var id = document.getElementById("id");
    var password = document.getElementById('password');

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/reloj-pug/registrarse", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send({
      id: id.value,
      password: password.value,
    });
  }
  