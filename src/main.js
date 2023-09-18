import { DataArray, DataObject, Tamnora, structure, runCode, dbSelect } from './js/tamnora'

const tmn = new Tamnora;
const dataTabla = new DataArray('tabla');
const formModal = new DataObject('modalForm')
const simpleForm = new DataObject('simpleform')

tmn.themeColorLight = '#db5945';
tmn.themeColorDark = '#713228';

tmn.setData('idBuscado', '');
tmn.setData('dataClientes', []);
tmn.setData('param', 16);
tmn.setData('cant', 10);
tmn.setData('itab', 0)

tmn.select('#searchInput').change(() => {
  verSaldosAcumulados();
  verSimpleForm();
})

tmn.select('#cant').change(() => {
  verSaldosAcumulados();
  verSimpleForm();
})

tmn.select('#searchCliente').input((e, element) => {
  e.preventDefault();
  let value = e.target.innerText.toLowerCase();
  value = value.replace(/\s+/g, '_');
  const selectionStart = element.selectionStart;
  let result = '';

  if (value.length > 0) {
    const matchingClient = tmn.getData('dataClientes').find((v) => {
      let compara = v.nombre_cliente.replace(/\s+/g, '_');
      return (compara.toLowerCase().startsWith(value))
    }
    );

    if (matchingClient) {
      result = matchingClient.nombre_cliente.substring(value.length);
      result = result.replace(/\s+/g, '&nbsp;');
      tmn.select('#sugerencia').html(`${result}`)
    } else {
      tmn.select('#sugerencia').html(`${result}`)
    }
  } else {
    tmn.select('#sugerencia').html(`${result}`)
  }
})



tmn.select('#searchCliente').keyCodeDown((event, element) => {
  event.preventDefault();
  let value = event.target.innerText.toLowerCase();
  value = value.replace(/\s+/g, '_');
  let result;
  let codClie;
  let index = tmn.getData('itab');

  if (value.length > 0) {

    const matchingClient = tmn.getData('dataClientes').filter(v => {
      let compara = v.nombre_cliente.replace(/\s+/g, '_');
      return (compara.toLowerCase().startsWith(value))
    });

    if (matchingClient) {
      if (event.keyCode == 9) {
        if (index < matchingClient.length - 1) {
          index++
          tmn.setData('itab', index);
        } else {
          index = 0;
          tmn.setData('itab', index);
        }
        console.log(matchingClient.length)
        result = matchingClient[index].nombre_cliente.substring(value.length);
        result = result.replace(/\s+/g, '&nbsp;');
        tmn.select('#sugerencia').html(`${result}`)
      } else {
        codClie = matchingClient[index].id_cliente
        element.innerText = matchingClient[index].nombre_cliente;
        tmn.select('#sugerencia').html('')
        element.focus()
        tmn.setCaretToEnd(element)
        tmn.setData('param', codClie);
        verSaldosAcumulados();
        verSimpleForm();
      }
    }
  } else {
    tmn.select('#sugerencia').html('');
  }
}, [13, 39, 9])

async function cargarClientes() {
  const strClientes = await runCode('-sl id_cliente, nombre_cliente -fr clientes -wr tipo = 0 -ob nombre_cliente');
  tmn.setData('dataClientes', strClientes)
}

async function verSimpleForm(){
  let param = tmn.getData('param');
  await simpleForm.setStructure('movimientos', 'id');
  await simpleForm.addObjectFromRunCode(`-st movimientos -wr id = '${param}'`, true);

  const optionsClientes = [];
  tmn.getData('dataClientes').forEach(cliente => {
    optionsClientes.push({ value: cliente.id_cliente, label: cliente.nombre_cliente })
  })

  simpleForm.setData('tipo_oper', 'type', 'select');
  simpleForm.setData('tipo_oper', 'options', [{ value: 0, label: 'Venta' }, { value: 1, label: 'Cobro' }]);

  simpleForm.setData('id_cliente', 'name', 'cliente' );
  simpleForm.setData('id_cliente', 'type', 'select');
  simpleForm.setData('id_cliente', 'value', param);
  simpleForm.setData('id_cliente', 'options', optionsClientes);
  simpleForm.setData('fechahora', 'setDate', 1)
  simpleForm.setDataKeys('required', {id_cliente: true, importe: true, fechahora: true})
  simpleForm.setFunction('reload', verSaldosAcumulados);
  simpleForm.resetOnSubmit = true;

  
  const options = {
    title: 'Nuevo Movimiento',
    submit: 'Crear',
    delete: 'Borrar'
  }
 
 

  simpleForm.createForm(options);
}

async function verSaldosAcumulados() {
  let rstData;
  let param = tmn.getData('param');
  let cant = tmn.getData('cant');

  if(param){
    rstData = await dbSelect('s', `CALL saldos_acumulados(${param}, ${cant})`)
  } else {
    rstData = await dbSelect('s', `CALL saldos_acumulados(0, 5)`)
  }

  dataTabla.setStructure('movimientos');
  

  if(!rstData[0].Ninguno){
    dataTabla.removeAll();
    dataTabla.setDefaultRow(rstData[0]);
    rstData.forEach(reg => {
      dataTabla.addObject(reg, dataTabla.getStructure())
    });
  } else {
    dataTabla.loadDefaultRow();
  }

  dataTabla.orderColumns = ['tipo_oper', 'id', 'fechahora', 'importe', 'saldo'];
  dataTabla.widthColumns = ['w-5', 'w-5', 'w-10', 'w-15', 'w-35']
  dataTabla.setDataKeys('attribute', { importe: 'currency', saldo: 'pesos' })
  dataTabla.setDataKeys('name', { id_factura: 'Remito' })

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
    title: 'Movimientos del cliente',
    subtitle: 'Selecciona para editar',
    buttons: buttons,
    header: {
      tipo_oper: { class: 'text-left', title: 'Operación' }
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
        function: 'verRemito',
        field: 'id'
      }
    }
  }
  dataTabla.createTable(options);
 
}

cargarClientes();
verSaldosAcumulados();
verSimpleForm();

tmn.onMount(() => {
  tmn.changeThemeColor();
})

dataTabla.setFunction('verRemito', async (ref) => {
  await formModal.setStructure('movimientos', 'id');
  await formModal.addObjectFromRunCode(`-st movimientos -wr id = '${ref[1]}'`);

  const optionsClientes = [];
  tmn.getData('dataClientes').forEach(cliente => {
    optionsClientes.push({ value: cliente.id_cliente, label: cliente.nombre_cliente })
  })

  formModal.setData('tipo_oper', 'type', 'select');
  formModal.setData('tipo_oper', 'options', [{ value: 0, label: 'Venta' }, { value: 1, label: 'Cobro' }]);
  formModal.setData('id_cliente', 'name', 'cliente' );
  formModal.setData('id_cliente', 'type', 'select');
  formModal.setData('id_cliente', 'options', optionsClientes);

  formModal.setFunction('reload', verSaldosAcumulados);

  const options = {
    title: 'Editar Movimiento',
    submit: 'Guardar!',
    delete: 'Eliminar!',
    columns:{md:6, lg:6}
  }

  formModal.createFormModal(options);

})