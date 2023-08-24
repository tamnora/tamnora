import Tamnora from './js/tamnora.js';
import { styleClass } from './js/style.js';
import { DataObject } from './js/DataObject';
import { DataArray } from './js/DataArray';
import { runcode, prepararSQL, dbSelect } from './js/tsql.js';

const tmn = new Tamnora({styleClasses:styleClass});
const cliente = new DataObject();
const movimientos = new DataArray();
const movSeleccionado = new DataObject();

tmn.setData('contador', 0);
tmn.setData('cliente', {});
tmn.setData('movimiento',{});

tmn.setFunction('enviarDatos',async ()=>{
  const datos = tmn.getData('cliente');
  Object.keys(datos).forEach(val => {
    let valor = datos[val];
    cliente.setData(val, 'value', valor)
  })

  const paraSQL = cliente.getDataAll();
  const send = prepararSQL('clientes', paraSQL);
  
  if(send.status == 1){
    await dbSelect(send.tipo, send.sql).then(val => console.log(val))
  }

})

tmn.setFunction('guardarMovimiento',async()=>{
  const datos = tmn.getData('movimiento');
  Object.keys(datos).forEach(val => {
    let valor = datos[val];
    movSeleccionado.setData(val, 'value', valor)
  })

   const paraSQL = movSeleccionado.getDataAll();
   const send = prepararSQL('movimientos', paraSQL);
  
  if(send.status == 1){
    await dbSelect(send.tipo, send.sql).then(val => {
      console.log(val);
      traerMovimientos(tmn.data.contador);
      tmn.select('#modalMovimiento').addClass('hidden');
      tmn.select('#modalMovimiento').removeClass('flex');
    })
  }
  
})

tmn.setFunction('closeModal',(params)=>{
  let index = params[0];
  tmn.select(params[0]).addClass('hidden');
  tmn.select(params[0]).removeClass('flex');
} )

tmn.setFunction('seleccionado',async(params)=>{
  let index = params[0];
  movSeleccionado.addObject(movimientos.getDataObjectForKey(index, 'value'));
  movSeleccionado.setData('id', 'key', 'primary');
  movSeleccionado.setData('id', 'attribute', 'readonly');
  movSeleccionado.setData('concepto', 'column', 12);
  movSeleccionado.setDataKeys('name', {id_cliente: 'ID Cliente', id_factura: 'ID Factura'});
  movSeleccionado.setData('importe', 'type', 'currency');
  movSeleccionado.setData('importe', 'required', true);
  movSeleccionado.setData('tipo_oper', 'type', 'select');
  movSeleccionado.setData('tipo_oper', 'options', [{value: 0, label: 'Venta'}, {value:1, label:'Cobro'}]);
 
  movSeleccionado.forEachField((campo, dato)=>{
    tmn.setDataRoute(`movimiento!${campo}`, dato.value);
  })
  
  
  const form2 = await movSeleccionado.newSimpleForm({textSubmit:'Guardar', title:'Movimiento:', bind:'movimiento', columns:{md:6, lg:6}});
  tmn.select('#formMovimiento').html(form2)
  tmn.select('#modalMovimiento').addClass('flex')
  tmn.select('#modalMovimiento').removeClass('hidden')
  
 
})

async function traerCliente(id){
  const tblCliente = await runcode(`-st clientes -wr id_cliente=${id}`);
  cliente.addObject(tblCliente[0]);
  cliente.setData('id_cliente', 'attribute', 'readonly');
  cliente.setData('id_cliente', 'key', 'primary');
  cliente.setData('date_added', 'attribute', 'readonly');
  cliente.setData('status_cliente', 'type', 'select');
  cliente.setData('status_cliente', 'options', [{value: 0, label: 'Inactivo'}, {value:1, label:'Activo'}]);

  cliente.setDataKeys('name', {id_cliente: 'ID', nombre_cliente: 'Nombre', telefono_cliente: 'Teléfono', 
  email_cliente: 'Email', direccion_cliente: 'Dirección', status_cliente: 'Status', date_added: 'Fecha Ingreso'});
  

 
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

  movimientos.setDataKeys('name', {fechahora: 'Fecha y Hora', tipo_oper: 'Operación'});
  movimientos.setDataKeys('attribute', {id_cliente: 'hidden'});

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
      tipo_oper:{
        change:(items, valor)=>{
          let result;
          const tipos = ['venta', 'cobro'];
          result = tipos[valor]
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



