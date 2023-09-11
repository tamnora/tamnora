import {DataArray, DataObject, Tamnora} from './js/tamnora'
import {structure, runcode, prepararSQL, dbSelect} from './js/tsql'

//canales y detalle_factura
const tmn = new Tamnora();
const listaCanales = new DataArray
const frmCanalModal = new DataObject;

tmn.setData('idBuscado', '');
tmn.setData('dataCanal', {});
tmn.setData('param', '')

tmn.select('#searchInput').change(()=>{
    let valor = tmn.getData('valorBuscado');
    let param = '';
    
    if (!isNaN(parseInt(valor)) && Number.isInteger(parseFloat(valor))) {
        param = `posicion = ${valor} OR id = ${valor}`;
    } else {
        param = `nombre like '%${valor}%'`;
    }

    tmn.setData('param', param)
    listarCanales(param)
})

frmCanalModal.setFunction('submit', async()=>{
  const datos = tmn.getData('dataCanal');
  frmCanalModal.setDataFromModel(datos);

  const paraSQL = frmCanalModal.getDataAll();
  const send = prepararSQL('canales', paraSQL);
  
  if(send.status == 1){
    await dbSelect(send.tipo, send.sql).then(val => {
      console.log(val),
      listarCanales(tmn.getData('param'));
    })
  }
})

async function listarCanales(param = ''){
  
    if(!listaCanales.getStructure().length > 0){
      await structure('t','canales').then(struct => {
         listaCanales.setStructure(struct)
       });
    }

  
  let canales = '';
  if(param != ''){
    canales = await runcode(`-sl id, posicion, nombre -fr canales -wr ${param} -ob posicion `);
  } else {
    canales = await runcode('-sl id, posicion, nombre -fr canales -ob posicion  -lt 100');
  }
  
  
  if(!canales[0].Ninguno){
    listaCanales.removeAll();
    listaCanales.setDefaultRow(canales[0]);
    canales.forEach(fc => {
      listaCanales.addObject(fc, listaCanales.getStructure())
    })
  } else {
    listaCanales.loadDefaultRow();
  }
  
  
  
  
  const options = {
    title: 'Lista de canales',
    subtitle: 'Puedes seleccionar el canal',
    row:{
      class:{
        normal: 'bg-neutral-50 dark:bg-neutral-700',
        alternative: 'bg-neutral-100 dark:bg-neutral-800'
      },
      click:{
        function: 'verCanal',
        field: 'id'
      }
    }
  }
  
  listaCanales.createTable('#listaCanales', options);
  tmn.select('#listaCanales').bindModel()
  
  
  }

  
  listaCanales.setFunction('verCanal', async(ref)=>{
    let sq = `-sl id, posicion, nombre -fr canales -wr id = '${ref[1]}'`;
    let canal = await runcode(sq);

    canal.forEach(value => {
      frmCanalModal.addObject(value, listaCanales.getStructure())
    })
    
    frmCanalModal.forEachField((campo, dato)=>{
      tmn.setDataRoute(`dataCanal!${campo}`, dato.value);
    })

    frmCanalModal.setData('id', 'hidden', true);
    frmCanalModal.setDataKeys('column', {'nombre': 12})

    const options = {
        title:'Editar Canal',
        submit:'Guardalo!',
        bind: 'dataCanal'
    }

    frmCanalModal.createFormModal('#modalForm', options);
    tmn.select("#modalForm").bindModel();

  })
    
    listarCanales();
 