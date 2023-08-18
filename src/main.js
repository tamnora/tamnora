import Tamnora from './js/tamnora.js';
import { runcode, login } from './js/tsql.js';
const tmn = new Tamnora();
tmn.setData('contador', 0);


tmn.id('myButton').click(async ()=>{
    
    tmn.data.contador++
    const data = await runcode(`-st movimientos -wr id=${tmn.data.contador}`);

    tmn.id('contador').html(`Valor en ${tmn.data.contador}`)
    tmn.id('titulo').html(`Movimiento Nro ${tmn.data.contador}`)
    tmn.id('detalle').html(`Realizado el ${data[0].fechahora} como concepto ${data[0].concepto} y por el importe de $ ${data[0].importe}`)
    
})

tmn.onMount(() => {
  console.log('¡tamnora.js está listo en index!');
});