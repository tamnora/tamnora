import Tamnora from './js/tamnora.js';
import { styleClass } from './js/style.js';
import { DataObject } from './js/DataObject';
import { runcode } from './js/tsql.js';

const tmn = new Tamnora({styleClasses:styleClass});
const cliente = new DataObject();

tmn.setData('contador', 0);
tmn.setData('cliente', {});

async function inicio(){
  const tblCliente = await runcode(`-st clientes -wr id_cliente=10`);
  cliente.addObject(tblCliente[0]);
  cliente.setData('id_cliente', 'attribute', 'readonly')

  let form = '';
  cliente.forEachField((campo, dato)=>{
    form += `<div class="mb-6">
    <label for="${campo}" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">${campo}</label>
    <input type="${dato.type}" id="${campo}" data-value="cliente!${campo}" value="${dato.value}" ${dato.attribute}  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
  </div>`;

  })

  tmn.select('#formCliente').html(form)

  cliente.forEachField((campo, dato)=>{
    tmn.setDataRoute(`cliente!${campo}`, dato.value);
    tmn.bindData(`cliente!${campo}`);
  })

  
};

inicio();


tmn.select('#myButton').click(async ()=>{ 
    tmn.data.contador++
})




// tmn.onMount(() => {
//   console.log('¡tamnora.js está listo en index!');
//   tmn.select('#loader').addClass('hidden');
//   tmn.select('#app').removeClass('hidden');
  
 
// });

