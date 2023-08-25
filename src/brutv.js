import Tamnora from './js/tamnora.js';
import { styleClass } from './js/style.js';
import { DataObject } from './js/DataObject.js';
import { DataArray } from './js/DataArray.js';
import { runcode, prepararSQL, dbSelect } from './js/tsql.js';

const tmn = new Tamnora({styleClasses:styleClass});
const tblCanales = new DataArray();
const frmCanal = new DataObject();

tmn.setData('canal',{});
tmn.setData('desde', 0);
tmn.setData('orden', 'id');


tmn.setFunction('siguiente',()=>{
  let xdesde = tmn.getData('desde');
  let dif = 100;
  let newDesde;
  
  newDesde = xdesde + dif;
  traerCanales(newDesde);
})

tmn.setFunction('atras',()=>{
  let xdesde = tmn.getData('desde'); //200
  let dif = 100; //100
  let newDesde;

  if((xdesde - 100)>= 0){
    newDesde = xdesde - dif;
    traerCanales(newDesde);
  }
})

tmn.setFunction('guardarMovimiento',async()=>{
  const datos = tmn.getData('canal');
  const xdesde = tmn.getData('desde');
  Object.keys(datos).forEach(val => {
    let valor = datos[val];
    frmCanal.setData(val, 'value', valor)
  })

   const paraSQL = frmCanal.getDataAll();
   const send = prepararSQL('canales', paraSQL);
  
  if(send.status == 1){
    await dbSelect(send.tipo, send.sql).then(val => {
      console.log(val);
      traerCanales(xdesde);
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

tmn.setFunction('verPosicion',()=>{
  if(tmn.getData('orden') == 'id'){
    tmn.setData('orden', 'posicion');
  } else {
    tmn.setData('orden', 'id');
  }

  traerCanales(tmn.getData('desde'));
})

tmn.setFunction('seleccionado',async(params)=>{
  let index = params[0];
  frmCanal.addObject(tblCanales.getDataObjectForKey(index, 'value'));
  frmCanal.setData('id', 'key', 'primary');
  frmCanal.setData('id', 'attribute', 'readonly');
  
 
  frmCanal.forEachField((campo, dato)=>{
    tmn.setDataRoute(`canal!${campo}`, dato.value);
  })
  
  
  const form2 = await frmCanal.newSimpleForm({textSubmit:'Guardar', title:'Canal:', bind:'canal', columns:{md:6, lg:6}});
  tmn.select('#formMovimiento').html(form2)
  tmn.select('#modalMovimiento').addClass('flex')
  tmn.select('#modalMovimiento').removeClass('hidden')
  
 
})

async function traerCanales(desde){
  const xorden = tmn.getData('orden');
  const rst = await runcode(`-sl id, canal, nombre, grupo, posicion -fr canales -ob ${xorden} -lt ${desde}, 100`);
  // const rs = await runcode(`-up canales -se posicion=999 -wr posicion=0`);
  
  tblCanales.removeAll();
  rst.forEach(row => {
    tblCanales.addObject(row);
  })

  const options = {
    row:{
      id:{
        click:'seleccionado',
        class:'text-green-500'
      }
    }
  }

  const tabla = tblCanales.newSimpleTable(0, 100, options);
  tmn.select('#tabla').html(tabla)
  tmn.setData('desde', desde);
  
 
};

traerCanales(0);

