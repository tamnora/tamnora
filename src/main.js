import Tamnora from './js/tamnora.js';
import {styleClass} from './js/style.js'



const tmn = new Tamnora();
tmn.styleClasses = styleClass;


//Agregamos un nuevo data al modelo
tmn.setData('empresa', 'Mi Empresa');

//Uso del state en localStorage
tmn.setState('user', 'Daniel');


console.log('Usuario activo', tmn.getState('user')); // Output: 'Daniel'
console.log('Vista navbar', tmn.getState('navactive')); // Output: '1'

//Agregamos las funciones al modelo
tmn.setFunction('saludar', ()=>{
  let msg = `Hola ${tmn.data.nombre} ${tmn.data.apellido}, seleccionaste el valor ${tmn.data.myselect}`;
  alert(msg);
})

tmn.setFunction('functionNavbar', ()=>{
  let msg = `Hola ${tmn.data.nombre} ${tmn.data.apellido}, seleccionaste el valor ${tmn.data.myselect}`;
  console.log('Desde Navbar', msg);
})

console.log('Como iniciamos esto?')

tmn.onMount(() => {
  console.log('¡tamnora.js está listo en index!');
});