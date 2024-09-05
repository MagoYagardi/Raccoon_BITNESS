//animacion login to registro

let contenedorForms = document.querySelector(".contenedor-form");
let formLogin = document.querySelector(".log-form");
let formRegister = document.querySelector(".registro-form");
let mensajeToReg = document.querySelector(".mensaje-ir-registro");
let mensajeToLog = document.querySelector(".mensaje-ir-login");


let anchoPagina = () => {
    if(window.innerWidth > 850) {
        mensajeToLog.style.display = "block";
        mensajeToReg.style.display = "block";

    } else {
         mensajeToReg.style.display = "block";
         mensajeToReg.style.opacity = "1";
         mensajeToLog.style.display = "none";
         formLogin.style.display = "block";
         formRegister.style.display = "none";
         contenedorForms.style.left = "0px";
    }

}

let toLogin  = () => {

    if(window.innerWidth > 850) {

        formRegister.style.display = "none";
        contenedorForms.style.left = "10px";
        formLogin.style.display = "block";
        mensajeToReg.style.opacity = "1";
        mensajeToLog.style.opacity = "0";
    } else {
        
        formRegister.style.display = "none";
        contenedorForms.style.left = "0px";
        formLogin.style.display = "block";
        mensajeToReg.style.display = "block";
        mensajeToLog.style.display = "none"; 

  
    }
};

let toRegister = () => {

    if (window.innerWidth > 850) { 
        
        formRegister.style.display = "block";
        contenedorForms.style.left = "410px";
        formLogin.style.display = "none";
        mensajeToReg.style.opacity = "0";
        mensajeToLog.style.opacity = "1";


    } else {
    formRegister.style.display = "block";
    contenedorForms.style.left = "0px";
    formLogin.style.display = "none";
    mensajeToReg.style.display = "none";
    mensajeToLog.style.display = "block";
    mensajeToLog.style.opacity = "1";
    }
};



$("#btn-ir-registro").click(toRegister);
$("#btn-ir-login").click(toLogin);
window.addEventListener("resize", anchoPagina);
/// falta ejecutar anchopagina al cargar por primera vez modal//

