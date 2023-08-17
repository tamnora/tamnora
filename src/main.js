import Tamnora from './js/tamnora.js';
import { runcode } from './js/tsql.js';
const tmn = new Tamnora();
tmn.setData('contador', 0);


async function consularDatos (){
    const tr = await runcode("-st users");
    console.log(tr)
  };

var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
    document.documentElement.classList.add('dark');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
    document.documentElement.classList.remove('dark');
}



tmn.id('theme-toggle').click(function() {
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


tmn.id('myButton').click(async ()=>{

    tmn.data.contador++
    const data = await runcode("-st users");
    
    tmn.id('contador').html(`Valor en ${tmn.data.contador}, ${data[0].firstname} ${data[0].lastname}`)
    
})

tmn.onMount(() => {
  console.log('¡tamnora.js está listo en index!');
});