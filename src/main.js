import { DataArray, DataObject, Tamnora, structure, runCode, dbSelect } from './js/tamnora'
import { navbar } from './components/navbar.tmn';

const tmn = new Tamnora;
const dataTabla = new DataArray('tabla');
const formModal = new DataObject('modalForm')
const simpleForm = new DataObject('simpleform')

dataTabla.loader = true;
dataTabla.loadingTable();

tmn.themeColorLight = '#db5945';
tmn.themeColorDark = '#713228';

tmn.setValue('idBuscado', '');
tmn.setValue('dataClientes', []);

tmn.setValue('cant', 200);
tmn.setValue('itab', 0);
tmn.setValue('id_cliente', 0)
tmn.setValue('nombre_cliente', '')


tmn.select('#simpleform').html(`
<div role="status" class="animate-pulse mt-4 mb-20">
    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
    <div class="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 max-w-[540px]"></div>
    <div class="flex items-center justify-center mt-4">
        <div class="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
        <div class="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
    </div>
    <span class="sr-only">Loading...</span>
</div>
`)



tmn.select('#navbar').html(navbar('Tamnora js'))

tmn.setComponentHTML



dataTabla.setValue('contador', 2);

dataTabla.setFunction('restar', ()=>{
  let valor =  dataTabla.getValue('contador');
  valor--;
  console.log(valor)
  dataTabla.setValue('contador', valor)
})

dataTabla.setFunction('sumar', ()=>{
  let valor =  dataTabla.getValue('contador');
  valor++;
  console.log(valor)
  dataTabla.setValue('contador', valor)
})

async function cargarClientes() {
  const strClientes = await runCode('-sl id_cliente, nombre_cliente -fr clientes -wr tipo = 0 -ob nombre_cliente');
  if(!strClientes.resp){
    tmn.setValue('dataClientes', strClientes)
  } else {
    console.error(strClientes.msgError)
  }
}

async function verSimpleForm(){
  let conex = await simpleForm.setStructure('clientes', 'id_cliente');
  console.log('hay conexion', conex)
  if(!conex){
    tmn.select('#simpleform').html('<h4 class="text-red-500 dark:text-red-500 text-center">No hay conexión a la base de datos!</h4>')
    return
  }
  

  await simpleForm.addObjectFromRunCode(`-st clientes -wr id_cliente = ${tmn.getValue('id_cliente')}`);

 
  simpleForm.orderColumns = ['id_cliente', 'nombre_cliente', 'telefono_cliente', 'email_cliente', 'direccion_cliente', 'tipo', 'date_added', 'status_cliente'];
  simpleForm.setData('tipo', 'type', 'select');
  simpleForm.setData('tipo', 'options', [{ value: 0, label: 'Cliente' }, { value: 1, label: 'Proveedor' }]);
  simpleForm.setData('status_cliente', 'type', 'select');
  simpleForm.setData('status_cliente', 'options', [{ value: 0, label: 'Inactivo' }, { value: 1, label: 'Activo' }]);
  simpleForm.setData('id_cliente','attribute', 'readonly')
  simpleForm.setDataDefault('date_added', 'introDate', true)
  simpleForm.setDataKeys('name', {
    id_cliente: 'Cod.Cliente', 
    nombre_cliente: 'Cliente', 
    telefono_cliente: 'Teléfono', 
    email_cliente: 'Email',
    direccion_cliente: 'Dirección',
    date_added: 'Ingreso',
    status_cliente: 'Estado'
  })
  
 
  
  const options = {
    title: 'Datos del Cliente',
    subtitle: `No se ha seleccionado ningún Cliente`,
    submit: 'Guardar'
  }

  if(tmn.getValue('id_cliente') > 0){
    options.subtitle = `${tmn.getValue('nombre_cliente')} (Cod. Cliente: ${tmn.getValue('id_cliente')})`
  } 
 
  
  simpleForm.createForm(options);
}

async function verSaldosAcumulados() {
  let cant = tmn.getValue('cant') || 5;
  let conex = await dataTabla.setStructure('movimientos');
  console.log('hay conexion', conex)
  if(!conex){
    tmn.select('#tabla').html('<h4 class="text-red-500 dark:text-red-500 text-center">No hay conexión a la base de datos!</h4>');
    return 
  }
  await dataTabla.addObjectFromDBSelect(`CALL saldos_acumulados(${tmn.getValue('id_cliente')}, ${cant})`);
  
  dataTabla.orderColumns = ['tipo_oper', 'id', 'fechahora', 'id_factura', 'importe', 'saldo'];
  dataTabla.searchColumns = ['tipo_oper', 'id', 'fechahora'];
  dataTabla.widthColumns = ['w-10', 'w-10', 'w-10', 'w-20', 'w-20', 'w-35'];
  dataTabla.setDataKeys('attribute', { importe: 'currency', saldo: 'pesos' })
  dataTabla.setDataKeys('name', { id_factura: 'Remito' })
  dataTabla.searchValue = '03';
  dataTabla.searchColumns= ['id_factura'];
  
  
  
  
  let buttons = `
    <div class="inline-flex rounded-md shadow-sm" role="group">
      <button type="button" data-action="newMovi, 0" class="px-4 py-2 text-sm focus:outline-none font-medium text-neutral-900 bg-white border border-neutral-200 rounded-l-lg hover:bg-neutral-100 hover:text-blue-700 focus:z-10  focus:text-blue-700 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600  dark:focus:text-blue-200">
        Nuevo Movimiento
      </button>
      <button type="button" data-action="restar" class="px-4 py-2 text-sm focus:outline-none font-medium text-neutral-900 bg-white border-t border-b border-neutral-200 hover:bg-neutral-100 hover:text-blue-700 focus:z-10  focus:text-blue-700 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600  dark:focus:text-blue-200">
        <
      </button>
      <span data-value="contador" class="px-4 py-2 text-sm focus:outline-none font-medium text-neutral-900 bg-white border-t border-b border-neutral-200  dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">0</span>
      <button type="button" data-action="sumar" class="px-4 py-2 text-sm focus:outline-none font-medium text-neutral-900 bg-white border-t border-b border-neutral-200 rounded-r-md hover:bg-neutral-100 hover:text-blue-700 focus:z-10  focus:text-blue-700 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600  dark:focus:text-blue-200">
        >
      </button>
    </div>
    `;

  const options = {
    title: 'Movimientos del cliente',
    subtitle: `No se ha seleccionado ningún Cliente`,
    buttons: buttons,
    header: {
      tipo_oper: { class: 'text-left', title: 'Operación' },
      saldo: { class: 'text-right', title: 'Saldo' }
    },
    field: {
      saldo: {
        class: 'text-end',
        change: (data) => {
          let result = data.valor;
          if (data.index == 0) {
            let saldo = data.items.saldo.value;

            if(saldo > 0){
              result = `<span class="bg-red-200 text-red-600 text-normal font-semibold px-3 py-1 rounded dark:bg-red-600/60 dark:text-red-100">${data.valor}</span>`;
            } else if(saldo < 0) {
              result = `<span class="bg-green-200 text-green-600 text-normal font-semibold px-3 py-1 rounded dark:bg-green-600/60 dark:text-green-100">${data.valor}</span>`;
            } else {
              result = `<span class="bg-sky-200 text-sky-600 text-normal font-semibold px-3 py-1 rounded dark:bg-sky-600/60 dark:text-sky-100">${data.valor}</span>`;
            }
          }
          return result;
        }
      },
      tipo_oper: {
        class: 'text-semibold',
        change: (data) => {
          let tipos = ['Venta', 'Cobro', 'Compra', 'Pago'];
          return tipos[data.valor];
        }
      }
    },
    row: {
      alternative: true,
      click: {
        function: 'showMovi',
        field: 'id'
      }
    }
  }

  

  if(tmn.getValue('id_cliente') > 0){
    options.subtitle = `${tmn.getValue('nombre_cliente')} (Cod. Cliente: ${tmn.getValue('id_cliente')})`
  } 

  dataTabla.createTable(options);

  dataTabla.setFunction('showMovi', async (ref) => {
    formModal.setData('id_cliente', 'elegirOpcion', false);
    formModal.setData('tipo_oper', 'elegirOpcion', false)
    formModal.updateDataInForm(dataTabla.getDataObjectForKey(ref[0],'value'))
    formModal.functions.openModal();
    
  })

  dataTabla.setFunction('newMovi', async (ref) => {
    formModal.setDataDefault('id_cliente', 'value', tmn.getValue('id_cliente'));
    formModal.setDataDefault('fechahora', 'introDate', true)
    // formModal.setData('id_cliente', 'elegirOpcion', false)
    formModal.setData('tipo_oper', 'elegirOpcion', true)
    formModal.updateDataInFormForNew();
    formModal.functions.openModal();
    
  })
}

async function crearModalForm(){
  let conex = await formModal.setStructure('movimientos', 'id');
  console.log('hay conexion', conex)
  if(!conex) return
  formModal.removeAll()
  await formModal.addObjectFromRunCode(`-st movimientos -lt 1`, true);
  formModal.type = 'modal';
  

  const optionsClientes = [];
  tmn.getValue('dataClientes').forEach(cliente => {
    optionsClientes.push({ value: cliente.id_cliente, label: cliente.nombre_cliente })
  })

  formModal.setData('id', 'attribute', 'readonly');
  formModal.setData('tipo_oper', 'type', 'select');
  formModal.setData('tipo_oper', 'options', [{ value: 0, label: 'Venta' }, { value: 1, label: 'Cobro' }]);
  formModal.setData('id_cliente', 'name', 'cliente' );
  formModal.setData('id_cliente', 'type', 'select');
  formModal.setData('id_cliente', 'value', tmn.getValue('id_cliente'));
  formModal.setData('id_cliente', 'options', optionsClientes);
  formModal.setData('id_cliente', 'required', true);
  formModal.setData('concepto', 'type', 'textarea')
  formModal.setDataKeys('column', { id: 'col-span-2', id_cliente: 'col-span-10', id_factura: 'col-span-6', fechahora: 'col-span-6', tipo_oper: 'col-span-6', importe: 'col-span-6', concepto: 'col-span-12' });

  formModal.setFunction('reload', verSaldosAcumulados);
  formModal.labelCapitalize();

  const options = {
    title: 'Editar Movimiento Prueba',
    submit: 'Guardar!',
    delete: 'Eliminar!',
  }

 
  formModal.createForm(options);
  
}

tmn.setFunction('papitaResult', (data)=>{
  dataTabla.loadingBody()
  tmn.setValue('id_cliente', data.id);
  tmn.setValue('nombre_cliente', data.name)
  cargarClientes();
  verSaldosAcumulados();
  verSimpleForm();

})

tmn.createSearchInput('papita', 'clientes', 'id_cliente', 'nombre_cliente','', 'Cod.Cli:', 'Cliente:');


cargarClientes();
verSaldosAcumulados();
verSimpleForm();
crearModalForm();



tmn.onMount(() => {
  tmn.changeThemeColor();
})

