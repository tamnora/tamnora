import Tamnora from './js/tamnora.js';
import { styleClass } from './js/style.js';
import { DataObject } from './js/DataObject';
import { DataArray } from './js/DataArray';
import { runcode } from './js/tsql.js';

const tmn = new Tamnora({styleClasses:styleClass});
const cliente = new DataObject();
const movimientos = new DataArray();

tmn.setData('contador', 0);
tmn.setData('cliente', {});
tmn.setData('movimientos',[]);
tmn.setFunction('enviarDatos',()=>{
  console.log(tmn.getData('cliente'));
})

async function traerCliente(id){
  const tblCliente = await runcode(`-st clientes -wr id_cliente=${id}`);
  cliente.addObject(tblCliente[0]);
  cliente.setData('id_cliente', 'attribute', 'readonly')
 
  cliente.forEachField((campo, dato)=>{
    tmn.setDataRoute(`cliente!${campo}`, dato.value);
  })
  
  const form = cliente.newSimpleForm({textSubmit:'Enviar Datos', title:'Cliente:'});
  tmn.select('#formCliente').html(form)

};

async function traerMovimientos(id){
  const rst = await runcode(`-st movimientos -wr id_cliente=${id} -ob fechahora -ds`);
  let saldo = 0;
  let count = 0;
  
  movimientos.removeAll();

  rst.forEach(row => {
    count++
    movimientos.addObject(row);
    if(row.tipo_oper > 0){
      saldo = saldo - parseFloat(row.importe)
    } else {
      saldo = saldo + parseFloat(row.importe)
    }
  })

  const options = {
    header:{
      tipo_oper: {class: 'text-right text-blue-500', value: 'Saldo Pendiente:'},
      importe:{class: 'text-right text-blue-500', value: saldo},
    },
    footer:{
      fechahora: {class: 'text-yellow-500', value: count},
    },
    function:{
      importe: (items, valor)=>{
        let result;
        if(items.tipo_oper.value > 0 ){
          result = `<span class="text-red-700 dark:text-red-500"> -${valor}</span>`
        } else {
          result = `<span class="text-green-700 dark:text-green-500">${valor}</span>`
        }
        return result;
      }
    }
  }

  const tabla = movimientos.newSimpleTable(0, 10, options);
  tmn.select('#tabla').html(tabla)
};


tmn.select('#myButton').click(async ()=>{ 
    tmn.data.contador++
    traerCliente(tmn.data.contador);
    traerMovimientos(tmn.data.contador);
})



