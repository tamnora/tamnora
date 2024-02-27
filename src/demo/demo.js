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

  laTabla.searchValue = valorBuscado;
    cursos = dataFetch.filter(objeto => {
      return objeto.titulo.toLowerCase().includes(valorBuscado.toLowerCase());
    });
  
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

 
    laTabla.addObjectFromArray(cursos);
    laTabla.orderColumns = ['curso_id', 'titulo']
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
  await elForm.addObjectFromRunCode(`-sl curso_id, titulo, precio -fr cursos -wr curso_id = ${id}`, mode)

  elForm.orderColumns = ['curso_id', 'titulo', 'precio']

  console.log(elForm.getDataAll())

  const options = {
    title: 'Editar Movimiento Prueba',
    submit: 'Guardar!',
    delete: 'Eliminar!',
  }

  elForm.createForm(options)
}

structure('b', 'campusvi_cursos').then(val =>{
  console.log(val)
})


