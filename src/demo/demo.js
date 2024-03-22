import { Tamnora, structure, runCode, dbSelect } from '../js/tamnora2'
import { navbar } from '../components/navbar.tmn';

const tmn = new Tamnora;
const laTabla = tmn.newTable('tabla');
const elForm = tmn.newForm('formulario');
let dataFetch = [];

tmn.setValue('buscado', 'casa');


tmn.setValue('idSelected', 0);

tmn.select('#navbar').html(navbar('Tamnora js'))
tmn.setComponentHTML

tmn.setFunction('accionBuscar',()=>{
  let valorBuscado = tmn.getValue('buscando');
  let cursos = dataFetch;

  laTabla.searchValue = ''

  if(valorBuscado){
    laTabla.searchValue = valorBuscado;
    cursos = dataFetch.filter(objeto => {
      return objeto.titulo.toLowerCase().includes(valorBuscado.toLowerCase());
    });
  }
  
  laTabla.addObjectFromArray(cursos);
  laTabla.setDataKeys('attribute', { precio: 'pesos' })
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
  let btnNuevo = tmn.createButton({title: 'Nuevo', dataClick: 'nuevoRegistro,0', className: 'btnBlue'})
  
  let buttons = `${inputSearch}${btnNuevo}`;
  laTabla.addObjectFromArray(cursos);
  laTabla.orderColumns = ['curso_id', 'titulo', 'precio'];
  laTabla.setDataKeys('attribute', { precio: 'pesos' })
  laTabla.setData('titulo','defaultValue', 'No existen datos')

  
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

function separarEnParrafos(texto) {
  // Divide el texto en líneas usando expresión regular
  const lineas = texto.split(/(\r\n|\n|\r)/);

  // Filtra las líneas vacías (si las hay)
  const parrafos = lineas.filter((linea) => linea.trim() !== '')
    .map((linea) => {
      if (linea.includes('*')) {
        // Si la línea contiene asteriscos, envuelve el texto entre asteriscos en negrita
        let partes = linea.split('*');
        for (let i = 1; i < partes.length; i += 2) {
          partes[i] = `<strong>${partes[i]}</strong>`;
        }
        return `<p>${partes.join('')}</p>`;
      } else {
        // De lo contrario, simplemente envuelve la línea en un párrafo normal
        return `<p>${linea}</p>`;
      }
    });

  // Une los párrafos en un solo string
  return parrafos.join('');
}



async function cargarFormulario(){
  const id = tmn.getValue('idSelected');
  const mode = id == 0? true : false;
  let tsql = `-sl curso_id, titulo, precio, resumen, descripcion -fr cursos 
  -wr curso_id = ${id}`

  if(mode){
    tsql = `-sl curso_id, titulo, precio, resumen, descripcion -fr cursos -lt 1`
  }

  await elForm.setStructure('cursos', 'curso_id')
  await elForm.addObjectFromRunCode(tsql, mode)
  elForm.type = 'modal'

  elForm.orderColumns = ['curso_id', 'titulo', 'precio', 'resumen', 'descripcion']
  elForm.setDataKeys('type', {descripcion: 'textarea'});
  elForm.setDataKeys('column', { curso_id: 'col-span-2', titulo: 'col-span-10', precio: 'col-span-6', resumen: 'col-span-6', descripcion: 'col-span-12' });

  elForm.setData('descripcion', 'rows', 12);
  elForm.setData('resumen', 'observ', 'Puedes con todo esto')
  elForm.setFunction('reload', async ()=>{
    await traerDatos().then(data => {
      dataFetch = data[0].cursos
      laTabla.functions.accionBuscar();
    })
  });

  elForm.labelCapitalize();
let descripcion = elForm.data.formulario.descripcion
let parrafos = separarEnParrafos(descripcion)
// descripcion = descripcion.replace(/\n/g, '\\n');
  console.log(parrafos)

  let inputSearch = tmn.createSearch();
  let btnNuevo = tmn.createButton({title: 'Nuevo'})
  
  let buttons = `${inputSearch}${btnNuevo}`;
 

  const options = {
    title: 'Editar Movimiento Prueba',
    subtitle: 'Editamos el contenido de los cursos',
    buttons: buttons,
    submit: 'Guardar!',
    delete: 'Eliminar!',
  }

  elForm.createForm(options)
  elForm.functions.openModal();
}

structure('t', 'cursos').then(val =>{
  console.log(val)
})


