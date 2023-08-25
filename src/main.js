import Tamnora from './js/tamnora.js';
import { styleClass } from './js/style.js';
import { DataObject } from './js/DataObject.js';
import { DataArray } from './js/DataArray.js';
import { runcode, prepararSQL, dbSelect } from './js/tsql.js';

const tmn = new Tamnora({styleClasses:styleClass});
const frmCliente = new DataObject();
const tableMovimientos = new DataArray();
const frmMovim = new DataObject();

tmn.setData('contador', 0);
tmn.setData('cliente', {});
tmn.setData('movimiento',{});
tableMovimientos.name = 'Movim';

tmn.setFunction('enviarDatos',async ()=>{
  const datos = tmn.getData('cliente');
  Object.keys(datos).forEach(val => {
    let valor = datos[val];
    frmCliente.setData(val, 'value', valor)
  })

  const paraSQL = frmCliente.getDataAll();
  const send = prepararSQL('clientes', paraSQL);
  
  if(send.status == 1){
    await dbSelect(send.tipo, send.sql).then(val => console.log(val))
  }

})

tmn.setFunction('guardarMovimiento',async()=>{
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

tmn.setFunction('seleccionado',async(params)=>{
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
  
  
  const form2 = await frmMovim.newSimpleForm({textSubmit:'Guardar', title:'Movimiento:', bind:'movimiento', columns:{md:6, lg:6}});
  tmn.select('#formMovimiento').html(form2)
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
  
  const form = frmCliente.newSimpleForm({textSubmit:'Guardar Datos', title:'Cliente:', bind:'cliente'});
  tmn.select('#formCliente').html(form)

};

async function traerMovimientos(id){
  const rst = await runcode(`-st movimientos -wr id_cliente=${id} -ob fechahora -ds`);
  let saldo = 0;
  
  tableMovimientos.removeAll();

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
      tipo_oper: {class: 'text-right text-blue-500 text-lg', value: 'Saldo Pendiente:'},
      importe:{class: 'text-right text-blue-500 text-lg', value: tmn.getData('saldoMov')},
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
        normal: 'bg-gray-50 dark:bg-gray-700',
        alternative: 'bg-gray-100 dark:bg-gray-800'
      },
      click:{
        function: 'seleccionado',
        field: 'id'
      }
    }
  }

  const tabla = tableMovimientos.newSimpleTable('#tabla',options);
  tmn.select('#tabla').classRefresh();
 
}

tmn.setFunction('paginations',(arg)=>{
  let pos = tmn.getData('from');
  let cant = tmn.getData('perView');

  if(arg[0] == 'next'){
    pos = pos + cant;
    tmn.setData('from', pos);
    verTabla();
  } else {
    pos = pos - cant;
    tmn.setData('from', pos);
    verTabla();
  }
})


tmn.select('#myButton').click(async ()=>{ 
    tmn.data.contador++
    traerCliente(tmn.data.contador);
    traerMovimientos(tmn.data.contador);
})



