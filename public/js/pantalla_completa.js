let my_use = document.getElementById("my_use");
 let href = my_use.getAttribute("xlink:href");
 href = "#arrows-fullscreen";
 my_use.setAttribute("xlink:href", href);

function launch() {
    launchFullScreen(document.documentElement);
}
 
 var my_li = document.getElementById("my_li");
	my_li.addEventListener("click", launch);
 
 function cancel() {
 	cancelFullScreen();
 }
 
function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
  let my_use = document.getElementById("my_use");
 let href = my_use.getAttribute("xlink:href");
 href = "#fullscreen-exit";
 my_use.setAttribute("xlink:href", href);
 var my_li = document.getElementById("my_li");
	my_li.removeEventListener("click", launch);
   my_li.addEventListener("click", cancel);
}
// Lanza en pantalla completa en navegadores que lo soporten
function cancelFullScreen() {
     if(document.cancelFullScreen) {
         document.cancelFullScreen();
     } else if(document.mozCancelFullScreen) {
         document.mozCancelFullScreen();
     } else if(document.webkitCancelFullScreen) {
         document.webkitCancelFullScreen();
     }
     let my_use = document.       getElementById("my_use");
 let href = my_use.getAttribute("xlink:href");
 href = "#arrows-fullscreen";
 my_use.setAttribute("xlink:href", href);
 var my_li = document.getElementById("my_li");
	my_li.removeEventListener("click", cancel);
   my_li.addEventListener("click", launch);
 }