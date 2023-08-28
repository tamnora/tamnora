import {Tamnora, DataObject, DataArray} from './js/tamnora.js';
import { styleClass } from './js/style.js';

import { runcode, prepararSQL, dbSelect, structure } from './js/tsql.js';

const tmn = new Tamnora({styleClasses:styleClass});
const frmCliente = new DataObject();
const tableMovimientos = new DataArray();
const frmMovim = new DataObject();
const frmClienteModal = new DataObject();

tmn.setData('contador', 0);
tmn.setData('cliente', {});
tmn.setData('newCliente', {});
tmn.setData('movimiento',{});
tableMovimientos.name = 'Movim';




frmCliente.setFunction('submit',async ()=>{
  const datos = tmn.getData('cliente');
  frmCliente.setDataFromModel(datos)
  const paraSQL = frmCliente.getDataAll();
  const send = prepararSQL('clientes', paraSQL);
  
  if(send.status == 1){
    await dbSelect(send.tipo, send.sql).then(val => console.log(val))
  }

})

frmClienteModal.setFunction('submit',async ()=>{
  const datos = tmn.getData('newCliente');
  frmClienteModal.setDataFromModel(datos)
  const paraSQL = frmCliente.getDataAll();
  const send = prepararSQL('clientes', paraSQL);
  
  if(send.status == 1){
    await dbSelect(send.tipo, send.sql).then(val => console.log(val))
  }

})

frmMovim.setFunction('submit',async()=>{
  const datos = tmn.getData('movimiento');
  frmMovim.setDataFromModel(datos)
  

   const paraSQL = frmMovim.getDataAll();
   const send = prepararSQL('movimientos', paraSQL);

  
  if(send.status == 1){
    await dbSelect(send.tipo, send.sql).then(val => {
      console.log(val);
      traerMovimientos(tmn.data.contador);
      
    })
  }
  
})


tmn.setFunction('nuevoCliente', ()=>{
  frmClienteModal.cloneFrom(frmCliente.getDataClone(), true);
  frmClienteModal.setData('date_added', 'value', tmn.formatDate(new Date()).fechaHora);
  
  frmClienteModal.forEachField((campo, dato)=>{
    tmn.setDataRoute(`newCliente!${campo}`, dato.value);
  })

  frmClienteModal.setDataKeys('name', {id_cliente: 'ID', nombre_cliente: 'Nombre', telefono_cliente: 'Teléfono', 
  email_cliente: 'Email', direccion_cliente: 'Dirección', status_cliente: 'Status', date_added: 'Fecha Ingreso'});

  frmClienteModal.createFormModal('#modalCliente', {textSubmit:'Guardar', title:'Nuevo cliente/Proveedor', bind:'newCliente', columns:{md:6, lg:6}});
  tmn.select('#modalCliente').bindModel();
  
})


tableMovimientos.setFunction('seleccionado',async(params)=>{
  let index = params[0];
  let value = params[1];

  if(value == 0){
    let tblMov = tableMovimientos.getDataObjectForKey(index, 'value');
    let struct = tableMovimientos.getStructure();
    console.log('struct', struct)
    frmMovim.addObject(tblMov, true, struct);
    frmMovim.setData('id_cliente', 'value', tmn.data.contador);
    frmMovim.setData('importe', 'value', 0);
    frmMovim.setData('tipo_oper', 'value', 0);
    frmMovim.setData('fechahora', 'value', tmn.formatDate(new Date()).fechaHora);
  } else {
    let struct = tableMovimientos.getStructure();
    console.log('struct', struct)
    frmMovim.addObject(tableMovimientos.getDataObjectForKey(index, 'value'), false, struct);
  }
  
  frmMovim.setData('id', 'key', 'primary');
  frmMovim.setData('id', 'attribute', 'readonly');
  // frmMovim.setData('id', 'hidden', true);
  frmMovim.setData('concepto', 'column', 12);
  frmMovim.setDataKeys('name', {id_cliente: 'ID Cliente', id_factura: 'ID Factura'});
  // frmMovim.setData('importe', 'type', 'currency');
  frmMovim.setData('importe', 'required', true);
  frmMovim.setData('tipo_oper', 'type', 'select');
  frmMovim.setData('tipo_oper', 'options', [{value: 0, label: 'Venta'}, {value:1, label:'Cobro'}]);
 
  frmMovim.forEachField((campo, dato)=>{
    tmn.setDataRoute(`movimiento!${campo}`, dato.value);
  })

 
  frmMovim.createFormModal('#modalMovimiento', {textSubmit:'Guardar', title:'ABM - Movimientos', bind:'movimiento', columns:{md:6, lg:6}});
  tmn.select('#modalMovimiento').bindModel();
  
  
 
})

async function traerCliente(id){
let tblCliente;
let strucClientes = await structure('clientes');

if(id == 0){
  tblCliente = await runcode(`-st clientes`);
  frmCliente.addObject(tblCliente[0], true, strucClientes);
  frmCliente.setData('date_added', 'value', tmn.formatDate(new Date()).fechaHora);
}else {
  tblCliente = await runcode(`-st clientes -wr id_cliente=${id}`);
  frmCliente.addObject(tblCliente[0], false, strucClientes);
}

  frmCliente.setData('id_cliente', 'attribute', 'readonly');
  frmCliente.setData('id_cliente', 'key', 'primary');
  frmCliente.setData('date_added', 'defaultValue', tmn.formatDate(new Date()).fechaHora);
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
  
  frmCliente.createForm('#formCliente', {textSubmit:'Guardar Datos', title:'Cliente', bind:'cliente', btnNew: 'Nuevo Usuario', buttons: `
  <button type="button" data-click="nuevoCliente" class="text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 transition-bg duration-500" >Nuevo Cliente</button>
  `});
  tmn.select('#formCliente').bindModel()
  
};

async function traerMovimientos(id, reset= false){
  const rst = await runcode(`-st movimientos -wr id_cliente=${id} -ob fechahora -ds`);
  
  
  if(!tableMovimientos.getStructure().length){
    await structure('movimientos').then(struc => {
      tableMovimientos.setStructure(struc);
    });
  }

  console.log(tableMovimientos.getStructure())

  let saldo = 0;
  
  tableMovimientos.removeAll();
  if(reset) tableMovimientos.resetFrom();

  if(id > 0){
    if(!rst[0].Ninguno){
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
      // tableMovimientos.setDataKeys('attribute', {id_cliente: 'hidden'});
      // tableMovimientos.setDataKeys('hidden', {id: true});
    
      
      verTabla();
    } else {
      tmn.setData('saldoMov', saldo);
      tableMovimientos.addObject({
        id: "0",
        id_cliente: tmn.data.contador,
        id_factura: "",
        fechahora: "",
        tipo_oper: "",
        importe: "0",
        concepto: "SIN REGISTROS"
    });
      verTablaVacia();
    }
  } else {
    tmn.select('#tabla').html('');
  }
  
};

structure('movimientos').then(resp => {
  console.log(resp)
});


function verTabla(){
  const options = {
    title: 'Movimientos',
    subtitle:'Detalle de los movimirntos del cliente',
    btnNew: 'Nuevo Movimiento',
    header:{
      tipo_oper: {class: 'text-right text-neutral-500 text-lg', value: 'Saldo Pendiente:'},
      importe:{class: 'text-right text-neutral-500 text-lg', value: tmn.getDataFormat('saldoMov', 'pesos')},
    },
    field:{
      importe: {
        change: (items, valor)=>{
          let result;
          if(items.tipo_oper.value > 0 ){
            result = `<span class="text-red-700 dark:text-red-500"> -${valor}</span>`
          } else {
            result = `<span class="text-blue-700 dark:text-blue-500">${valor}</span>`
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
        class:'text-blue-700'
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

function verTablaVacia(){
  const options = {
    title: 'Movimientos',
    subtitle:'Detalle de los movimirntos del cliente',
    btnNew: 'Nuevo Movimiento'
  }

  tableMovimientos.createTable('#tabla',options);

}

tmn.data.contador = 100;
traerCliente(100);
traerMovimientos(100, true);

tmn.select('#prevClient').click(async ()=>{ 
  if(tmn.data.contador > 0){
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



