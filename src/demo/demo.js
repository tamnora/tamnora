import { Tamnora, structure, runCode, dbSelect } from '../js/tamnora'
import { navbar } from '../components/navbar.tmn';

const tmn = new Tamnora;
const laTabla = tmn.newTable('tabla');
const elForm = tmn.newForm('formulario');
let dataFetch = [];

laTabla.setValue('buscado', 'casa');

tmn.setValue('idSelected', 0);

tmn.select('#navbar').html(navbar('Tamnora js'))
tmn.setComponentHTML

laTabla.setFunction('accionBuscar',()=>{
  let valorBuscado = laTabla.getValue('buscando');
  let cursos = dataFetch;

  laTabla.searchValue = ''

  if(valorBuscado){
    laTabla.searchValue = valorBuscado;
    cursos = dataFetch.filter(objeto => {
      return objeto.titulo.toLowerCase().includes(valorBuscado.toLowerCase());
    });
  }
  
  laTabla.addObjectFromArray(cursos);
  laTabla.updateTable();
  
})

laTabla.setFunction('nuevoRegistro', (e)=>{
  console.log(e)
  tmn.setValue('idSelected', 0);
  
  cargarFormulario()
})




async function traerDatos(){
  const response = await fetch(`https://api.campusvirtualisei.com/cursos`);
  const data = await response.json()
  return data
}

traerDatos().then(data => {
  dataFetch = data[0].cursos
  cargarTabla()
})

function cargarTabla(){
  let valorBuscado = laTabla.getValue('buscando');
  let cursos = dataFetch;

  if(valorBuscado){
    laTabla.searchValue = valorBuscado;
    cursos = dataFetch.filter(objeto => {
      return objeto.titulo.toLowerCase().includes(valorBuscado.toLowerCase());
    });
  }

  
  laTabla.searchColumns= ['titulo'];
  let inputSearch = tmn.createSearch({valorBuscado: valorBuscado});
  let btnNuevo = tmn.createButton({title: 'Nuevo', dataClick: 'nuevoRegistro,0'})
  
  let buttons = `${inputSearch}${btnNuevo}`;
  laTabla.addObjectFromArray(cursos);
  laTabla.orderColumns = ['curso_id', 'titulo', 'precio'];
  laTabla.setDataKeys('attribute', { precio: 'pesos' })

  console.log(laTabla.getDataAll());

  const options = {
    title: 'Movimientos del cliente',
    subtitle: `No se ha seleccionado ningún Cliente`,
    buttons: buttons,
    row: {
      alternative: true,
      click: {
        function: 'showMovi',
        field: 'curso_id'
      }
    }
  }

 
    laTabla.createTable(options)



    laTabla.setFunction('showMovi', (data)=>{
      console.log(data)
      tmn.setValue('idSelected', data[1]);
      cargarFormulario()
    })

    
  
}

async function cargarFormulario(){
  const id = tmn.getValue('idSelected');
  console.log(id)
  const mode = id == 0? true : false;
  await elForm.setStructure('cursos', 'curso_id')
  elForm.removeAll()
  await elForm.addObjectFromRunCode(`-sl curso_id, titulo, precio, resumen, descripcion -fr cursos -wr curso_id = ${id}`, mode)
  elForm.type = 'modal'

  elForm.orderColumns = ['curso_id', 'titulo', 'precio', 'resumen', 'descripcion']
  elForm.setDataKeys('type', {descripcion: 'textarea'});
  elForm.setDataKeys('column', { curso_id: 'col-span-2', titulo: 'col-span-10', precio: 'col-span-6', resumen: 'col-span-6', descripcion: 'col-span-12' });
  elForm.setFunction('reload', async ()=>{
    await traerDatos().then(data => {
      dataFetch = data[0].cursos
      laTabla.functions.accionBuscar();
    })
  });

  elForm.labelCapitalize();
 

  const options = {
    title: 'Editar Movimiento Prueba',
    submit: 'Guardar!',
    delete: 'Eliminar!',
  }

  elForm.createForm(options)
  elForm.functions.openModal();
}

structure('t', 'cursos').then(val =>{
  console.log(val)
})


