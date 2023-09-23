import { DataArray, DataObject, Tamnora, structure, runCode, dbSelect } from './js/tamnora'

const tmn = new Tamnora;
const dataTabla = new DataArray('tabla');
const formModal = new DataObject('modalForm')
const simpleForm = new DataObject('simpleform')

tmn.themeColorLight = '#db5945';
tmn.themeColorDark = '#713228';

tmn.setData('idBuscado', '');
tmn.setData('dataClientes', []);

tmn.setData('cant', 10);
tmn.setData('itab', 0);
tmn.setData('id_cliente', 0)
tmn.setData('nombre_cliente', '')



async function cargarClientes() {
  const strClientes = await runCode('-sl id_cliente, nombre_cliente -fr clientes -wr tipo = 0 -ob nombre_cliente');
  tmn.setData('dataClientes', strClientes)
}

async function verSimpleForm(){
  await simpleForm.setStructure('movimientos', 'id');
  await simpleForm.addObjectFromRunCode(`-st movimientos -lt 1`, true);

  const optionsClientes = [];
  tmn.getData('dataClientes').forEach(cliente => {
    optionsClientes.push({ value: cliente.id_cliente, label: cliente.nombre_cliente })
  })

  simpleForm.setData('tipo_oper', 'type', 'select');
  simpleForm.setData('tipo_oper', 'options', [{ value: 0, label: 'Venta' }, { value: 1, label: 'Cobro' }]);
  simpleForm.setData('tipo_oper', 'elegirOpcion', true);
  simpleForm.setData('id_cliente', 'name', 'cliente' );
  simpleForm.setData('id_cliente', 'type', 'select');
  simpleForm.setData('id_cliente', 'value', tmn.getData('id_cliente'));
  simpleForm.setData('id_cliente', 'options', optionsClientes);
  
  simpleForm.setData('fechahora', 'introDate', true);
  simpleForm.setDataKeys('required', {id_cliente: true, importe: true, fechahora: true})
  simpleForm.setFunction('reload', verSaldosAcumulados);
  simpleForm.resetOnSubmit = true;

  
  const options = {
    title: 'Nuevo Movimiento',
    submit: 'Crear'
  }
 
 
  simpleForm.createForm(options);
}

async function verSaldosAcumulados() {
  let cant = tmn.getData('cant') || 5;
  await dataTabla.setStructure('movimientos');
  await dataTabla.addObjectFromDBSelect(`CALL saldos_acumulados(${tmn.getData('id_cliente')}, ${cant})`);

  
  dataTabla.orderColumns = ['tipo_oper', 'id', 'fechahora', 'id_factura', 'importe', 'saldo'];
  dataTabla.widthColumns = ['w-10', 'w-10', 'w-10', 'w-20', 'w-20', 'w-35'];
  dataTabla.setDataKeys('attribute', { importe: 'currency', saldo: 'pesos' })
  dataTabla.setDataKeys('name', { id_factura: 'Remito' })
  console.log(dataTabla.getDataAll())
  
  let buttons = `
    <div class="inline-flex rounded-md shadow-sm" role="group">
      <button type="button" data-action="newMovi, 0" class="px-4 py-2 text-sm focus:outline-none font-medium text-neutral-900 bg-white border border-neutral-200 rounded-l-lg hover:bg-neutral-100 hover:text-blue-700 focus:z-10  focus:text-blue-700 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600  dark:focus:text-blue-200">
        Nuevo Movimiento
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
      class: {
        normal: 'bg-neutral-50 dark:bg-neutral-700',
        alternative: 'bg-neutral-100 dark:bg-neutral-800'
      },
      click: {
        function: 'showMovi',
        field: 'id'
      }
    }
  }

  if(tmn.getData('id_cliente') > 0){
    options.subtitle = `${tmn.getData('nombre_cliente')} (Cod. Cliente: ${tmn.getData('id_cliente')})`
  } 

  dataTabla.createTable(options);

  dataTabla.setFunction('showMovi', async (ref) => {
    formModal.setData('id_cliente', 'elegirOpcion', false);
    formModal.setData('tipo_oper', 'elegirOpcion', false)
    formModal.updateDataInForm(dataTabla.getDataObjectForKey(ref[0],'value'))
    formModal.functions.openModal();
    
  })

  dataTabla.setFunction('newMovi', async (ref) => {
    formModal.setDataDefault('id_cliente', 'value', tmn.getData('id_cliente'));
    formModal.setDataDefault('fechahora', 'introDate', true)
    formModal.setData('tipo_oper', 'elegirOpcion', true)
    formModal.updateDataInFormForNew();
    formModal.functions.openModal();
    
  })
}

async function crearModalForm(){
  await formModal.setStructure('movimientos', 'id');
  await formModal.addObjectFromRunCode(`-st movimientos -lt 1`, true);

  const optionsClientes = [];
  tmn.getData('dataClientes').forEach(cliente => {
    optionsClientes.push({ value: cliente.id_cliente, label: cliente.nombre_cliente })
  })

  formModal.setData('tipo_oper', 'type', 'select');
  formModal.setData('tipo_oper', 'options', [{ value: 0, label: 'Venta' }, { value: 1, label: 'Cobro' }]);
  formModal.setData('id_cliente', 'name', 'cliente' );
  formModal.setData('id_cliente', 'type', 'select');
  formModal.setData('id_cliente', 'value', tmn.getData('id_cliente'));
  formModal.setData('id_cliente', 'options', optionsClientes);
  formModal.setData('id_cliente', 'required', true);

  formModal.setFunction('reload', verSaldosAcumulados);

  const options = {
    title: 'Editar Movimiento',
    submit: 'Guardar!',
    delete: 'Eliminar!',
    columns:{md:6, lg:6}
  }

  formModal.createFormModal(options);
  
}

tmn.setFunction('papitaResult', (data)=>{
  tmn.setData('id_cliente', data.id);
  tmn.setData('nombre_cliente', data.name)
  cargarClientes();
  verSaldosAcumulados();
  verSimpleForm();
  console.log(data)
})

tmn.createSearchInput('papita', 'clientes', 'id_cliente', 'nombre_cliente');

cargarClientes();
verSaldosAcumulados();
verSimpleForm();
crearModalForm();


tmn.onMount(() => {
  tmn.changeThemeColor();
})

