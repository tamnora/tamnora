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
  
 
});

