import {Tamnora, DataObject, DataArray} from './js/tamnora.js';
import { styleClass } from './js/style.js';

import { runcode, prepararSQL, dbSelect } from './js/tsql.js';

const tmn = new Tamnora({styleClasses:styleClass});
const frmCliente = new DataObject();
const tableMovimientos = new DataArray();
const frmMovim = new DataObject();

tmn.setData('contador', 0);
tmn.setData('cliente', {});
tmn.setData('movimiento',{});
tableMovimientos.name = 'Movim';




frmCliente.setFunction('submit',async ()=>{
  const datos = tmn.getData('cliente');

  Object.keys(datos).forEach(val => {
    let valor = datos[val];
    frmCliente.setData(val, 'value', valor)
  })

  console.log(frmCliente.getDataAll())

  const paraSQL = frmCliente.getDataAll();
  const send = prepararSQL('clientes', paraSQL);
  
  if(send.status == 1){
    await dbSelect(send.tipo, send.sql).then(val => console.log(val))
  }

})

frmMovim.setFunction('submit',async()=>{
  const datos = tmn.getData('movimiento');
  Object.keys(datos).forEach(val => {
    let valor = datos[val];
    frmMovim.setData(val, 'value', valor)
  })

   const paraSQL = frmMovim.getDataAll();
   const send = prepararSQL('movimientos', paraSQL);
   console.log(send)
  
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



tableMovimientos.setFunction('seleccionado',async(params)=>{
  let index = params[0];
  frmMovim.addObject(tableMovimientos.getDataObjectForKey(index, 'value'));
  frmMovim.setData('id', 'key', 'primary');
  frmMovim.setData('id', 'attribute', 'readonly');
  frmMovim.setData('concepto', 'column', 12);
  frmMovim.setDataKeys('name', {id_cliente: 'ID Cliente', id_factura: 'ID Factura'});
  frmMovim.setData('importe', 'type', 'currency');
  frmMovim.setData('importe', 'required', true);
  frmMovim.setData('tipo_oper', 'type', 'select');
  frmMovim.setData('tipo_oper', 'options', [{value: 0, label: 'Venta'}, {value:1, label:'Cobro'}]);
 
  frmMovim.forEachField((campo, dato)=>{
    tmn.setDataRoute(`movimiento!${campo}`, dato.value);
  })
    
  frmMovim.createForm('#formMovimiento', {textSubmit:'Guardar', title:'Movimiento:', bind:'movimiento', columns:{md:6, lg:6}});
  tmn.select('#formMovimiento').bindModel()
  tmn.select('#modalMovimiento').addClass('flex')
  tmn.select('#modalMovimiento').removeClass('hidden')
  
 
})

async function traerCliente(id){
  const tblCliente = await runcode(`-st clientes -wr id_cliente=${id}`);
  frmCliente.addObject(tblCliente[0]);
  frmCliente.setData('id_cliente', 'attribute', 'readonly');
  frmCliente.setData('id_cliente', 'key', 'primary');
  frmCliente.setData('date_added', 'attribute', 'readonly');
  frmCliente.setData('status_cliente', 'type', 'select');
  frmCliente.setData('status_cliente', 'options', [{value: 0, label: 'Inactivo'}, {value:1, label:'Activo'}]);
  frmCliente.setData('tipo', 'type', 'select');
  frmCliente.setData('tipo', 'options', [{value: 0, label: 'Cliente'}, {value:1, label:'Proveedor'}]);

  frmCliente.setDataKeys('name', {id_cliente: 'ID', nombre_cliente: 'Nombre', telefono_cliente: 'Teléfono', 
  email_cliente: 'Email', direccion_cliente: 'Dirección', status_cliente: 'Status', date_added: 'Fecha Ingreso'});

  

 
  frmCliente.forEachField((campo, dato)=>{
    tmn.setDataRoute(`cliente!${campo}`, dato.value);
  })

  tmn.data.nombreCliente = tmn.getData('cliente!nombre_cliente');
  
  frmCliente.createForm('#formCliente', {textSubmit:'Guardar Datos', title:'Cliente:', bind:'cliente'});
  tmn.select('#formCliente').bindModel()
  
};

async function traerMovimientos(id, reset= false){
  const rst = await runcode(`-st movimientos -wr id_cliente=${id} -ob fechahora -ds`);
  let saldo = 0;
  
  tableMovimientos.removeAll();
  if(reset) tableMovimientos.resetFrom();

  rst.forEach(row => {
    tableMovimientos.addObject(row);
    if(row.tipo_oper > 0){
      saldo = saldo - parseFloat(row.importe)
    } else {
      saldo = saldo + parseFloat(row.importe)
    }
  })

  tmn.setData('saldoMov', saldo);

  tableMovimientos.setDataKeys('name', {fechahora: 'Fecha y Hora', tipo_oper: 'Operación'});
  tableMovimientos.setDataKeys('attribute', {id_cliente: 'hidden'});

  
  verTabla();
  
};


function verTabla(){
  const options = {
    header:{
      tipo_oper: {class: 'text-right text-blue-700 text-lg', value: 'Saldo Pendiente:'},
      importe:{class: 'text-right text-blue-700 text-lg', value: tmn.getDataFormat('saldoMov', 'pesos')},
    },
    field:{
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
        class:'text-green-500'
      }
    },
    row:{
      class:{
        normal: 'bg-neutral-50 dark:bg-neutral-700',
        alternative: 'bg-neutral-100 dark:bg-neutral-800'
      },
      click:{
        function: 'seleccionado',
        field: 'id'
      }
    }
  }

  tableMovimientos.createTable('#tabla',options);

  
 
}

tmn.select('#prevClient').click(async ()=>{ 
  if(tmn.data.contador > 1){
    tmn.data.contador--
    traerCliente(tmn.data.contador);
    traerMovimientos(tmn.data.contador, true);
  }
})



tmn.select('#nextClient').click(async ()=>{ 
    tmn.data.contador++
    traerCliente(tmn.data.contador);
    traerMovimientos(tmn.data.contador, true);
})



