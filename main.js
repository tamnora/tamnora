import Tamnora from './js/tamnora.js';
import {styleClass} from './js/style.js'

const tmn = new Tamnora();
tmn.styleClasses = styleClass;
      

      tmn.setState('user', 'Daniel');
      const userValue = tmn.getState('user');
      console.log(userValue, tmn.getState('navactive')); // Output: 'Daniel'

tmn.setFunction('saludar', ()=>{
  console.log(`Hola ${tmn.data.nombre} ${tmn.data.apellido}, ${tmn.data.myselect}`)
})

tmn.setFunction('enviarDatos', ()=>{
  console.log(tmn.data.contacto)
  console.log(tmn.getData('contacto'))
})
  
