import {DataArray, DataObject, Tamnora, structure, runCode, dbSelect} from './js/tamnora'

//canales y detalle_factura
const tmn = new Tamnora;
const dataTabla = new DataArray;
const dataObjecto = new DataObject

tmn.themeColorLight = '#db5945';
tmn.themeColorDark = '#713228';

tmn.setData('idBuscado', '');
tmn.setData('dataClientes', []);
tmn.setData('param', '16');
tmn.setData('cant', 10);
tmn.setData('itab', 0)


tmn.select('#searchInput').change(()=>{
    verSaldosAcumulados();
})

tmn.select('#cant').change(()=>{
    verSaldosAcumulados();
})

tmn.select('#searchCliente').input((e, element)=>{
  e.preventDefault();
  let value = e.target.innerText.toLowerCase();
  value = value.replace(/\s+/g, '_');
  const selectionStart = element.selectionStart;
  let result = '';
  
  
  if(value.length > 0){
    const matchingClient = tmn.getData('dataClientes').find((v) =>{
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

tmn.select('#searchCliente').keyCodeDown((event, element)=>{
  event.preventDefault();
  let value = event.target.innerText.toLowerCase();
  value = value.replace(/\s+/g, '_');
  let result;
  let codClie;
  let index = tmn.getData('itab');


  if(value.length > 0){
    const matchingClient = tmn.getData('dataClientes').filter(v => {
      let compara = v.nombre_cliente.replace(/\s+/g, '_');
      return (compara.toLowerCase().startsWith(value))
    });

    if (matchingClient) {
      if(event.keyCode == 9){
        if(index < matchingClient.length - 1 ){
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
      }
    } 
  } else {
    tmn.select('#sugerencia').html('');
  }
}, [13, 39, 9])

async function cargarClientes(){
  const strClientes = await runCode('-sl id_cliente, nombre_cliente -fr clientes -wr tipo = 0');
  tmn.setData('dataClientes', strClientes)
}

async function verSaldosAcumulados(){
  let rstData;
  let param = tmn.getData('param');
  let cant = tmn.getData('cant');
  
  rstData = await dbSelect('s', `CALL saldos_acumulados(${param}, ${cant})`)


  dataTabla.setStructure('movimientos');

  dataTabla.removeAll();

  rstData.forEach(reg => {
    dataTabla.addObject(reg,dataTabla.getStructure())
  });

  dataTabla.setDataKeys('hidden',{acumulado: true});
  dataTabla.setDataKeys('name', {id_factura: 'Remito'})

  const options = {
    title: 'Lista de canales',
    subtitle: 'Puedes seleccionar el canal',
    header:{
      tipo_oper: {class: 'text-left', title: 'Operación'}
    },
    field: {
        saldo:{
          class: 'text-end',
          change:(data)=>{
            let result = data.valor;
            if(data.index == 0){
                result = `<span class="bg-red-100 text-red-700 text-normal font-semibold px-3 py-1 rounded dark:bg-red-700 dark:text-red-100">${data.valor}</span>`;
            }
            return result;
          }
        },
        tipo_oper: {
          class: 'text-semibold',
          change:(data)=>{
            let tipos = ['Venta', 'Cobro', 'Compra', 'Pago'];
            return tipos[data.valor];
          }
        }
      },
    row:{
      class:{
        normal: 'bg-neutral-50 dark:bg-neutral-700',
        alternative: 'bg-neutral-100 dark:bg-neutral-800'
      },
      click:{
        function: 'verRemito',
        field: 'id'
      }
    }
  }

  dataTabla.createTable('#tabla', options);
  
  }

  cargarClientes();
  verSaldosAcumulados();

  tmn.onMount(()=>{
    tmn.changeThemeColor();
  })

  dataObjecto.setFunction('submit', (() => {
    setTimeout(() => {
      console.log(dataObjecto.getValue('form'))
    }, 3000);
    
  }))
 

  dataTabla.setFunction('verRemito', async(ref)=>{
    await dataObjecto.setStructure('movimientos');
    await dataObjecto.addObjectFromRunCode(`-st movimientos -wr id = '${ref[1]}'`);

    dataObjecto.setData('tipo_oper', 'type', 'select');
    dataObjecto.setData('tipo_oper', 'options', [{value: 0, label: 'Venta'}, {value:1, label:'Cobro'}]);
  
    const options = {
        title:'Editar Movimiento',
        submit:'Guardalo!'
    }

    dataObjecto.createFormModal('#modalForm', options);
    
  })


