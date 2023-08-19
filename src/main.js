import Tamnora from './js/tamnora.js';
import { styleClass } from './js/style.js';
import {DataObject} from './js/DataObject';
import { runcode} from './js/tsql.js';
const tmn = new Tamnora({styleClasses:styleClass});

tmn.setData('contador', 0);

const formData = new DataObject();


(async ()=>{
  const data = await runcode(`-st movimientos -wr id=20`);
  formData.addObject(data[0]);
  console.log(formData.getDataAll());
})();


tmn.select('#myButton').click(async ()=>{ 
    tmn.data.contador++
})




tmn.onMount(() => {
  console.log('¡tamnora.js está listo en index!');
  tmn.select('#loader').addClass('hidden');
  tmn.select('#app').removeClass('hidden');
  tmn.selectAll('a').forEach(e => {
    console.log(e.value);
  });
  tmn.select('#toggle-theme').click(()=>{
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
          document.documentElement.classList.add('dark');
          localStorage.setItem('color-theme', 'dark');
          themeToggleLightIcon.classList.remove('hidden');
          themeToggleDarkIcon.classList.add('hidden');
          
      } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
          themeToggleDarkIcon.classList.remove('hidden');
          themeToggleLightIcon.classList.add('hidden');
          
      }

  // if NOT set via local storage previously
  } else {
      if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('color-theme', 'light');
          themeToggleDarkIcon.classList.remove('hidden');
          themeToggleLightIcon.classList.add('hidden');
      } else {
          document.documentElement.classList.add('dark');
          themeToggleLightIcon.classList.remove('hidden');
          themeToggleDarkIcon.classList.add('hidden');
          localStorage.setItem('color-theme', 'dark');
      }
  }
  })
});

