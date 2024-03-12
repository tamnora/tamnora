import { Tamnora } from '../js/tamnora2';
import { navbar } from '../components/navbar.tmn';


const tmn = new Tamnora;
const tabla = tmn.newTable('tabla');
const form = tmn.newForm('form');

tmn.setValue('idSelected', 0);
tmn.select('#navbar').html(navbar('Tamnora js'))
tmn.setComponentHTML


tmn.fetchData(`https://api.campusvirtualisei.com/cursos`)
  .then(data => {
    tmn.setValue('cursos', data[0].cursos);
    creandoElementos();
  });


tmn.setFunction('showMovi', (data)=>{
  tmn.setValue('form', tmn.getValue('tabla')[data[0]])
  form.addData(tmn.getValue('tabla')[data[0]])
  form.update();
  
})

function creandoElementos(){
  let cursos = tmn.getValue('cursos');
  tabla.addData(cursos)
  tabla.columns = ['curso_id', 'titulo']
  form.addData(cursos[1])
  form.show = 'modal'
  form.setDataKey('type', {precio: 'currency'});


  const options = {
    title: 'Titulo de la tabla',
    subtitle: 'Subtitulo de la tabla',
    row: {
      alternative: true,
      click: {
        function: 'showMovi',
        field: 'curso_id'
      }
    }
  }

  
  tabla.createTable(options);
  
  form.createForm()
  
}