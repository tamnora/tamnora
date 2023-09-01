import {DataArray, DataObject, Tamnora} from './js/tamnora'
import {structure, runcode} from './js/tsql'

//canales y detalle_factura
const tmn = new Tamnora();
const listaCanales = new DataArray
const frmCanal = new DataObject;

tmn.setData('idBuscado');

tmn.select('#searchInput').change(()=>{
    let valor = tmn.getData('valorBuscado');
    let param = '';
    
    if (!isNaN(parseInt(valor)) && Number.isInteger(parseFloat(valor))) {
        param = `posicion = ${valor} `;
    } else {
        param = `nombre like '%${valor}%'`;
    }

    
    listarCanales(param)
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
  
  listaCanales.setDataKeys('attribute',{id: 'hidden'})
  
  
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
    let sq = `-sl posicion, nombre -fr canales -wr id = '${ref[1]}'`;
    let canal = await runcode(sq);

    frmCanal.addObject(canal[0], listaCanales.getStructure())

    const options = {
        title:'Editar Canal',
        submit:'Guardalo!'
    }
    frmCanal.createFormModal('#modalForm', options)

})
    
    listarCanales();
 