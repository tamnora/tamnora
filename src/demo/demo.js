import { Tamnora, structure, runCode, dbSelect } from '../js/tamnora'
import { navbar } from '../components/navbar.tmn';

const tmn = new Tamnora;
const laTabla = tmn.newTable('tabla')


tmn.select('#navbar').html(navbar('Tamnora js'))
tmn.setFunction('accionBuscar',()=>{
  cargarTabla();
})

tmn.setComponentHTML

async function cargarTabla(){
  const response = await fetch(`https://api.campusvirtualisei.com/cursos`);
  const data = await response.json()

  let valorBuscado = tmn.getValue('buscando');
  let cursos = data[0].cursos;

  if(valorBuscado){
    console.log('tenemos Datos', valorBuscado)
    cursos = cursos.filter(objeto => {
      return objeto.titulo.toLowerCase().includes(valorBuscado.toLowerCase());
    });
  }

  if(cursos.length > 0){
    laTabla.addObjectFromArray(cursos);
    laTabla.orderColumns = ['curso_id', 'titulo']
    laTabla.createTable({row:{alternative: true}})
  }
}


cargarTabla()
