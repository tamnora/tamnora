import Tamnora from '../js/tamnora.js';
import {styleClass} from '../js/style.js'


const data = {
  nombre: 'Santiago',
  apellido: 'Fuentes',
  edad: 30,
};

const tmn = new Tamnora({data});
tmn.styleClasses = styleClass;



tmn.setFunction('enviarDatos', ()=>{
  console.log(tmn.data.contacto)
})

tmn.onMount(() => {
  console.log('¡tamnora.js está listo en Contacto!');
});