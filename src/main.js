import {DataArray, DataObject, Tamnora} from './js/tamnora'
import {structure, runcode, prepararSQL, dbSelect} from './js/tsql'

//canales y detalle_factura
const tmn = new Tamnora();
const dataTabla = new DataArray;


tmn.themeColorLight = '#db5945';
tmn.themeColorDark = '#713228';

tmn.setData('idBuscado', '');
tmn.setData('dataClientes', []);
tmn.setData('param', '16');
tmn.setData('cant', 10);




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

tmn.select('#searchCliente').keyCodePress((e, element)=>{
  e.preventDefault();
  let value = e.target.innerText.toLowerCase();
  value = value.replace(/\s+/g, '');
  let result;
  let codClie;
  
  if(value.length > 0){
    result = tmn.getData('dataClientes').filter(v => {
      let compara = v.nombre_cliente.replace(/\s+/g, '');
      return (compara.toLowerCase().startsWith(value))
    });
    if (result.length > 0) {
      let cant = result[0].nombre_cliente.length
      codClie = result[0].id_cliente
      element.innerText = result[0].nombre_cliente;
      tmn.select('#sugerencia').html('')
      element.focus()
      tmn.setCaretToEnd(element)
      tmn.setData('param', codClie);
      verSaldosAcumulados();
    } 
  } else {
    tmn.select('#sugerencia').html('');
  }
}, [13, 39])

async function cargarClientes(){
  const strClientes = await runcode('-sl id_cliente, nombre_cliente -fr clientes -wr tipo = 0');
  tmn.setData('dataClientes', strClientes)
}

async function verSaldosAcumulados(){
  let rstData;
  let param = tmn.getData('param');
  let cant = tmn.getData('cant');
  
  rstData = await dbSelect('s', `CALL saldos_acumulados(${param}, ${cant})`)

  dataTabla.removeAll();

  rstData.forEach(reg => {
    dataTabla.addObject(reg)
  });

  dataTabla.setDataKeys('hidden',{acumulado: true});

  const options = {
    title: 'Lista de canales',
    subtitle: 'Puedes seleccionar el canal',
    field: {
        saldo:{
          class: 'text-end',
          change:(items, valor, index)=>{
            let result = valor;
            if(index == 0){
                result = `<span class="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-100">${valor}</span>`;
            }
            return result;
          }
        },
      },
    row:{
      class:{
        normal: 'bg-neutral-50 dark:bg-neutral-700',
        alternative: 'bg-neutral-100 dark:bg-neutral-800'
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
 





let monm = `
SET @saldoTotal := (SELECT SUM(CASE WHEN tipo_oper = 1 THEN -importe ELSE importe END) FROM movimientos WHERE id_cliente = 16);

SELECT fechahora,  tipo_oper,  importe,  @saldoTotal := CASE WHEN tipo_oper = 1 THEN @saldoTotal - importe ELSE @saldoTotal + importe END AS saldoTotal 
FROM movimientos WHERE id_cliente = 16 ORDER BY fechahora DESC;
`
