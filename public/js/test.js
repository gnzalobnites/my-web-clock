var fondoLocal = localStorage.getItem("fondo");
document.body.style.backgroundColor =  fondoLocal;
var fuenteLocal = localStorage.getItem("fuente"); 
document.body.style.color = fuenteLocal;
var hamburguesa = document.getElementById("hamburguesa");
hamburguesa.style.color = fuenteLocal;
var marca = document.getElementById('marca');
marca.style.color = fuenteLocal;

var localHora = localStorage.getItem("tama_hora");
var localSegs = localStorage.getItem("tama_segundos");
var localFecha = localStorage.getItem("tama_fecha"); 

var tamaHora = localHora == null ? 90 : localHora; 
var tamaSeg = localSegs == null ? 45 : localSegs ;
var tamaFecha = localFecha == null ? 25 : localFecha; 

/*function addZero(i) {
  if (i < 10) {i = "0" + i}
  return i;
}*/

const addZero = i => {
  if (i < 10) {
    i = `0${i}`;
  }
  return i;
}

function printTime() {
    var d = new Date();
    var hours = addZero(d.getHours());
    var mins = addZero(d.getMinutes());
    var secs = addZero(d.getSeconds());
    
    var diaSem = " ";
    switch(d.getDay()){
    	case 0:
            diaSem = "domingo";
            break; 
        case 1:
            diaSem = "lunes";
            break;
        case 2:
            diaSem = "martes";
            break; 
        case 3:
            diaSem = "miércoles";
            break;
        case 4:
            diaSem = "jueves";
            break; 
        case 5:
            diaSem = "viernes";
            break; 
        case 6:
            diaSem = "sábado";
            break;
        case 7:
            diaSem = "domingo";
            break; 
    }
    var diaMes = d.getDate();
    switch(d.getMonth()){
    	case 0:
            mes = "enero";
            break;
        case 1:
             mes = "febrero";
             break;
        case 2:
              mes = "marzo";
              break;
        case 3:
              mes = "abril";
              break;
        case 4:
            mes = "mayo";
            break;
        case 5:
             mes = "junio";
             break;
        case 6:
              mes = "julio";
              break;
        case 7:
              mes = "agosto";
              break;
        case 8:
            mes = "septiembre";
            break;
        case 9:
             mes = "octubre";
             break;
        case 10:
              mes = "noviembre";
              break;
        case 11:
              mes = "diciembre";
              break;
    }
var horaCadena = `<span style="font-size: ${tamaHora}pt">${hours}:${mins}</span><span style="font-size: ${tamaSeg}pt">:${secs}</span>`;

var fechaCadena = `<span style='font-size:${tamaFecha}pt'>${diaSem} ${diaMes} de ${mes}</span>`

document.getElementById("hs_y_mins").innerHTML = horaCadena;

document.getElementById("fecha").innerHTML =  fechaCadena; 

    var max_tam_hora = document.getElementById("max_tam_hora");
    var anchoPantalla = window.innerWidth;
	//console.log(anchoPantalla);
	if(anchoPantalla >= 601) {
		max_tam_hora.max = 250;
	 } else {
		max_tam_hora.max = 100;
	 }
	
	 var max_tam_fecha = document.getElementById("max_tam_fecha");
    var anchoPantalla = window.innerWidth;
	//console.log(anchoPantalla);
	if(anchoPantalla >= 601) {
		max_tam_fecha.max = 60;
	 } else {
		max_tam_fecha.max = 30;
	 }
}

window.onload = setInterval(printTime, 1000);

function cambiarFondo(val) {
    document.body.style.backgroundColor = val;
    localStorage.setItem("fondo", val);

}
function cambiarFuente(val2) {
    document.body.style.color = val2;
    var hamburguesa = document.getElementById("hamburguesa");
    hamburguesa.style.color = val2;
    localStorage.setItem("fuente", val2);
}

function redimHora(val3) {
	//console.log(val3);
    tamaHora = val3;
    tamaSeg = val3/2;
    localStorage.setItem("tama_hora", val3);
    localStorage.setItem("tama_segundos", val3/2);
}
/*function redimFecha(val4) {
    tamaFecha = val4;
    localStorage.setItem("tama_fecha", val4);
}*/

const redimFecha = (val4) => {
	tamaFecha = val4;
    localStorage.setItem("tama_fecha", val4);
} 


function reset(){
	localStorage.clear();
	let prompt_valor = confirm("Volver a cargar la página para aplicar los cambios")
	if(prompt_valor == true) {
	location.reload()
	}
	alert();
}
/*function valores(){
	console.log("th = "+tamaHora+"; tf = "+tamaFecha);  
}*/
