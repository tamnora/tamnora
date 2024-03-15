import { Tamnora } from '../js/tamnora2';
import { navbar } from '../components/navbar.tmn';


const tmn = new Tamnora;
const tabla = tmn.newTable('tabla');
const form = tmn.newForm('form');


tmn.setValue('idSelected', 0);
tmn.setValue('textToSearch', '')
tmn.select('#navbar').html(navbar('Tamnora js'))
tmn.setComponentHTML
tabla.loadingTable({withHeader:true});


tmn.fetchData(`https://api.campusvirtualisei.com/cursos`)
  .then(data => {
    tmn.setValue('cursos', data[0].cursos);
    creandoElementos();
  });


tmn.setFunction('showMovi', (data)=>{
  tmn.setValue('form', tmn.getValue('tabla')[data[0]])
  form.updateData(tmn.getValue('tabla')[data[0]])
  form.openModal();
})

tmn.setFunction('nuevoCurso', ()=>{
  form.newData();
  form.openModal();
})

tmn.setFunction('textToSearchGo', (data)=>{
  let valorBuscado = tmn.getValue('textToSearch');
  let cursos = tmn.getValue('cursos');

  tabla.searchValue = ''

  if(valorBuscado){
    tabla.searchValue = valorBuscado;
    cursos = cursos.filter(objeto => {
      return objeto.titulo.toLowerCase().includes(valorBuscado.toLowerCase());
    });
  }
  
  tabla.updateData(cursos);
})

form.onSubmit(async (response)=> {
  console.log('La respuesta es', response)
  await tmn.fetchData(`https://api.campusvirtualisei.com/cursos`)
  .then(data => {
    tmn.setValue('cursos', data[0].cursos);
    let cursos = tmn.getValue('cursos');
    tabla.updateData(cursos);
  });
})

async function creandoElementos(){
  let cursos = tmn.getValue('cursos');
  tabla.addData(cursos);
  tabla.searchColumns= ['titulo'];
  tabla.columns = ['curso_id', 'titulo', 'precio'];

  await tmn.setStructure('cursos', 'curso_id', false, 'form')
  form.addData(cursos[1]);
  form.view = 'modal'
  form.setDataKeys('type', {precio: 'currency'});
  form.columns = ['curso_id', 'titulo', 'resumen', 'descripcion', 'imagen', 'video', 'precio']
  form.setDataKeys('type', {descripcion: 'textarea'});
  form.setDataKeys('column', { curso_id: 'col-span-2', titulo: 'col-span-10', resumen: 'col-span-12', descripcion: 'col-span-12', imagen: 'col-span-4', video: 'col-span-4', precio: 'col-span-4' });

  form.setData('descripcion', 'rows', 10);
  form.setDataKeys('attribute', {curso_id: 'readonly'})
  form.setData('descripcion', 'observ', 'Puedes encerrar un texto con * para especificar un texto en negrita')

  let inputSearch = tmn.createSearch({});
  let btnNuevo = tmn.createButton({title: 'Nuevo', dataClick: 'nuevoCurso'})
  let buttons = `${inputSearch}${btnNuevo}`;
  
  


  const optionsTable = {
    title: 'Titulo de la tabla',
    subtitle: 'Subtitulo de la tabla',
    buttons: buttons,
    row: {
      alternative: true,
      click: {
        function: 'showMovi',
        field: 'curso_id'
      }
    }
  }

  

  const optionsForm = {
    title: 'Editar Movimiento Prueba',
    subtitle: 'Editamos el contenido de los cursos',
    submit: 'Guardar!',
    delete: 'Eliminar!',
  }

  tabla.createTable(optionsTable);
  form.createForm(optionsForm)
  
}