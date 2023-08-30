import {DataArray, DataObject, Tamnora} from './js/tamnora'
import {structure, runcode} from './js/tsql'

//facturas y detalle_factura
const tmn = new Tamnora();
const listaFactura = new DataArray
const factura = new DataObject;

tmn.setData('textoBuscado');
tmn.setData('textSearch', 'Cliente')

tmn.setFunction('searchSelect', (param)=>{
  let inputSearch = document.querySelector('#search-dropdown');
  tmn.setData('textSearch', param[0])
  document.querySelector('#dropdown-button').click();
  if(param[0] == 'Fecha'){
    inputSearch.setAttribute('type', 'date');
  } else if(param[0] == 'Factura'){
    inputSearch.setAttribute('type', 'number');
  } else if(param[0] == 'Importe'){
    inputSearch.setAttribute('type', 'number');
  } else {
    inputSearch.setAttribute('type', 'search');
  }
})

tmn.select('#search-dropdown').change(e => {
  let type = e.target.getAttribute('type');
  let value = e.target.value;
  let buscarEn = tmn.getData('textSearch');
  let param = '';
  let cliente;
  
  
  console.log(buscarEn, type, value)

  if(buscarEn == 'Cliente'){
    if(value != ''){
      value = value.toLowerCase();
      cliente = tmn.getData('listaClientes').filter(cliente => cliente.nombre_cliente.toLowerCase().includes(value));
      if(cliente.length > 0){
        cliente.forEach(v =>{
          param +=` id_cliente = ${v.id_cliente} OR`;
        })
        param +='-';
        param = param.replace('OR-', ' ');
        console.log(param);
      } else {
        param +=`id_cliente = 0`;
      }
    } else {
      console.log('Esta vacio')
      param +=``;
    }
    
  } else if(buscarEn == 'Factura'){
    param = `numero_factura like '%${value}%' `;
  } else if(buscarEn == 'Fecha'){
    param = `fecha_factura like '%${value}%' `;
  } else if(buscarEn == 'Importe'){
    value = value.replace(',', '.');
    param = `total_venta like '%${value}%' `;
  }


  console.log(param)
  listarFacturas(param)

})

listaFactura.setFunction('verfactura', (a, b)=>{
  console.log('Mostramos la factura', a, b);
})


tmn.setFunction('buscar', ()=>{
  let buscarEn = tmn.select('#textSelect').value();
  let valorABuscar = tmn.select('#searchValue').value();
  valorABuscar = valorABuscar.toLowerCase();
  

})




async function listarFacturas(param = ''){
  
  if(!listaFactura.getStructure().length > 0){
    await structure('t','facturas').then(struct => {
       listaFactura.setStructure(struct)
     });
  }

let facturas = '';
if(param != ''){
  facturas = await runcode(`-st facturas -wr ${param} -ob numero_factura -ds`);
  console.log(facturas)
} else {
  facturas = await runcode('-st facturas -ob numero_factura -ds -lt 100');
  console.log(facturas)
}
if(!tmn.getData('listaClientes')){
  let listaClientes = await runcode('-sl id_cliente, nombre_cliente -fr clientes -ob nombre_cliente');
  tmn.setData('listaClientes', listaClientes);
}

let optionsSelect = '<option value="nombre_cliente" selected>cliente</option>';
[{name:'factura', value: 'numero_factura'}, {name:'fecha', value: 'fecha_factura'}, {name:'importe', value: 'total_venta'}].forEach(val => {
  optionsSelect += `<option value="${val.value}">${val.name}</option>`;
})


if(!facturas[0].Ninguno){
  listaFactura.removeAll();
  listaFactura.setDefaultRow(facturas[0]);
  facturas.forEach(fc => {
    listaFactura.addObject(fc, listaFactura.getStructure())
  })
} else {
  listaFactura.loadDefaultRow();
  console.log(listaFactura.getDefaultRow());
}

listaFactura.setDataKeys('attribute',{id_factura: 'hidden', id_vendedor: 'hidden', estado_factura: 'hidden'})
listaFactura.setDataKeys('name', {numero_factura: 'factura', total_venta: 'importe'})



let buttons = `
<div class="inline-flex rounded-md shadow-sm" role="group">
  <button type="button" class="px-4 py-2 text-sm focus:outline-none font-medium text-neutral-900 bg-white border border-neutral-200 rounded-l-lg hover:bg-neutral-100 hover:text-blue-700 focus:z-10  focus:text-blue-700 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600  dark:focus:text-blue-200">
    Nueva Factura
  </button>
  <button type="button" class="px-4 py-2 text-sm focus:outline-none font-medium text-neutral-900 bg-white border-t border-b border-neutral-200 hover:bg-neutral-100 hover:text-blue-700 focus:z-10  focus:text-blue-700 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600  dark:focus:text-blue-200">
    Ver Cuenta
  </button>
  <button type="button" class="px-4 py-2 text-sm focus:outline-none font-medium text-neutral-900 bg-white border border-neutral-200 rounded-r-md hover:bg-neutral-100 hover:text-blue-700 focus:z-10  focus:text-blue-700 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600  dark:focus:text-blue-200">
    Informe
  </button>
</div>
`;


const options = {
  title: 'Lista de Facturas',
  subtitle: 'babababab',
  buttons: buttons,
  header:{
    id_cliente: {class: 'text-left', title: 'cliente'}
  },
  field: {
    id_cliente:{
      class: 'text-white',
      change:(items, valor)=>{
        let result = 'No encontrado';
        const tipos = tmn.getData('listaClientes').filter(cliente => cliente.id_cliente == valor);
        if(tipos.length > 0){
          result = tipos[0].nombre_cliente;
        }
        return result;
      }
    },
  },
  row:{
    class:{
      normal: 'bg-neutral-50 dark:bg-neutral-700',
      alternative: 'bg-neutral-100 dark:bg-neutral-800'
    },
    click:{
      function: 'verfactura',
      field: 'id_factura'
    }
  }
}

listaFactura.createTable('#listaFacturas', options);
tmn.select('#listaFacturas').bindModel()


}

listarFacturas()

