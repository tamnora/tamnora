import Tamnora from './js/tamnora.js';
import { styleClass } from './js/style.js';
import { DataObject } from './js/DataObject';
import { DataArray } from './js/DataArray';
import { runcode } from './js/tsql.js';

const tmn = new Tamnora({styleClasses:styleClass});
const cliente = new DataObject();
const movimientos = new DataArray();
const movSeleccionado = new DataObject();

tmn.setData('contador', 0);
tmn.setData('cliente', {});
tmn.setData('movimiento',{});
tmn.setFunction('enviarDatos',()=>{
  console.log(tmn.getData('cliente'));
})

tmn.setFunction('guardarMovimiento',()=>{
  console.log(tmn.getData('movimiento'));
  tmn.select('#modalMovimiento').addClass('hidden');
  tmn.select('#modalMovimiento').removeClass('flex');
})

tmn.setFunction('closeModal',(params)=>{
  let index = params[0];
  console.log(params[0])
  tmn.select(params[0]).addClass('hidden');
  tmn.select(params[0]).removeClass('flex');
} )

tmn.setFunction('seleccionado',async (params)=>{
  let index = params[0];
  movSeleccionado.addObject(movimientos.getDataObjectForKey(index, 'value'));
  movSeleccionado.setData('id', 'attribute', 'readonly')
 
  movSeleccionado.forEachField((campo, dato)=>{
    tmn.setDataRoute(`movimiento!${campo}`, dato.value);
  })
  
 
  const form2 = await movSeleccionado.newSimpleForm({textSubmit:'Guardar', title:'Movimiento:', bind:'movimiento'});
  tmn.select('#formMovimiento').html(form2)
  tmn.select('#modalMovimiento').addClass('flex')
  tmn.select('#modalMovimiento').removeClass('hidden')
  
 
})

async function traerCliente(id){
  const tblCliente = await runcode(`-st clientes -wr id_cliente=${id}`);
  cliente.addObject(tblCliente[0]);
  cliente.setData('id_cliente', 'attribute', 'readonly')
  cliente.setData('id_cliente', 'name', 'ID')
  cliente.setData('nombre_cliente', 'name', 'Nombre');
  cliente.setData('telefono_cliente', 'name', 'Teléfono');
  cliente.setData('email_cliente', 'name', 'Email');
  cliente.setData('direccion_cliente', 'name', 'Dirección');
  cliente.setData('status_cliente', 'name', 'Estado');
  cliente.setData('date_added', 'name', 'Fecha ingreso');
  


 
  cliente.forEachField((campo, dato)=>{
    tmn.setDataRoute(`cliente!${campo}`, dato.value);
  })
  
  const form = cliente.newSimpleForm({textSubmit:'Guardar Datos', title:'Cliente:', bind:'cliente'});
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
    row:{
      importe: {
        change: (items, valor)=>{
          let result;
          if(items.tipo_oper.value > 0 ){
            result = `<span class="text-red-700 dark:text-red-500"> -${valor}</span>`
          } else {
            result = `<span class="text-green-700 dark:text-green-500">${valor}</span>`
          }
          return result;
        }
      },
      id:{
        click:'seleccionado',
        class:'text-green-500'
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



