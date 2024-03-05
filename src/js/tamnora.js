const SERVER = import.meta.env.VITE_SERVER_NODE;
const TYPE_SERVER = 'node';


let informe = { primero: 'nada', segundo: 'nada' };


function createQuerySQL(type, params) {
  if (typeof type !== 'string') {
    throw new Error('type debe ser un string');
  }

  if (!['select', 'insert', 'update', 'delete'].includes(type)) {
    throw new Error('type debe ser uno de: select, insert, update, delete');
  }

  if (!(params instanceof Object)) {
    throw new Error('params debe ser un objeto');
  }

  if (!params.t) {
    throw new Error("params['t'] debe estar definido dentro del objeto");
  }

  const validColumns = /^\w+(,\s*\w+)*$/;

  let query = '';
  switch (type) {
    case 'select':
      const columns = params.c ? (validColumns.test(params.c) ? params.c : '*') : '*';
      const table = params.t;
      const join = params.j ? ` ${params.j}` : '';
      const where = params.w ? ` WHERE ${params.w}` : '';
      const groupBy = params.g ? ` GROUP BY ${params.g}` : '';
      const having = params.h ? ` HAVING ${params.h}` : '';
      const order = params.o ? ` ORDER BY ${params.o}` : '';
      const limit = params.l ? ` LIMIT ${params.l}` : ' LIMIT 100';
      query = `SELECT ${columns} FROM ${table}${join}${where}${groupBy}${having}${order}${limit}`;
      break;

    case 'insert':
      const tableInsert = params.t;
      const data = params.d || {};
      const keysInsert = Object.keys(data).join(', ');
      const valuesInsert = Object.values(data).map(value => {
        if (value == null || value == undefined) {
          return 'null';
        } else if (typeof value === 'string') {
          return `'${value}'`;
        } else {
          return value;
        }
      }).join(', ');
      query = `INSERT INTO ${tableInsert} (${keysInsert}) VALUES (${valuesInsert})`;
      break;

    case 'update':
      const tableUpdate = params.t;
      const dataUpdate = params.d || {};
      const setData = Object.entries(dataUpdate).map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`).join(', ');
      const whereUpdate = params.w ? ` WHERE ${params.w}` : '';
      query = `UPDATE ${tableUpdate} SET ${setData}${whereUpdate}`;
      break;

    case 'delete':
      const tableDelete = params.t;
      const whereDelete = params.w ? ` WHERE ${params.w}` : '';
      query = `DELETE FROM ${tableDelete}${whereDelete}`;
      break;
  }

  return query;
}

function codeTSQL(frase) {
  let lista = [
    { buscar: 'select', cambiarPor: '-lectes' },
    { buscar: '*', cambiarPor: '-kuiki' },
    { buscar: 'from', cambiarPor: '-morf' },
    { buscar: 'inner', cambiarPor: '-nerin' },
    { buscar: 'join', cambiarPor: '-injo' },
    { buscar: 'update', cambiarPor: '-teupda' },
    { buscar: 'delete', cambiarPor: '-tedele' },
    { buscar: 'insert', cambiarPor: '-sertint' },
    { buscar: 'values', cambiarPor: '-luesva' },
    { buscar: 'set', cambiarPor: '-tes' },
    { buscar: 'into', cambiarPor: '-toin' },
    { buscar: 'where', cambiarPor: '-rewhe' },
    { buscar: 'as', cambiarPor: '-sa' },
    { buscar: 'on', cambiarPor: '-no' },
    { buscar: 'or', cambiarPor: '-ro' },
    { buscar: 'and', cambiarPor: '-ty' },
    { buscar: 'order', cambiarPor: '-enor' },
    { buscar: 'by', cambiarPor: '-yb' },
    { buscar: 'desc', cambiarPor: '-csed' },
    { buscar: 'asc', cambiarPor: '-cas' },
    { buscar: '<', cambiarPor: '-nim' },
    { buscar: '>', cambiarPor: '-xam' },
    { buscar: '<>', cambiarPor: '-nimxam' },
    { buscar: 'group', cambiarPor: '-puorg' },
    { buscar: 'having', cambiarPor: '-gnivah' },
    { buscar: 'left', cambiarPor: '-tfel' },
    { buscar: 'right', cambiarPor: '-thgir' },
    { buscar: 'limit', cambiarPor: '-timil' }
  ];


  frase = frase.replace(';', ' ');
  // Primero, reemplazamos todos los saltos de línea y tabulaciones por un espacio en blanco
  frase = frase.replace(/(\r|\t)/gm, ' ');

  // frase = frase.replace(/(\n)/gm, '\\n');
  frase = frase.replace(/('[^']*')|(\n)/gm, (match, p1) => {
    if (p1) {
      // Si es un texto entre comillas simples, reemplázalo por '\n'
      return p1.replace(/\n/g, '\\n');
    } else {
      // Si es un salto de línea, reemplázalo por un espacio
      return ' ';
    }
  });
  // Luego, reemplazamos cualquier secuencia de espacios en blanco por un solo espacio
  frase = frase.replace(/\s+/g, ' ');
  let arrayFrase = frase.split(' ');
  let newFrase = arrayFrase.map((parte) => {
    let busca = parte.toLowerCase();
    let valor = lista.find((obj) => obj.buscar == busca);
    return valor ? valor.cambiarPor : parte;
  });
  frase = newFrase.join('tmn');
  return frase;
}

function decodeTSQL(frase) {
  let lista = [
    { cambiarPor: 'SELECT', buscar: '-lectes' },
    { cambiarPor: '*', buscar: '-kuiki' },
    { cambiarPor: 'FROM', buscar: '-morf' },
    { cambiarPor: 'INNER', buscar: '-nerin' },
    { cambiarPor: 'JOIN', buscar: '-injo' },
    { cambiarPor: 'UPDATE', buscar: '-teupda' },
    { cambiarPor: 'DELETE', buscar: '-tedele' },
    { cambiarPor: 'INSERT', buscar: '-sertint' },
    { cambiarPor: 'VALUES', buscar: '-luesva' },
    { cambiarPor: 'SET', buscar: '-tes' },
    { cambiarPor: 'INTO', buscar: '-toin' },
    { cambiarPor: 'WHERE', buscar: '-rewhe' },
    { cambiarPor: 'AS', buscar: '-sa' },
    { cambiarPor: 'ON', buscar: '-no' },
    { cambiarPor: 'OR', buscar: '-ro' },
    { cambiarPor: 'AND', buscar: '-ty' },
    { cambiarPor: 'ORDER', buscar: '-enor' },
    { cambiarPor: 'BY', buscar: '-yb' },
    { cambiarPor: 'ASC', buscar: '-cas' },
    { cambiarPor: 'DESC', buscar: '-csed' },
    { cambiarPor: '<', buscar: '-nim' },
    { cambiarPor: '>', buscar: '-xam' },
    { cambiarPor: '<>', buscar: '-nimxam' },
    { cambiarPor: 'group', buscar: '-puorg' },
    { cambiarPor: 'having', buscar: '-gnivah' },
    { cambiarPor: 'left', buscar: '-tfel' },
    { cambiarPor: 'right', buscar: '-thgir' },
    { cambiarPor: 'limit', buscar: '-timil' }
  ];

  let arrayFrase = frase.split('tmn');

  let newFrase = arrayFrase.map((parte) => {
    let busca = parte.toLowerCase();
    let valor = lista.find((obj) => obj.buscar == busca);
    return valor ? valor.cambiarPor : parte;
  });
  frase = newFrase.join(' ');
  return frase;
}

function convertirClavesAMinusculas(objeto) {
  const resultado = {};
  for (const clave in objeto) {
    if (Object.prototype.hasOwnProperty.call(objeto, clave)) {
      const claveMinuscula = clave.toLowerCase();
      resultado[claveMinuscula] = objeto[clave];
    }
  }
  return resultado;
}

function convertirClavesAMinusculasYFormatoFecha(objeto) {
  const resultado = {};

  for (const clave in objeto) {
    if (Object.prototype.hasOwnProperty.call(objeto, clave)) {
      let valor = objeto[clave];

      if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(valor)) {
        // Si el valor es una cadena que coincide con el formato de fecha ISO, conviértelo
        let fechaFormateada = '';
        const fecha = new Date(valor);
        const horas = `${formatoDeCeros(fecha.getHours())}:${formatoDeCeros(fecha.getMinutes())}:${formatoDeCeros(fecha.getSeconds())}`;

        if (horas == '00:00:00') {
          fechaFormateada = `${fecha.getFullYear()}-${formatoDeCeros(fecha.getMonth() + 1)}-${formatoDeCeros(fecha.getDate())}`;
        } else {
          fechaFormateada = `${fecha.getFullYear()}-${formatoDeCeros(fecha.getMonth() + 1)}-${formatoDeCeros(fecha.getDate())} ${formatoDeCeros(fecha.getHours())}:${formatoDeCeros(fecha.getMinutes())}:${formatoDeCeros(fecha.getSeconds())}`;
        }

        resultado[clave.toLowerCase()] = fechaFormateada;
      } else {
        // Si no es una fecha, convierte la clave a minúsculas y copia el valor tal como está
        resultado[clave.toLowerCase()] = valor;
      }
    }
  }
  return resultado;
}

function formatoDeCeros(valor) {
  // Agrega un cero delante si el valor es menor que 10
  return valor < 10 ? `0${valor}` : valor;
}

export function defaultClass() {
  return {
    label: `block pl-1 text-sm font-medium text-neutral-900 dark:text-neutral-400`,
    navlink: `block text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700  dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent`,
    input: `bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700/50 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700`,
    readonlyInput: `bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none  focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-neutral-800 dark:border-neutral-700/50 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700`,
    select: `bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700/50 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700`,
    btn: `h-10 font-medium rounded-lg px-4 py-2 text-sm focus:ring focus:outline-none  `,
    btn2: `text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700  `,
    btnSmall: `text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600  `,
    btnSimple: `text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-2 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600  `,
    tablet: `w-full text-sm text-left text-neutral-500 dark:text-neutral-400`,
    thead: `bg-white dark:bg-neutral-800 text-neutral-700  dark:text-neutral-400`,
    th: `px-4 py-3 select-none text-xs text-neutral-700 uppercase dark:text-neutral-400`,
    tr: `border-b border-neutral-200 dark:border-neutral-700`,
    td: `px-4 py-3 select-none`,
    tdclick: `px-4 py-3 select-none cursor-pointer font-semibold hover:text-green-400`,
    trh: `text-md font-semibold`,
    tdh: `px-4 py-2 select-none `,
    tdnumber: `px-4 py-4 text-right`,
    btnPrimary: `bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-700`,
    btnDanger: `bg-red-700 text-white hover:bg-red-800 focus:ring-red-700`,
    btnSuccess: `bg-green-700 text-white hover:bg-green-800 focus:ring-green-700`,
    btnSecondary: `bg-neutral-700 text-white hover:bg-neutral-800 focus:ring-neutral-700`,
    btndark: `bg-white text-neutral-500 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 hover:dark:bg-neutral-700 hover:dark:text-white focus:ring-neutral-100 dark:focus:ring-neutral-700`,
    navactive: `text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500`,
    inactive: `text-neutral-600`,
    btnAtras: `flex items-center ps-2 py-2 pe-4 gap-1 w-fit text-sm focus:outline-none font-medium text-neutral-500 rounded-md hover:text-neutral-600 focus:text-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800/50 border dark:border-neutral-700/50  bg-black/5 hover:bg-black/10 dark:bg-white/5`,
    btnBack: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-gradient-to-r from-neutral-500 to-neutral-600 dark:from-neutral-700 dark:to-neutral-800 shadow-lg shadow-neutral-500/30 hover:shadow-neutral-500/50 dark:shadow-lg dark:shadow-neutral-700/80 border-b border-neutral-400 dark:border-neutral-600 active:translate-y-0.5  transition-all duration-100 scale-95 hover:scale-100 text-center me-2 mb-2`,
    btnSystem: `flex items-center px-3 py-1 gap-1 w-fit text-sm focus:outline-none font-medium text-neutral-500 rounded-md hover:text-neutral-600 focus:text-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800/50 border dark:border-neutral-700/50  bg-black/5 hover:bg-black/10 dark:bg-white/5`,
    btnEmerald: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg shadow-sky-600/40 hover:shadow-sky-600/60 dark:from-sky-600 dark:to-sky-700 active:translate-y-0.5 transition-all duration-100  scale-95 hover:scale-100 dark:shadow-lg dark:shadow-sky-800/80 text-center me-2`,
    btnSky: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg shadow-sky-600/30 hover:shadow-sky-600/50  dark:from-sky-600 dark:to-sky-700 active:translate-y-0.5 transition-all duration-100 active:bg-sky-700 scale-95 hover:scale-100 dark:shadow-lg dark:shadow-sky-800/80 text-center me-2`,
    btnRed: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-600/30 hover:shadow-red-600/50  dark:from-red-600 dark:to-red-700 active:translate-y-0.5 transition-all duration-100 active:bg-red-700 scale-95 hover:scale-100 dark:shadow-lg dark:shadow-red-800/80 text-center me-2`,
    btnNeutral: `flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-neutral-700 dark:text-white bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800 shadow-sms shadow-neutral-400/30 hover:shadow-neutral-400/50 dark:shadow-lg dark:shadow-neutral-700/80 border-b border-neutral-50 dark:border-neutral-700 active:translate-y-0.5  transition-all duration-100 scale-95 hover:scale-100 text-center me-2`,
    form: {
      divModal: `fixed top-0 flex left-0 right-0 z-50 h-screen w-full bg-neutral-900/50 dark:bg-neutral-900/70 p-4 overflow-x-hidden overflow-y-auto md:inset-0 justify-center items-center `,
      btnCloseModal: `text-neutral-400 bg-transparent hover:bg-red-200 hover:text-red-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-red-600 dark:hover:text-white`,
      divPadre: `relative bg-transparent  shadow-none animated fadeIn`,
      modalContainer: `relative w-full max-w-3xl max-h-full bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg`,
      header: `flex flex-col items-start sm:flex-row sm:justify-between sm:items-center pb-4 border-b rounded-t dark:border-neutral-700`,
      grid: `grid grid-cols-12 gap-2 py-6 px-2`,
      gridColumns: `col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`,
      titleContainer: `flex flex-col`,
      title: `text-lg font-medium text-left text-neutral-600 dark:text-white leading-none`,
      subtitle: `mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400 leading-tight`,
      label: `flex items-center gap-1 pl-1 text-sm font-medium text-neutral-500 dark:text-neutral-500`,
      input: `bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700`,
      textarea: `bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700 whitespace-pre-line`,
      inputDisable: `bg-neutral-100 border border-neutral-300 text-neutral-400 text-sm rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-neutral-500 dark:focus:ring-yellow-700 dark:focus:border-yellow-700`,
      select: `bg-white border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-neutral-700/50 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700`,
      headerColumn: `bg-transparent`,
      btn: `h-10 font-medium rounded-lg px-4 py-2 text-sm focus:ring focus:outline-none  `,
      btnSmall: `text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600  `,
      containerButtons: `flex items-center justify-start pt-4 gap-2 border-t border-neutral-200 dark:border-neutral-600`,
      submit: `!m-0 flex capitalize items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg shadow-sky-600/30 hover:shadow-sky-600/50  hover:from-sky-600 hover:to-sky-700 active:translate-y-0.5 transition-all duration-100 active:bg-sky-700 scale-95 hover:scale-100 dark:shadow-lg dark:shadow-sky-800/80 text-center`,
      delete: `!m-0 flex items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-600/30 hover:shadow-red-600/50  hover:from-red-600 hover:to-red-700 active:translate-y-0.5 transition-all duration-100 active:bg-red-700 scale-95 hover:scale-100 dark:shadow-lg dark:shadow-red-800/80 text-center`,
      darkBlue: `bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-700`,
      darkRed: `bg-red-700 text-white hover:bg-red-800 focus:ring-red-700`,
      darkGreen: `bg-green-700 text-white hover:bg-green-800 focus:ring-green-700`,
      darkneutral: `bg-neutral-700 text-white hover:bg-neutral-800 focus:ring-neutral-700`,
      dark: `bg-neutral-300 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 hover:dark:bg-neutral-700 hover:dark:text-white focus:ring-neutral-700`,
      navactive: `text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500`,
      inactive: `text-neutral-600`,
    },
    table: {
      divPadre: `relative bg-transparent overflow-hidden animated fadeIn`,
      tableContainer: `overflow-x-auto rounded-lg border border-neutral-400/30 dark:border-neutral-700/50 `,
      table: `w-full text-sm text-left text-neutral-500 dark:text-neutral-400`,
      header: `flex justify-between items-center w-full bg-transparent mb-6 gap-3`,
      titleContainer: `flex flex-col w-full`,
      buttonsContainer: `flex justify-end items-center`,
      title: `text-lg font-medium text-left text-neutral-600 dark:text-neutral-200 leading-none`,
      subtitle: `mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-300 leading-tight`,
      btnSmall: `text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600  `,
      thead: `bg-neutral-300/30 text-neutral-500 dark:text-neutral-600 border-b border-neutral-300 dark:bg-neutral-900/30 dark:border-neutral-600`,
      tfoot: `bg-transparent dark:bg-neutral-800 text-neutral-700  dark:text-neutral-400`,
      pagination: `flex flex-col sm:flex-row sm:justify-between items-center text-neutral-700 sm:px-4 pt-4 dark:text-neutral-400 `,
      paginationBtn: `bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-700/50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white text-xs`,
      paginationBtnDisable: `bg-neutral-100 text-neutral-400  dark:bg-neutral-800 dark:border-neutral-700/50 dark:text-neutral-600 text-xs`,
      th: `px-4 py-3 select-none text-xs text-neutral-500 uppercase dark:text-neutral-500 whitespace-nowrap`,
      tr: `border-t border-neutral-200 dark:border-neutral-700`,
      trhover: `hover:bg-neutral-200/50 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer`,
      td: `px-4 py-3 select-none whitespace-nowrap`,
      tdclick: `px-4 py-3 select-none cursor-pointer font-semibold hover:text-green-400`,
      trh: `text-md font-semibold whitespace-nowrap`,
      trtitle: `text-md font-semibold`,
      tdh: `px-4 py-2 select-none whitespace-nowrap`,
      tdnumber: `px-4 py-4 text-right`,
      rowNormal: `bg-neutral-50 dark:bg-neutral-800`,
      rowAlternative: `bg-neutral-100 dark:bg-neutral-800/50`,
    }
  }
}

export function prepararSQL(tabla, json, selectID = '') {
  let dataForSave = {};
  let elValor = '';
  let keyPrimary = '';
  let sql = '';
  let where = '';
  let tipoSQL = '';
  let camposIncompletos = '';
  let typeInput = '';
  let respuesta = {};
  let hayKey = false;

  if (tabla && json) {
    // let formValues = Object.values(json).map((field) => field.value);
    // alert(`Valores ingresados: ${formValues.join(", ")}`);
    let comprobation = Object.values(json).filter((field) => {
      if (field.required == true) {
        if (field.value === '' || field.value === null) {
          camposIncompletos += field.placeholder + ', ';
          return field.name;
        }
      }
    });

    if (!comprobation.length) {
      for (const key in json) {
        //console.log(key, json[key].value)
        if (json[key].noData == false) {
          if (json[key].key == 'PRI' || json[key].key == 'pri') {
            typeInput = json[key].type;
            hayKey = true;
            let valueKey = json[key].value;

            if (selectID != null) {
              console.log(selectID, valueKey)
              if (typeInput == 'integer' || typeInput == 'number') {
                if (json[key].value > 0) {
                  elValor = parseFloat(json[key].value);
                } else {
                  elValor = json[key].value;
                }
              } else {
                elValor = `${json[key].value}`;
              }

              if (elValor) {
                dataForSave[key] = elValor;
              }

              valueKey = selectID;

            }



            if (typeInput == 'integer' || typeInput == 'number') {
              where = `${key} = ${valueKey}`;
              keyPrimary = parseInt(valueKey);
            } else {
              where = `${key} = '${valueKey}'`;
              keyPrimary = valueKey;
            }

            tipoSQL = valueKey == 0 ? 'insert' : 'update';
          } else {
            typeInput = json[key].type;
            //console.log(typeInput, json[key].value)
            if (typeInput == 'integer' || typeInput == 'number') {
              if (json[key].value > 0) {
                if (json[key].value > 0) {
                  elValor = parseFloat(json[key].value);
                } else {
                  elValor = json[key].value;
                }
              } else {
                if (json[key].value == 0) {
                  elValor = 0;
                } else {
                  elValor = null;
                }
              }

            } else if (typeInput == 'currency') {
              if (json[key].value !== '') {
                elValor = parseFloat(json[key].value);
              } else {
                if (json[key].value == 0) {
                  elValor = 0;
                } else {
                  elValor = null;
                }
              }
            } else if (typeInput == 'select') {
              if (json[key].value !== '') {
                elValor = json[key].value;
              } else {
                elValor = '';
              }
            } else if (typeInput == 'datetime-local' || typeInput == 'date') {
              if (json[key].value !== '') {
                elValor = json[key].value;
              } else {
                elValor = null;
              }
            } else {
              elValor = `${json[key].value}`;
            }
            dataForSave[key] = elValor;
          }
        }
      }

      //console.log('Primer Paso',dataForSave);
      informe.primero = dataForSave;
      sql = createQuerySQL(tipoSQL, {
        t: tabla,
        w: where,
        d: dataForSave
      });

      //console.log('Segundo Paso', sql);
      informe.segundo = sql
      respuesta = {
        status: 1,
        tipo: tipoSQL,
        keyPrimary: keyPrimary,
        sql: sql,
        camposIncompletos: camposIncompletos
      };
    } else {
      respuesta = {
        status: 0,
        tipo: '',
        keyPrimary: keyPrimary,
        sql: '',
        camposIncompletos: camposIncompletos
      };
    }
  }
  return respuesta;
}

export async function dbSelect(type, sql) {
  let datos = {
    tipo: type.charAt(0),
    tsql: codeTSQL(sql)
  };

  try {
    let resp;
    if (TYPE_SERVER == 'php') {
      resp = await fetch(`${SERVER}/tsql.php`, {
        method: 'POST',
        body: JSON.stringify({
          data: datos
        })
      });
    } else {
      resp = await fetch(`${SERVER}/tsql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: datos
        })
      });
    }

    const result = await resp.json();

    const newResult = result.map((obj) => {
      // return convertirClavesAMinusculas(obj)
      return convertirClavesAMinusculasYFormatoFecha(obj)
    })


    return newResult;

  } catch (error) {
    console.log(error)
    console.log(informe)
    console.log(datos)
    const err = [{ resp: 'error', msgError: 'Error en la conexión a la base de datos.' }];
    return err;
  }
}

export async function login(user, password) {
  let datos = {
    user, password
  };

  try {
    let resp;
    if (TYPE_SERVER == 'php') {
      resp = await fetch(`${SERVER}/login.php`, {
        method: 'POST',
        body: JSON.stringify({
          data: datos
        })
      });
    } else {
      resp = await fetch(`${SERVER}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: datos
        })
      });
    }

    const result = await resp.json();
    return result;
  } catch (error) {
    const err = [{ resp: 'error', msgError: 'Error al consultar datos!' }];
    return err;
  }
}

export async function structure(type, name) {
  let datos = {
    type,
    name
  };

  try {
    let resp;
    if (TYPE_SERVER == 'php') {
      resp = await fetch(`${SERVER}/structure.php`, {
        method: 'POST',
        body: JSON.stringify({
          data: datos
        })
      });
    } else {
      resp = await fetch(`${SERVER}/struc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: datos
        })
      });
    }

    const result = await resp.json();
    return result;
  } catch (error) {
    const err = [{ resp: 'error', msgError: 'Error al consultar datos!' }];
    return err;
  }
}

export async function runCode(input) {
  let opcion = '';
  let data = '';
  const codwords = ['-sl', '-st', '-in', '-up', '-dl'];

  const lista = [
    { str: 'select', cod: '-sl' },
    { str: 'select * from', cod: '-st' },
    { str: '*', cod: '-kk' },
    { str: 'from', cod: '-fr' },
    { str: 'join', cod: '-jn' },
    { str: 'inner join', cod: '-ij' },
    { str: 'left join', cod: '-il' },
    { str: 'right join', cod: '-ir' },
    { str: 'left', cod: '-lf' },
    { str: 'right', cod: '-rg' },
    { str: 'update', cod: '-up' },
    { str: 'delete', cod: '-dl' },
    { str: 'delete from', cod: '-df' },
    { str: 'insert into', cod: '-in' },
    { str: 'values', cod: '-va' },
    { str: 'set', cod: '-se' },
    { str: 'where', cod: '-wr' },
    { str: 'as', cod: '->' },
    { str: 'or', cod: '|' },
    { str: 'and', cod: '&' },
    { str: 'order by', cod: '-ob' },
    { str: 'order', cod: '-od' },
    { str: 'by', cod: '-yy' },
    { str: 'desc', cod: '-ds' },
    { str: 'asc', cod: '-as' },
    { str: '<', cod: '-me' },
    { str: '>', cod: '-ma' },
    { str: '<>', cod: '-mm' },
    { str: 'group by', cod: '-gb' },
    { str: 'group', cod: '-gr' },
    { str: 'having', cod: '-hv' },
    { str: 'limit', cod: '-lt' },
    { str: 'like', cod: '-lk' },
    { str: ' ', cod: '-__' }
  ];

  let inicharter = input.toLowerCase();

  for (let keyword of codwords) {
    if (inicharter.startsWith(keyword)) {
      lista.forEach(val => {
        if (val.cod == keyword) {
          opcion = val.str;
        }
      })
    }
  }

  for (let item of lista) {
    let code = item.cod;
    let str = item.str;
    input = input.split(code).join(str);
  }

  input = input.replace(/\s+-/g, '-').replace(/-\s+/g, '-');

  if (opcion) {
    data = await dbSelect(opcion, input);
    return data;
  } else {
    console.error('No se reconoce la estructura!')
    return [{ resp: 'error', msgError: 'No se reconoce la estructura!' }]
  }

}

export function nameServer() {
  return `${TYPE_SERVER} - ${SERVER}`
}

export function formatNumberArray(str, dec = 2) {
  if (!str) {
    str = '0.00t';
  } else {
    str = str + 't';
  }

  let negativo = str.startsWith('-', 0);
  let numero = str.replace(/[^0-9.,]/g, '');
  let arrayNumero = numero.replace(/[.,]/g, ',').split(',');
  let ultimoValor = arrayNumero.length - 1;
  let numeroReal = numero;
  let numeroFinal = '';
  let resultado = [];
  let parteEntera = '';
  let parteDecimal = '';



  arrayNumero.forEach((parte, index) => {
    if (index == ultimoValor) {
      numeroFinal += `${parte}`;
      parteDecimal += `${parte}`;
    } else if (index == ultimoValor - 1) {
      numeroFinal += `${parte}.`;
      parteEntera += `${parte}`;
    } else {
      numeroFinal += `${parte}`;
      parteEntera += `${parte}`;
    }
  });


  if (dec > 0) {
    numeroFinal = parseFloat(numeroFinal).toFixed(dec);
  } else {
    numeroFinal = `${Math.round(parseFloat(numeroFinal))}`;
  }

  if (negativo) {
    numeroFinal = `-${numeroFinal}`;
    numeroReal = `-${numero}`;
  }

  if (numeroFinal == 'NaN') numeroFinal = '0';

  resultado[0] = numeroFinal;
  resultado[1] = new Intl.NumberFormat('en-EN', { minimumFractionDigits: dec }).format(
    parseFloat(numeroFinal)
  );
  resultado[2] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: dec }).format(
    parseFloat(numeroFinal)
  );

  if (arrayNumero.length > 1) {
    resultado[3] = parteEntera;
    resultado[4] = parteDecimal;
  } else {
    resultado[3] = parteDecimal;
    resultado[4] = '';
  }
  resultado[5] = numeroReal;


  return resultado;
}

export function formatNumber(str, options = { dec: 2, leng: 'es', symb: '', type: 'number' }) {
  if (!str) {
    str = '0.00t';
  } else {
    str = str + 't';
  }

  if (!options.dec) options.dec = 2;
  if (!options.leng) options.leng = 'es';
  if (!options.symb) options.symb = '';
  if (!options.cero) options.cero = '';
  if (!options.type) options.type = 'currency';

  let negativo = str.startsWith('-', 0);
  let numero = str.replace(/[^0-9.,]/g, '');
  let xNumero = numero.replace(/[.,]/g, ',').split(',');
  let ultimoValor = xNumero.length - 1;
  let numeroReal = numero;
  let numeroFinal = '';
  let resultado = [];
  let parteEntera = '';
  let parteDecimal = '';

  xNumero.forEach((parte, index) => {
    if (index == ultimoValor) {
      numeroFinal += `${parte}`;
      parteDecimal += `${parte}`;
    } else if (index == ultimoValor - 1) {
      numeroFinal += `${parte}.`;
      parteEntera += `${parte}`;
    } else {
      numeroFinal += `${parte}`;
      parteEntera += `${parte}`;
    }
  });

  if (numeroFinal == 'NaN') numeroFinal = '0';
  if (numeroReal == 'NaN') numeroReal = '';

  if (options.dec > 0) {
    numeroFinal = parseFloat(numeroFinal).toFixed(options.dec);
  } else {
    numeroFinal = `${Math.round(parseFloat(numeroFinal))}`;
  }

  if (options.leng == 'en') {
    resultado = numeroFinal;
  } else {
    resultado = new Intl.NumberFormat('de-DE', { minimumFractionDigits: options.dec }).format(
      parseFloat(numeroFinal)
    );
  }

  if (options.cero != '') {
    if (resultado == '0,00' || resultado == '0.00' || resultado == '0') {
      resultado = options.cero;
    }
  }

  if (options.symb != '') {
    resultado = `${options.symb} ${resultado}`;
  }

  if (negativo) {
    resultado = `-${resultado}`
    numeroReal = `-${numero}`;
  }

  if (options.type == 'currency') {
    return resultado;
  } else if (options.type == 'number') {
    return numeroReal;
  } else if (options.type == 'integer') {
    return parteEntera;
  } else if (options.type == 'decimal') {
    return parteDecimal;
  } else {
    return numeroReal;
  }


}

export function formatDate(valor = null, separador = '-') {
  let myDate;
  let sep = separador || '-';
  if (valor == null) {
    valor = new Date();
    myDate = valor;
  }

  let exp = /^\d{2,4}\-\d{1,2}\-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}$/gm;
  let exp2 = /^\d{2,4}\-\d{1,2}\-\d{1,2}$/gm;
  const arrayDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const arrayDia = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const arrayMeses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  const arrayMes = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
  ];

  if (typeof valor == 'string') {
    if (valor.match(exp)) {
      myDate = new Date(valor);
    } else if (valor.match(exp2)) {
      myDate = new Date(`${valor} 00:00:00`);
    } else {
      return 'El valor es incorrecto';
    }
  }



  if (typeof valor == 'object') {
    myDate = valor;
  }

  if (typeof valor !== 'string' && typeof valor !== 'object') {
    return 'parametro incorrecto';
  }

  let anio = myDate.getFullYear();
  let mes = myDate.getMonth() + 1;
  let dia = myDate.getDate();
  let dsem = myDate.getDay();
  let hora = myDate.getHours();
  let minutos = myDate.getMinutes();
  let segundos = myDate.getSeconds();

  mes = mes < 10 ? '0' + mes : mes;
  dia = dia < 10 ? '0' + dia : dia;
  hora = hora < 10 ? '0' + hora : hora;
  minutos = minutos < 10 ? '0' + minutos : minutos;
  segundos = segundos < 10 ? '0' + segundos : segundos;

  let myObject = {
    fecha: '' + anio + '-' + mes + '-' + dia,
    fechaEs: '' + dia + sep + mes + sep + anio,
    anio: anio,
    mes: mes,
    mesCorto: arrayMes[myDate.getMonth()],
    mesLargo: arrayMeses[myDate.getMonth()],
    dia: dia,
    diaSem: dsem,
    anioMes: anio + sep + mes,
    mesDia: mes + sep + dia,
    mesAnio: arrayMeses[myDate.getMonth()] + sep + anio,
    diaCorto: arrayDia[dsem],
    diaLargo: arrayDias[dsem],
    fechaCarta: arrayDias[dsem] + ' ' + myDate.getDate() + ' de ' + arrayMeses[myDate.getMonth()] + ' de ' + anio,
    fechaHoraCarta: arrayDias[dsem] + ' ' + myDate.getDate() + ' de ' + arrayMeses[myDate.getMonth()] + ' de ' + anio + ' ' + hora + ':' +
      minutos,
    fechaTonic:
      '' + myDate.getDate() + sep + arrayMes[myDate.getMonth()] + sep + anio,
    fechaHoraEs:
      '' +
      dia +
      sep +
      mes +
      sep +
      anio +
      ' ' +
      hora +
      ':' +
      minutos +
      ':' +
      segundos,
    fechaHora:
      '' +
      anio +
      '-' +
      mes +
      '-' +
      dia +
      ' ' +
      hora +
      ':' +
      minutos +
      ':' +
      segundos,
    fechaHoraT: '' + anio + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos,
    horaLarga: hora + ':' + minutos + ':' + segundos,
    horaCorta: hora + ':' + minutos,
    hora: hora,
    minutos: minutos,
    segundos: segundos,
    serial: '' + (anio - 2000) + '' + mes + '' + dia
  };

  return myObject;
}

export async function initKeyData(table, key, value) {
  let objData = {};
  let momo = await runCode(`-st ${table}`).then(data => {
    data.forEach(row => {
      objData[row[key]] = row[value];
    })
    return objData;
  })
  return momo
}

export function pesos(numero, decimales, signo = '$') {
  let numeroString = formatNumber(numero, { dec: decimales, symb: signo, type: 'currency', cero: '-' })
  return `${numeroString}`;
}

export function currency(numero) {
  let numeroString = formatNumber(numero, { dec: 2, type: 'currency', cero: '-' })
  return `${numeroString}`;
}

export function numberEn(numero) {
  let numeroString = formatNumber(numero, { dec: 2, leng: 'en', type: 'currency', cero: '-' })
  return `${numeroString}`;
}

export function padLeft(str, length = 4, character = '0') {
  while (str.length < length) {
    str = character + str;
  }
  return str;
}

export function padRight(str, length = 4, character = '0') {
  while (str.length < length) {
    str = str + character;
  }
  return str;
}


export class Tamnora {
  constructor(config = {}) {
    this.data = this.createReactiveProxy(config.data);
    this._componentHTML = config.componentHTML || {};
    this.defaultData = {};
    this.colorPrimary = 'neutral';
    this.class = config.styleClasses || defaultClass();
    this.templates = {};
    this.form = {};
    this.table = {};
    this.theme = '';
    this.themeColorDark = '#262626';
    this.themeColorLight = '#f5f5f5';
    this.componentDirectory = config.componentDirectory || '../components';
    this.state = this.loadStateFromLocalStorage();
    this.onMountCallback = null;
    this.initialize();
    this.darkMode(config.darkMode ?? true);

    // Agregar código de manejo de navegación en la carga de la página
    this.handleNavigationOnLoad();

    this.functions = {
      openSelect: (name) => {
        const self = this;
        document.getElementById(`${name}_options`).classList.toggle('hidden');
        document.getElementById(`${name}_cerrado`).classList.toggle('hidden');
        document.getElementById(`${name}_abierto`).classList.toggle('hidden');

        document.querySelectorAll(`#${name}_options li`).forEach(function (li) {
          li.addEventListener('click', function (e) {
            self.data[`${name}_selected`] = e.target.innerText;
          });
        });

      }
    };


    // Escuchar el evento de cambio de historial
    window.addEventListener('popstate', () => {
      this.handleNavigation();
    });

  }

  newForm(name) {
    this.form[name] = new DataObject(name, this); // Pasando una referencia a Tamnora
    return this.form[name];
  }

  newTable(name) {
    this.table[name] = new DataArray(name, this); // Pasando una referencia a Tamnora
    return this.table[name];
  }

  getClass(name) {
    return this.class[name];
  }

  setClass(name, groupClass) {
    this.class[name] = groupClass
  }

  getClassAll() {
    return this.class;
  }

  getComponentHTML(name) {
    if (name) {
      return this._componentHTML[name];
    } else {
      return this._componentHTML;

    }
  }

  setComponentHTML(name, html) {
    if (name && html) {
      this._componentHTML[name] = html;
      this.bindComponents();
    } else {
      console.error('Error en componente')
    }
  }

  // Inicializa la librería y realiza las vinculaciones necesarias
  initialize() {
    this.bindElementsWithDataValues();
    this.bindClickEvents();
    this.bindComponents();
    this.applyStyleClassesNavActive()
    this.bindSubmitEvents();
    this.bindChangeEvents();
    this.darkMode(true);
    this.listenerMessage();
  }

  //Crea un Proxy reactivo para los datos
  createReactiveProxy(data) {
    const recursiveHandler = {
      get: (target, prop) => {
        const value = target[prop];
        if (typeof value === 'object' && value !== null) {
          return new Proxy(value, recursiveHandler); // Crear un nuevo Proxy para los objetos anidados
        }
        return value;
      },
      set: (target, prop, value) => {
        target[prop] = value;
        this.updateElementsWithDataValue(prop, value); // Actualizar elementos del DOM al cambiar el valor
        return true;
      },
    };

    if (!data) {
      data = {};
    }

    return new Proxy(data, recursiveHandler);
  }



  getValue(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }
    return valorActual;
  }

  getValueFormat(camino, format) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
        if (format == 'pesos') {
          valorActual = formatNumber(valorActual, { symb: '$', type: 'currency' })
        }
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }
    return valorActual;
  }

  existValue(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.data;
    let existe = false;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        existe = true;
      }
    }
    return existe;
  }

  getDefaultData(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.defaultData;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }

    return valorActual;
  }

  setValue(name, datos, menos) {
    if (typeof datos == 'object') {
      if (menos) {
        Object.keys(datos).forEach((key) => {
          const value = datos[key];
          if (key != menos) {
            this.data[name][key] = value;
          }
        });
      } else {
        this.data[name] = datos;
      }

      Object.keys(this.data[name]).forEach((key) => {
        const value = datos[key];
        this.updateElementsWithDataValue(`${name}!${key}`, value);
      });
    } else {
      this.data[name] = datos;
      this.updateElementsWithDataValue(`${name}`, datos);
    }
  }

  setValueRoute(camino, nuevoValor) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let i = 0; i < propiedades.length - 1; i++) {
      const propiedad = propiedades[i];
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return; // No podemos acceder al camino completo, salimos sin hacer cambios
      }
    }

    const propiedadFinal = propiedades[propiedades.length - 1];
    valorActual[propiedadFinal] = nuevoValor;
    this.updateElementsWithDataValue(camino, nuevoValor);
  }

  setDefaultData(camino, nuevoValor) {
    const propiedades = camino.split('!');
    let valorActual = this.defaultData;

    for (let i = 0; i < propiedades.length - 1; i++) {
      const propiedad = propiedades[i];

      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return; // No podemos acceder al camino completo, salimos sin hacer cambios
      }
    }

    const propiedadFinal = propiedades[propiedades.length - 1];
    valorActual[propiedadFinal] = nuevoValor;
  }

  pushValue(name, obj, format = false) {
    const newdata = this.data[obj];
    this.data[name].push(newdata);
    if (this.defaultData[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.defaultData[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)

    }
  }

  cleanValue(obj, format = false) {
    if (this.defaultData[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.defaultData[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)

    } else {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            this.data[obj][key] = "";
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)
    }
  }

  getFunction() {
    console.log(this.functions);
  }

  setFunction(name, fn) {
    this.functions[name] = fn
  }

  applyStyles(element, classes) {
    element.className = classes.input;
    const labelElement = element.parentElement.querySelector('label');
    const messageElement = element.parentElement.querySelector('.mt-2');

    if (labelElement) {
      labelElement.className = classes.label;
    }

    if (messageElement) {
      messageElement.className = classes.message;
      const messageSpan = messageElement.querySelector('span');
      if (messageSpan) {
        messageSpan.className = classes.messageText;
        messageSpan.textContent = classes.messageContent;
      }
    }
  }



  createInputSearch(id, config, callback) {
    const container = document.getElementById(id);
    const idInput = `inputSearch_${id}`;
    const arrayObject = config.arrayObject;
    const buscarEnKey = config.buscarEnKey;
    const name = config.name ?? '';
    const placeholder = config.placeholder ?? '...';
    const sarta = config.sarta ?? false;



    if (!container) {
      console.error(`El elemento con id ${id} no fue encontrado.`);
      return;
    }

    const successClasses = {
      label: 'block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-500',
      input: 'bg-white border border-neutral-300 text-sky-900 text-sm rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-sky-800 dark:border-neutral-700/50 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-sky-700 dark:focus:border-sky-700 font-semibold',
      message: 'mt-2 text-sm text-green-600 dark:text-green-500',
      messageText: 'font-medium',
      messageContent: ''
    };

    const errorClasses = {
      label: 'block mb-2 text-sm font-medium text-red-600 dark:text-red-500',
      input: 'bg-white border border-neutral-300 text-red-900 text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-800 dark:border-neutral-700/50 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-red-700 dark:focus:border-red-700 font-semibold',
      message: 'mt-2 text-sm text-red-600 dark:text-red-500',
      messageText: 'font-medium',
      messageContent: 'Error, valor no encontrado!'
    };

    const inputHtml = `
      <div class="mb-6">
        <label for="normal" class="block mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-500">${name}</label>
        <input type="text" id="${idInput}" class="${this.class.form.input}" autocomplete="false" placeholder="${placeholder}">
        <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-500"><span class="font-medium"></span></p>
      </div>`;

    container.innerHTML = inputHtml;

    const inputElement = container.querySelector('input');

    if (inputElement) {
      inputElement.addEventListener('change', (event) => {
        const searchTerm = event.target.value.toLowerCase();

        const objEncontrado = arrayObject.find(obj => {
          const valueToSearch = obj[buscarEnKey];
          if (searchTerm) {
            if (sarta) {
              return (valueToSearch && typeof valueToSearch === 'string' && valueToSearch.toLowerCase().includes(searchTerm));
            } else {
              return (valueToSearch && typeof valueToSearch === 'string' && valueToSearch.toLowerCase() == searchTerm);
            }
          }
        });

        if (objEncontrado) {
          this.applyStyles(inputElement, successClasses);
          callback(objEncontrado, true);
          inputElement.value = objEncontrado[buscarEnKey];
        } else {
          this.applyStyles(inputElement, errorClasses);
          callback(objEncontrado, false);
        }
      });
    } else {
      console.error('No se pudo encontrar el elemento input en la estructura HTML.');
    }
  }




  async createSearchInput(nameIdElement, table, id, name, where = '', titleId = 'ID:', titleName = 'Buscar:') {
    const searchName = `${nameIdElement}_searchName`;
    const containerSearchName = `${nameIdElement}_conten_search`;
    const searchInput = `${nameIdElement}_searchInput`;
    const sugerencia = `${nameIdElement}_sugerencia`;
    const error = `${nameIdElement}_error`;
    const cant = `${nameIdElement}_cant`;
    const data = `tmn${nameIdElement}`;
    const eleComponent = document.querySelector(`#${nameIdElement}`)
    let wr = ''

    if (where) {
      wr = ` -wr ${where}`
    }

    const sqlt = `-sl ${id} as id, ${name} as name -fr ${table} ${wr} -ob ${name}`;
    const records = await runCode(sqlt);
    this.setValue(data, records)
    this.setValue(nameIdElement, { id: 0, name: '' })


    let salidaHTML = `
        <div class="relative flex flex-col md:flex-row w-full text-sm text-neutral-900 bg-white rounded-lg border border-neutral-200  dark:bg-neutral-800 dark:border-neutral-700/50 dark:text-white    animated fadeIn">
          <div id="${containerSearchName}" class="flex grow p-2.5  z-20 justify-start border-b dark:border-neutral-500 md:border-none cursor-pointer">
            <span class="text-neutral-600 dark:text-neutral-400 border-none outline-none mr-2">${titleName}</span>
            <span id="${searchName}" spellcheck="false"  class="font-semibold text-sky-700  dark:text-sky-500 border-none outline-none uppercase" contenteditable="true"></span>
            <span id="${sugerencia}" class=" text-neutral-400  dark:text-neutral-500 "></span>
            <span id="${error}" class="ml-2 text-red-400 font-bold dark:text-red-400 "></span>
            <span id="${cant}" class="ml-2 text-neutral-400  dark:text-neutral-500 "></span>
          </div>
          <div class="flex">
            <div class="block p-2.5 w-fit z-20 text-md text-right text-neutral-900  focus:outline-none  border-none border-neutral-300 focus:ring-sky-500 focus:border-sky-500  dark:border-l-neutral-700  dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:border-sky-500">
              <span class="text-neutral-700 dark:text-neutral-400  border-none outline-none">${titleId}</span>
            </div>
            <input type="search" id="${searchInput}"  class="block p-2.5 w-20 max-w-fit z-20 text-sm text-left font-semibold text-sky-700  focus:outline-none rounded-r-lg bg-white dark:bg-neutral-800 border-none border-neutral-300 focus:ring-sky-500 focus:border-sky-500  dark:border-l-neutral-700  dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-sky-500 dark:focus:border-sky-500 cursor-pointer" placeholder="..." >
          </div>
        </div>
    `;

    eleComponent.innerHTML = await salidaHTML;


    const eleSearchName = document.querySelector(`#${searchName}`)
    const eleContain = document.querySelector(`#${containerSearchName}`)
    const eleSearchInput = document.querySelector(`#${searchInput}`)
    const eleSugerencia = document.querySelector(`#${sugerencia}`)
    const eleError = document.querySelector(`#${error}`)
    const eleCant = document.querySelector(`#${cant}`)



    eleSearchInput.addEventListener('change', (elem) => {
      let value = elem.target.value;
      let result = '';
      if (value.length > 0) {
        const matchingClient = this.getValue(data).find((v) => {
          return (v.id == value)
        });

        if (matchingClient) {
          result = matchingClient.name;
          eleSearchName.innerHTML = result;
          eleSugerencia.innerHTML = '';
          eleError.innerHTML = '';
          this.setValue(nameIdElement, { id: value, name: result })
        } else {
          eleSearchName.innerHTML = '';
          eleSugerencia.innerHTML = `${result}`;
          eleError.innerHTML = ' -> El ID no existe!';
          this.setValue(nameIdElement, { id: 0, name: '' })
        }
      } else {
        eleSearchName.innerHTML = '';
        eleSugerencia.innerHTML = '';
        eleError.innerHTML = ' - No hay valor!';
        this.setValue(nameIdElement, { id: 0, name: '' })
      }
      if (this.functions[`${nameIdElement}Result`]) {
        let resultData = this.getValue(nameIdElement);
        this.functions[`${nameIdElement}Result`](resultData);
      } else {
        console.error(`la funcion ${nameIdElement}Result no existe en tamnora!`);
      }
      //console.log(this.getValue(nameIdElement))
    })


    eleContain.addEventListener('click', () => {
      eleSearchName.focus();
    })

    eleSearchName.addEventListener('input', (e) => {
      e.preventDefault();
      let value = e.target.innerText.toLowerCase();
      value = value.replace(/\s+/g, '_');
      let result = '';

      if (value.length > 0) {
        const matchingClient = this.getValue(data).find((v) => {
          let compara = v.name.replace(/\s+/g, '_');
          return (compara.toLowerCase().startsWith(value))
        }
        );

        if (matchingClient) {
          result = matchingClient.name.substring(value.length);
          result = result.replace(/\s+/g, '&nbsp;');
          eleSugerencia.innerHTML = result;
          eleError.innerHTML = '';

        } else {
          eleSugerencia.innerHTML = result;
          eleError.innerHTML = ' - No encontrado!';
        }
      } else {
        eleSugerencia.innerHTML = result;
        eleError.innerHTML = '';
      }
    })


    eleSearchName.addEventListener('keydown', (event) => {
      if ([13, 39, 9].includes(event.keyCode)) {
        event.preventDefault();

        let value = event.target.innerText.toLowerCase();
        value = value.replace(/\s+/g, '_');
        let result;
        let resId, resName;
        let index = this.getValue('itab');

        if (value.length > 0) {
          const matchingClient = this.getValue(data).filter(v => {
            let compara = v.name.replace(/\s+/g, '_');
            return (compara.toLowerCase().startsWith(value))
          });


          if (matchingClient) {
            if (event.keyCode == 9) {
              if (index < matchingClient.length - 1) {
                index++
                this.setValue('itab', index);
              } else {
                index = 0;
                this.setValue('itab', index);
              }
              //console.log(matchingClient.length)
              result = matchingClient[index].name.substring(value.length);
              result = result.replace(/\s+/g, '&nbsp;');
              eleSugerencia.innerHTML = result;
              eleError.innerHTML = '';
              eleCant.innerHTML = `(${index + 1} de ${matchingClient.length})`;

            } else {
              if (matchingClient.length > 0) {
                //console.log(matchingClient, index)
                resId = matchingClient[index].id;
                resName = matchingClient[index].name;


                eleSearchName.innerHTML = resName;
                eleSearchInput.value = resId;
                eleSugerencia.innerHTML = '';
                eleError.innerHTML = '';
                eleCant.innerHTML = '';
                eleSearchName.focus()
                this.setCaretToEnd(eleSearchName)
                this.setValue(nameIdElement, { id: resId, name: resName })
                // verSimpleForm();
              } else {
                console.error('No hay coincidencias');
                resId = 0;
                eleSearchName.innerHTML = resName;
                eleSearchInput.value = resId;
                eleSugerencia.innerHTML = '';
                eleError.innerHTML = '? No existe!';
                eleCant.innerHTML = '';
                eleSearchName.focus();
                this.setCaretToEnd(eleSearchName);

                this.setValue(nameIdElement, { id: 0, name: '' })
                // verSaldosAcumulados();
                // verSimpleForm();
              }

              if (this.functions[`${nameIdElement}Result`]) {
                let resultData = this.getValue(nameIdElement);
                this.functions[`${nameIdElement}Result`](resultData);
              } else {
                console.error(`la funcion ${nameIdElement}Result no existe en tamnora!`);
              }
            }
          }
        } else {
          eleSugerencia.innerHTML = '';
          eleError.innerHTML = '';
          eleCant.innerHTML = '';
          this.setValue(nameIdElement, { id: 0, name: '' })
        }

        //console.log(this.getValue(nameIdElement));
      }
    })



  }

  updateElementsWithDataValue(dataKey, value) {
    const elementsWithDataValue = document.querySelectorAll(`[data-value="${dataKey}"]`);
    elementsWithDataValue.forEach((element) => {
      if (dataKey.includes('!')) {
        const [dataObj, dataProp] = dataKey.split('!');
        if (!this.data[dataObj]) {
          this.data[dataObj] = {};
        }
        if (!this.data[dataObj][dataProp]) {
          this.data[dataObj][dataProp] = value;
        }

        if (element.type === 'checkbox') {
          element.checked = value ?? false;
        } else if (element.tagName === 'SELECT') {
          element.value = value ?? '';
        } else if (element.tagName === 'INPUT') {
          element.value = value ?? '';
        } else if (element.tagName === 'TEXTAREA') {
          element.textContent = value ?? ''; // Establecer el contenido del textarea
        } else {
          element.textContent = value ?? '';
        }
      } else {
        if (element.tagName === 'INPUT' && element.type !== 'checkbox') {
          element.value = value ?? '';
        } else if (element.tagName === 'SELECT') {
          element.value = value ?? '';
        } else if (element.type === 'checkbox') {
          element.checked = value ?? false;
        } else if (element.tagName === 'TEXTAREA') {
          element.textContent = value ?? ''; // Establecer el contenido del textarea
        } else {
          element.textContent = value;
        }
      }
    });
  }


  // Vincula los eventos click definidos en atributos data-click a functions
  bindClickEvents(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-click]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-click]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-click');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  bindToggleEvents(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-dropdown-toggle]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-dropdown-toggle]');
    }

    elementsWithClick.forEach((element) => {
      const toggleData = element.getAttribute('data-dropdown-toggle');

      element.addEventListener('click', () => {
        document.querySelector(`#${toggleData}`).classList.toggle('hidden')
      });

    });
  }

  bindChangeEvents(componentDiv) {
    let elementsWithChange;
    let elementsWithOnChange;
    if (componentDiv) {
      elementsWithChange = componentDiv.querySelectorAll('[data-change]');
    } else {
      elementsWithChange = document.querySelectorAll('[data-change]');
    }

    elementsWithChange.forEach((element) => {
      const clickData = element.getAttribute('data-change');
      const [functionName, ...params] = clickData.split(',');
      if (functionName == 'currency') {
        element.addEventListener('change', (e) => { this.currency(e.target.value, e) });
      } else {
        if (params) {
          element.addEventListener('change', () => this.executeFunctionByName(functionName, params));
        } else {
          element.addEventListener('change', () => this.executeFunctionByName(functionName));
        }
      }
    });

    if (componentDiv) {
      elementsWithOnChange = componentDiv.querySelectorAll('[data-onchange]');
    } else {
      elementsWithOnChange = document.querySelectorAll('[data-onchange]');
    }

    elementsWithOnChange.forEach((element) => {
      const clickData = element.getAttribute('data-change');
      const [functionName, ...params] = clickData.split(',');

      if (params) {
        element.addEventListener('change', (e) => this.executeFunctionByName(functionName, e, params));
      } else {
        element.addEventListener('change', (e) => this.executeFunctionByName(functionName, e));
      }

    });
  }

  async bindComponents() {
    // Obtener todos los elementos del DOM
    const allElements = document.getElementsByTagName('*');

    // Filtrar los elementos cuyos nombres de etiqueta comiencen con "t-"
    const componentDivs = [];
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      if (element.tagName.toLowerCase().startsWith('t-')) {
        componentDivs.push(element);
      }
    }


    const cantComponents = componentDivs.length;
    if (cantComponents) {
      componentDivs.forEach(async (componentDiv, index) => {
        const tagName = componentDiv.tagName.toLowerCase();
        const component = tagName.substring(2); // Eliminar "t-" del nombre
        const componentName = component.charAt(0).toUpperCase() + component.slice(1);
        const objSlots = {};
        const setSlots = componentDiv.querySelectorAll('[set-slot]');

        await fetch(`${this.componentDirectory}/${componentName}.html`)
          .then((response) => response.text())
          .then((html) => {
            this._componentHTML[componentName] = html;
          })
          .catch((error) => console.error(`Error al cargar el componente ${componentName}:`, error));

        if (setSlots) {
          setSlots.forEach(slot => {
            const nameSlot = slot.getAttribute('set-slot')
            objSlots[nameSlot] = slot.innerHTML;
          })
        }

        if (this._componentHTML[componentName] !== 'undefined') {
          componentDiv.innerHTML = this._componentHTML[componentName];
          const getSlots = componentDiv.querySelectorAll('[get-slot]')
          if (getSlots) {
            getSlots.forEach(slot => {
              const nameSlot = slot.getAttribute('get-slot')
              if (objSlots[nameSlot]) {
                slot.innerHTML = objSlots[nameSlot];
              } else {
                slot.innerHTML = '<span class="text-red-500">set-slot ?</span>'
              }
            })
          }

        } else {
          console.error(`Error al cargar el componente ${componentName}:`)
        }




        this.applyDataPropsFromAttributes(componentDiv);

        // Aquí invocamos las functions solo para el componente actual
        this.bindElementsWithDataValues(componentDiv);
        this.bindClickEvents(componentDiv);
        this.bindSubmitEvents(componentDiv);
        this.applyStyleClasses(componentDiv);
        this.applyStyleClassesNavActive(componentDiv);

        // Nuevo: Vincular eventos de clic dentro del componente Navbar
        const navbarItems = componentDiv.querySelectorAll('[data-navactive]');
        navbarItems.forEach((item) => {
          item.addEventListener('click', () => {
            const navactive = item.getAttribute('data-navactive');
            this.setState('navactive', parseInt(navactive, 10));
          });
        });

        if ((cantComponents - 1) == index) {
          // Ejecutamos la función onMount cuando el DOM esté cargado
          this.bindDataFor();
          this.applyStyleClasses();
          this.applyStyleClassesNavActive();
          this.onDOMContentLoaded();
          this.blidToggleThemeButton()
        }
      });
    } else {
      // Ejecutamos la función onMount cuando el DOM esté cargado
      document.addEventListener('DOMContentLoaded', () => {
        this.bindDataFor();
        this.applyStyleClasses();
        this.applyStyleClassesNavActive();
        this.onDOMContentLoaded();
        this.blidToggleThemeButton()
      });

    }
  }

  // Aplica los datos pasados mediante set-empresa, set-otroDato, etc. a los elementos con atributo get-empresa, get-otroDato, etc. dentro del componente.
  applyDataPropsFromAttributes(componentDiv) {
    const dataProps = {};
    const groupGet = [];
    const attributes = componentDiv.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      if (attr.name.startsWith('set-')) {
        const propName = attr.name.replace('set-', '');
        groupGet.push(propName);
        dataProps[propName] = attr.value;
      }
    }
    if (groupGet) {
      groupGet.forEach(propName => {
        const elementsWithDataProp = componentDiv.querySelectorAll(`[get-${propName}]`); // Agrega aquí otros selectores si necesitas más atributos get-

        elementsWithDataProp.forEach((element) => {
          if (element) {
            element.textContent += dataProps[propName];
          }
        });
      })
    }
  }

  //Aplica las clases de estilo a los elementos con atributos data-tail, pero solo dentro del componente
  applyStyleClasses(componentDiv) {
    let elementsWithTail;
    if (componentDiv) {
      elementsWithTail = componentDiv.querySelectorAll('[data-tail]');
    } else {
      elementsWithTail = document.querySelectorAll('[data-tail]');
    }
    elementsWithTail.forEach((element) => {
      const classes = element.getAttribute('data-tail').split(' ');
      classes.forEach((cls) => {
        if (this.class[cls]) {
          const arrayClases = this.class[cls].split(/\s+/).filter(Boolean)
          arrayClases.forEach((styleClass) => {
            element.classList.add(styleClass);
          });
        }
      });
    });
  }

  //Aplica las clases de estilo a los elementos con atributos data-navactive, pero solo dentro del componente
  applyStyleClassesNavActive(componentDiv) {
    let elementsWithNavActive;

    if (componentDiv) {
      elementsWithNavActive = componentDiv.querySelectorAll('[data-navactive]');
    } else {
      elementsWithNavActive = document.querySelectorAll('[data-navactive]');
    }
    const navactive = this.getState('navactive');
    elementsWithNavActive.forEach((element) => {
      const item = element.getAttribute('data-navactive');
      if (this.class['navactive'] && item == navactive) {
        const arrayClases = this.class['navactive'].split(/\s+/).filter(Boolean)
        arrayClases.forEach((styleClass) => {
          element.classList.add(styleClass);
        });
      }
    });
  }

  blidToggleThemeButton() {
    const toggleThemeButton = document.querySelector('[data-theme]');
    let darkClass = '';
    let lightClass = '';
    if (toggleThemeButton) {
      this.theme == 'dark' ? darkClass = 'hidden' : lightClass = 'hidden';

      toggleThemeButton.innerHTML = `<svg id="theme-toggle-dark-icon" class="${darkClass} w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
    <svg id="theme-toggle-light-icon" class="${lightClass} w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
    `
      toggleThemeButton.addEventListener('click', () => {
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
        this.changeThemeColor();
      })
    } else {

    }
  }

  bindData(attribute) {
    const elementsWithDataValue = document.querySelectorAll(`[data-value="${attribute}"]`);
    elementsWithDataValue.forEach((element) => {
      const dataKey = element.getAttribute('data-value');
      const dataDefaul = element.getAttribute('data-default');
      const isUpperCase = element.getAttribute('data-UpperCase');
      let valorDefaul = '';

      if (dataKey.includes('!')) {
        const [dataObj, dataProp] = dataKey.split('!');
        if (!this.data[dataObj]) {
          this.data[dataObj] = {};
        }

        if (!this.data[dataObj][dataProp]) {
          this.data[dataObj][dataProp] = "";
        }

        if (dataDefaul) {
          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataObj]) {
            this.defaultData[dataObj] = {};
          }

          if (!this.defaultData[dataObj][dataProp]) {
            this.defaultData[dataObj][dataProp] = "";
          }
          this.defaultData[dataObj][dataProp] = valorDefaul;
          this.data[dataObj][dataProp] = valorDefaul;
        }


        if (element.tagName === 'SELECT') {

          const dataObj = dataKey.split('!')[0];
          this.data[dataObj][dataProp] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.value;
          });
        } else if (element.type === 'checkbox') {

          if (!this.data[dataObj][dataProp]) {
            this.data[dataObj][dataProp] = false;
          }
          element.checked = this.data[dataObj][dataProp] || false;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {
          element.value = this.data[dataObj][dataProp] || '';

          if (isUpperCase) {
            element.addEventListener('input', (event) => {
              const newValue = event.target.value.toUpperCase();
              this.data[dataObj][dataProp] = newValue;
              event.target.value = newValue;
            });
          } else {
            element.addEventListener('input', (event) => {
              this.data[dataObj][dataProp] = event.target.value;
            });
          }
        } else {
          element.textContent = this.data[dataObj][dataProp] || '';
        }

      } else {

        if (dataDefaul) {

          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataKey]) {
            this.defaultData[dataKey] = '';
          }

          console.log(valorDefaul)

          this.defaultData[dataKey] = valorDefaul;
          this.data[dataKey] = valorDefaul;
        }

        if (element.tagName === 'SELECT') {
          this.data[dataKey] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.value;
          });
        } else if (element.type === 'checkbox') {
          if (!this.data[dataKey]) {
            this.data[dataKey] = false;
          }
          element.checked = this.data[dataKey] || false;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {
          element.value = this.data[dataKey] || '';
          if (isUpperCase) {
            element.addEventListener('input', (event) => {
              const newValue = event.target.value.toUpperCase();
              this.data[dataKey] = newValue;
              event.target.value = newValue;
            });
          } else {
            element.addEventListener('input', (event) => {
              this.data[dataKey] = event.target.value;
            });
          }
        } else {
          element.textContent = this.data[dataKey] || '';
        }
      }

    });
  }

  getNestedPropertyValue(obj, propPath) {
    const props = propPath.split('.');
    let value = obj;
    for (const prop of props) {
      if (value.hasOwnProperty(prop)) {
        value = value[prop];
      } else {
        return '';
      }
    }
    return value;
  }

  // Vincula los elementos con atributos data-value a los datos reactivos, pero solo dentro del componente
  bindElementsWithDataValues(componentDiv) {
    let elementsWithDataValue;
    let toggleThemeButton;
    if (componentDiv) {
      elementsWithDataValue = componentDiv.querySelectorAll('[data-value]');
      toggleThemeButton = componentDiv.querySelectorAll('[data-theme]');
    } else {
      elementsWithDataValue = document.querySelectorAll('[data-value]');
      toggleThemeButton = document.querySelectorAll('[data-theme]');
    }

    elementsWithDataValue.forEach((element) => {
      const dataKey = element.getAttribute('data-value');
      const dataDefaul = element.getAttribute('data-default');
      const isUpperCase = element.getAttribute('data-UpperCase');
      let valorDefaul = '';


      if (dataKey.includes('!')) {
        const [dataObj, dataProp] = dataKey.split('!');
        if (!this.data[dataObj]) {
          this.data[dataObj] = {};
        }

        if (!this.data[dataObj][dataProp]) {
          this.data[dataObj][dataProp] = "";
        }

        if (dataDefaul) {
          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataObj]) {
            this.defaultData[dataObj] = {};
          }

          if (!this.defaultData[dataObj][dataProp]) {
            this.defaultData[dataObj][dataProp] = "";
          }
          this.defaultData[dataObj][dataProp] = valorDefaul;
          this.data[dataObj][dataProp] = valorDefaul;
        }


        if (element.tagName === 'SELECT') {

          const dataObj = dataKey.split('!')[0];
          this.data[dataObj][dataProp] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.value;
          });
        } else if (element.type === 'checkbox') {

          if (!this.data[dataObj][dataProp]) {
            this.data[dataObj][dataProp] = false;
          }
          element.checked = this.data[dataObj][dataProp] ?? false;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {
          element.value = this.data[dataObj][dataProp] ?? '';

          if (isUpperCase) {
            element.addEventListener('input', (event) => {
              const newValue = event.target.value.toUpperCase();
              this.data[dataObj][dataProp] = newValue;
              event.target.value = newValue;
            });
          } else {
            element.addEventListener('input', (event) => {
              this.data[dataObj][dataProp] = event.target.value;
            });
          }
        } else {
          element.textContent = this.data[dataObj][dataProp] ?? '';
        }

      } else {

        if (dataDefaul) {

          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataKey]) {
            this.defaultData[dataKey] = '';
          }

          if (!this.data[dataKey]) {
            this.data[dataKey] = '';
          }


          this.defaultData[dataKey] = valorDefaul;
          this.data[dataKey] = valorDefaul;

        }

        if (element.tagName === 'SELECT') {
          this.data[dataKey] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.value;
          });
        } else if (element.type === 'checkbox') {
          if (!this.data[dataKey]) {
            this.data[dataKey] = false;
          }
          element.checked = this.data[dataKey] || false;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {
          element.value = this.data[dataKey] || '';
          if (isUpperCase) {
            element.addEventListener('input', (event) => {
              const newValue = event.target.value.toUpperCase();
              this.data[dataKey] = newValue;
              event.target.value = newValue;
            });
          } else {
            element.addEventListener('input', (event) => {
              this.data[dataKey] = event.target.value;
            });
          }
        } else {
          element.textContent = this.data[dataKey] ?? '';
        }
      }

    });
  }

  // Método para guardar el state en el localStorage
  saveStateToLocalStorage() {
    try {
      const serializedState = JSON.stringify(this.state);
      localStorage.setItem('tmnState', serializedState);
    } catch (error) {
      console.error('Error al guardar el state en el localStorage:', error);
    }
  }

  // Método para cargar el state desde el localStorage
  loadStateFromLocalStorage() {
    try {
      const serializedState = localStorage.getItem('tmnState');
      if (serializedState !== null) {
        return JSON.parse(serializedState);
      }
    } catch (error) {
      console.error('Error al cargar el state desde el localStorage:', error);
    }
    return {};
  }

  // Método para actualizar el state y guardar los cambios en el localStorage
  setState(key, value) {
    this.state[key] = value;
    this.saveStateToLocalStorage();
  }

  // Método para obtener un valor del state
  getState(key) {
    if (this.state[key]) {
      return this.state[key];
    } else {
      this.state[key] = this.loadStateFromLocalStorage();
      return this.state[key];
    }
  }

  // Vincula los eventos submit del formulario con sus functions personalizadas
  bindSubmitEvents(componentDiv) {
    let forms;
    if (componentDiv) {
      forms = componentDiv.querySelectorAll('form[data-action]');
    } else {
      forms = document.querySelectorAll('form[data-action]');
    }

    forms.forEach((form) => {
      const functionName = form.getAttribute('data-action');

      form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        this.executeFunctionByName(functionName);
      });

      form.addEventListener('keypress', function (event) {
        // Verificamos si la tecla presionada es "Enter" (código 13)
        if (event.keyCode === 13) {
          // Prevenimos la acción predeterminada (envío del formulario)
          event.preventDefault();

          // Obtenemos el elemento activo (el que tiene el foco)
          const elementoActivo = document.activeElement;

          // Obtenemos la lista de elementos del formulario
          const elementosFormulario = form.elements;

          // Buscamos el índice del elemento activo en la lista
          const indiceElementoActivo = Array.prototype.indexOf.call(elementosFormulario, elementoActivo);

          // Movemos el foco al siguiente elemento del formulario
          const siguienteElemento = elementosFormulario[indiceElementoActivo + 1];
          if (siguienteElemento) {
            siguienteElemento.focus();
          }
        }
      });
    });
  }

  // Ejecuta una función pasando el nombre como string
  executeFunctionByName(functionName, ...args) {
    if (this.functions && typeof this.functions[functionName] === 'function') {
      const func = this.functions[functionName];
      func(...args);
    } else {
      console.error(`La función '${functionName}' no está definida en la librería Tamnora.`);
    }
  }

  // Ejecuta una función pasando el nombre como string
  execute(callBack) {
    callBack();
  }

  // Método privado para ejecutar la función onMount si está definida
  onDOMContentLoaded() {
    if (typeof this.onMountCallback === 'function') {
      this.onMountCallback();
    }
  }

  // Método para configurar la función personalizada de onMount desde el exterior
  onMount(fn) {
    if (typeof fn === 'function') {
      this.onMountCallback = fn;
    }
  }

  // Método para vincular el data-for y actualizar el contenido
  bindDataFor() {
    const elementsWithDataFor = document.querySelectorAll('[data-for]');
    elementsWithDataFor.forEach((element) => {
      const dataForValue = element.getAttribute('data-for');
      const nameTemplate = element.getAttribute('data-template') || '';
      const [arrayName, values] = dataForValue.split(' as ');
      const dataArray = this.data[arrayName];
      const [valueName, index] = values.split(',');

      let content = '';
      let updatedContent = '';


      if (dataArray) {
        if (dataArray && Array.isArray(dataArray)) {

          if (nameTemplate) {
            if (!this.templates[nameTemplate]) {
              this.templates[nameTemplate] = element.innerHTML;
              content = element.innerHTML;
            } else {
              content = this.templates[nameTemplate];
            }
          } else {
            content = element.innerHTML
          }
          dataArray.forEach((item, index) => {
            updatedContent += this.replaceValueInHTML(content, valueName, item, index);
          });
          element.innerHTML = updatedContent;
          this.bindClickEvents(element);
        }
      } else {
        console.error(`No existe el array ${arrayName}`)
      }

    });
  }


  // Método auxiliar para reemplazar el valor en el HTML
  replaceValueInHTML(html, valueName, item, index) {
    return html.replace(new RegExp(`{${valueName}(\\..+?|)(\\s*\\|\\s*index\\s*)?}`, 'g'), (match) => {
      const propertyAndFilter = match.substring(valueName.length + 1, match.length - 1);
      let [property, filter] = propertyAndFilter.split(/\s*\|\s*/);
      property = property.trim();
      if (property === '.index') {
        return index;
      } else if (property) {
        const value = this.getPropertyValue(item, property);
        if (filter) {
          const filterFn = this.getFilterFunction(filter);
          return filterFn(value);
        } else {
          return value;
        }
      } else {
        return match;
      }
    });
  }

  // Función auxiliar para obtener el valor de una propiedad del objeto "item"
  getPropertyValue(item, property) {
    const properties = property.replace('.', '');
    let value = item[properties];
    return value;
  }

  // Función para obtener la función de filtro si se proporciona
  getFilterFunction(filter) {
    if (filter === 'uppercase') {
      return (value) => value.toUpperCase();
    }

    if (filter === 'lowercase') {
      return (value) => value.toLowerCase();
    }

    if (filter === 'importe') {
      return (value) => value.toLocaleString('es-AR')
    }

    return (value) => value;
  }

  // Método para vincular el data-for y actualizar el contenido
  refreshDataFor(template) {
    const elementsWithDataFor = document.querySelectorAll(`[data-template="${template}"]`);
    elementsWithDataFor.forEach((element) => {
      const dataForValue = element.getAttribute('data-for');
      const nameTemplate = element.getAttribute('data-template') || '';
      const [arrayName, values] = dataForValue.split(' as ');
      const dataArray = this.data[arrayName];
      const [valueName, index] = values.split(',')

      let content = '';
      let updatedContent = '';


      if (dataArray) {
        if (dataArray && Array.isArray(dataArray)) {

          if (nameTemplate) {
            if (!this.templates[nameTemplate]) {
              this.templates[nameTemplate] = element.innerHTML;
              content = element.innerHTML;
            } else {
              content = this.templates[nameTemplate];
            }
          } else {
            content = element.innerHTML
          }
          dataArray.forEach((item, index) => {
            updatedContent += this.replaceValueInHTML(content, valueName, item, index);
          });
          element.innerHTML = updatedContent;
          this.bindClickEvents(element);
          this.onDOMContentLoaded();
        }
      } else {
        console.error(`No existe el array ${arrayName}`)
      }


    });
  }

  // Método para resaltar el enlace activo
  handleNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('[data-navactive]');
    navLinks.forEach((link) => {
      const navactive = link.getAttribute('data-navactive');
      if (navactive && currentPath === link.getAttribute('href')) {
        this.setState('navactive', parseInt(navactive, 10));
        this.applyStyleClassesNavActive();
      }
    });
  }

  // Método para manejar la navegación en la carga de la página
  handleNavigationOnLoad() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('[data-navactive]');
    navLinks.forEach((link) => {
      const navactive = link.getAttribute('data-navactive');
      if (navactive && currentPath === link.getAttribute('href')) {
        this.setState('navactive', parseInt(navactive, 10));
      }
    });
  }

  setCaretToEnd(el) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  }

  // Acceder a elementos vinculados por selector y agregar eventos
  select(selector) {
    const element = document.querySelector(selector);
    if (element) {
      return {
        click: (callback) => {
          element.addEventListener('click', callback);
        },
        doubleClick: (callback) => {
          element.addEventListener('dblclick', callback);
        },
        focus: (callback) => {
          element.addEventListener('focus', callback);
        },
        blur: (callback) => {
          element.addEventListener('blur', callback);
        },
        change: (callback) => {
          element.addEventListener('change', (event) => {
            callback(event, element);
          });
        },
        select: (callback) => {
          element.addEventListener('select', (event) => {
            callback(event, element);
          });
        },
        input: (callback) => {
          element.addEventListener('input', (event) => {
            callback(event, element);
          });
        },
        enter: (callback) => {
          element.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              callback(event, element);
            }
          });
        },
        keyCodeDown: (callback, allowedKeys) => {
          element.addEventListener('keydown', (event) => {
            if (allowedKeys.includes(event.keyCode)) {
              event.preventDefault();
              callback(event, element);
            }
          });
        },
        hover: (enterCallback, leaveCallback) => {
          element.addEventListener('mouseenter', enterCallback);
          element.addEventListener('mouseleave', leaveCallback);
        },
        keydown: (callback) => {
          element.addEventListener('keydown', callback);
        },
        submit: (callback) => {
          element.addEventListener('submit', callback);
        },
        scroll: (callback) => {
          element.addEventListener('scroll', callback);
        },
        resize: (callback) => {
          element.addEventListener('resize', callback);
        },
        contextMenu: (callback) => {
          element.addEventListener('contextmenu', callback);
        },
        removeEvent: (event, callback) => {
          element.removeEventListener(event, callback);
        },
        html: (content) => {
          element.innerHTML = content;
          this.applyStyleClasses(element);
          this.bindElementsWithDataValues(element);
          this.bindClickEvents(element);
          this.bindChangeEvents(element);
        },
        addClass: (content) => {
          element.classList.add(content);
        },
        removeClass: (content) => {
          element.classList.remove(content);
        },
        toggleClass: (content) => {
          element.classList.toggle(content);
        },
        containsClass: (content) => {
          return element.classList.contains(content);
        },
        removeAndAddClass: (arrRemove, arrAdd) => {
          arrRemove.forEach(itemRemove => {
            if (element.classList.contains(itemRemove)) {
              element.classList.remove(itemRemove)
            }
          })
          arrAdd.forEach(itemAdd => {
            if (!element.classList.contains(itemAdd)) {
              element.classList.add(itemAdd)
            }
          })
        },
        classRefresh: () => {
          this.applyStyleClasses(element);
          this.bindElementsWithDataValues(element);
          this.bindClickEvents(element);
          this.bindChangeEvents(element);
        },
        bindModel: () => {
          this.bindElementsWithDataValues(element);
          this.bindClickEvents(element);
          this.bindChangeEvents(element);
          this.bindToggleEvents(element);
        },
        value: (newValue = null) => {
          if (!newValue == null) {
            element.value = newValue;
          }
          return element.value
        },
        setValue: (value) => {
          const elementType = element.tagName.toLowerCase();

          switch (elementType) {
            case 'select':
              Array.from(element.options).forEach((option) => {
                option.selected = option.value === value;
              });
              break;
            case 'input':
              if (element.type === 'checkbox') {
                element.checked = value;
              } else {
                element.value = value;
              }
              break;
            case 'textarea':
              element.value = value;
              break;
            default:
              console.warn(`No se puede establecer el valor para el elemento ${elementType}.`);
              break;
          }
        },
        setValuePesos: (value) => {
          const arrayValue = formatNumberArray(value);
          element.value = arrayValue[2];
        },
        setValueCurrency: (value) => {
          const arrayValue = formatNumberArray(value);
          element.value = arrayValue[1];
        },
        target: () => {
          return element.target
        },
        inFocus: () => {
          return element.focus()
        },
        setAttributes: (attrs) => {
          Object.keys(attrs).forEach((key) => {
            element.setAttribute(key, attrs[key]);
          });
        },

        getAttributes: () => {
          const attrs = {};
          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });
          return attrs;
        },

        deleteAttribute: (attrName) => {
          if (element.hasAttribute(attrName)) {
            element.removeAttribute(attrName);
          }
        },

        // Agregar más eventos aquí según sea necesario
      };
    } else {
      console.error(`Elemento con ID '${id}' no encontrado.`);
      return null;
    }
  }
  // Acceder a todos los elementos vinculados por selector y agregar eventos
  selectAll(selector) {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map((element) => {
      return {
        click: (callback) => {
          element.addEventListener('click', callback);
        },
        doubleClick: (callback) => {
          element.addEventListener('dblclick', callback);
        },
        focus: (callback) => {
          element.addEventListener('focus', callback);
        },
        blur: (callback) => {
          element.addEventListener('blur', callback);
        },
        change: (callback) => {
          element.addEventListener('change', callback);
        },
        select: (callback) => {
          element.addEventListener('select', callback);
        },
        input: (callback) => {
          element.addEventListener('input', callback);
        },
        enter: (callback) => {
          element.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
              callback();
            }
          });
        },
        hover: (enterCallback, leaveCallback) => {
          element.addEventListener('mouseenter', enterCallback);
          element.addEventListener('mouseleave', leaveCallback);
        },
        keydown: (callback) => {
          element.addEventListener('keydown', callback);
        },
        submit: (callback) => {
          element.addEventListener('submit', callback);
        },
        scroll: (callback) => {
          element.addEventListener('scroll', callback);
        },
        resize: (callback) => {
          element.addEventListener('resize', callback);
        },
        contextMenu: (callback) => {
          element.addEventListener('contextmenu', callback);
        },
        removeEvent: (event, callback) => {
          element.removeEventListener(event, callback);
        },
        html: (content) => {
          element.innerHTML = content;
          this.applyStyleClasses(element);
          this.bindElementsWithDataValues(element);
          this.bindClickEvents(element);
          this.bindChangeEvents(element);
        },
        addClass: (content) => {
          element.classList.add(content);
        },
        removeClass: (content) => {
          element.classList.remove(content);
        },
        toggleClass: (content) => {
          element.classList.toggle(content);
        },
        value: element

        // ... (otros métodos, igual que en el método selector)
      };
    });
  }

  // Agregar lógica del tema oscuro
  darkMode(option) {
    if (option) {
      if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        this.theme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        this.theme = 'light';
      }
    }
    this.changeThemeColor();
  }

  changeThemeColor() {
    let darkModeOn = document.documentElement.classList.contains('dark');
    const themeColorMeta = document.querySelector('head meta[name="theme-color"]');

    if (themeColorMeta) {
      const themeColorContent = themeColorMeta.getAttribute("content");
      if (darkModeOn) {
        if (themeColorContent != this.themeColorDark) {
          themeColorMeta.setAttribute('content', this.themeColorDark)
        }
      } else {
        if (themeColorContent != this.themeColorLight) {
          themeColorMeta.setAttribute('content', this.themeColorLight)
        }
      }
    }
    this.iframeData();
  }

  iframeData() {
    const iframes = document.querySelectorAll("iframe");

    // Recorre los iframes para buscar uno con data-theme="iframe"
    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i];
      iframe.contentWindow.postMessage('changeTheme');
      // Verifica si el atributo data-theme es igual a "iframe"
      if (iframe.getAttribute("data-theme") === "iframe") {
        // Se encontró un iframe con data-theme="iframe"
        console.log("Se encontró un iframe con data-theme='iframe'.");
        // Realiza aquí cualquier acción que necesites
      }
    }
  }

  listenerMessage() {
    const self = this;
    window.addEventListener("message", function (event) {
      if (event.data === "changeTheme") {
        // Cambiar el tema a oscuro aquí
        self.darkMode(true);
        self.changeThemeColor();
      } else if (event.data === "reloadObserv") {
        self.functions.reloadObserv();
      }
    });
  }

  // date(value = ''){
  //   return formatDate(value);
  // }

  // number(value = 0){
  //   return formatNumber(value,{type:'currency'});
  // }

  // numberArray(value = 0){
  //   return formatNumberArray(value)
  // }

  currency(value, element) {
    let newValue = formatNumber(value, { type: 'currency', leng: 'en' });
    if (newValue == 'NaN') {
      newValue = 0;
    }
    element.target.value = newValue;

    this.setValueRoute(element.target.dataset.value, newValue);
  }



  pesos(numero, decimales, signo = '') {
    let numeroString = formatNumber(numero, { dec: decimales, symb: signo, type: 'currency' })
    return `${numeroString}`;
  }

  getParams(decode = true) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const params = [];
    let name, value;
    urlParams.forEach((val, nam) => {
      name = nam;
      value = val;
      if (decode) {
        name = atob(nam);
        value = atob(val);
      }
      params.push({ name, value });
    })
    return params;
  }

  goTo(url, params = [], code = true) {
    let values = '';
    let value = '';
    let name = '';
    if (params.length > 0) {
      values = '?'
      params.forEach(data => {
        value = data.value;
        name = data.name;
        if (code) {
          value = btoa(value);
          name = btoa(name);
        }
        values += `${name}=${value}`
      })
    }
    globalThis.location.href = `${url}${values}`
  }

  isDateInRange(startDate, endDate, today) {
    // Convert the date strings to Date objects
    var startDateObj = new Date(startDate);
    var endDateObj = new Date(endDate);
    var todayObj = new Date(today);

    // Check if today is within the range of startDate and endDate
    return todayObj >= startDateObj && todayObj <= endDateObj;
  }



  async dLookup(columna, tabla, condicion) {
    const resp = await runCode(`-sl ${columna} -fr ${tabla} -wr ${condicion}`);
    return resp[0][columna]
  }

  async dLookupAll(columna, tabla, condicion) {
    const resp = await runCode(`-sl ${columna} -fr ${tabla} -wr ${condicion}`);
    return resp
  }

  padLeft(str, length = 4, character = '0') {
    while (str.length < length) {
      str = character + str;
    }
    return str;
  }

  padRight(str, length = 4, character = '0') {
    while (str.length < length) {
      str = str + character;
    }
    return str;
  }

  createButton(options = {}) {
    if (!options.title) options.title = 'Nuevo Botón';
    if (!options.className) options.className = 'btnNeutral';
    if (!options.position) options.position = 'left';
    if (!options.dataClick) options.dataClick = 'dataClick';

    let myBtn = `<button type="button" `;

    if (options.dataClick) {
      myBtn += ` data-click="${options.dataClick}"`;
    }
    myBtn += ` class="${this.class[options.className]}">`;

    if (options.icon) {
      if (options.position == 'left') {
        myBtn += `${options.icon} ${options.title}`;
      } else {
        myBtn += `${options.title} ${options.icon}`;
      }
    } else {
      myBtn += `${options.title}`;
    }
    myBtn += `</button>`;
    return myBtn;
  }

  createSearch(options = {}) {
    if (!options.value) options.value = 'buscando';
    if (!options.change) options.change = 'accionBuscar';
    if (!options.inputClass) options.inputClass = 'bg-neutral-100 text-neutral-600 focus:border-sky-400 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-800';
    if (!options.iconClass) options.iconClass = 'text-neutral-500 dark:text-neutral-400';

    let comp = `
    <div class="relative" >
    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ${options.iconClass}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
      </svg>
    </div>
    <input
      type="search" 
      name="search"
      autoComplete="off"
      data-value="${options.value}"
      data-change = "${options.change}"
      class="block w-80 py-2 px-3 ps-10 text-sm font-normal border rounded-lg outline-none shadow-sm ${options.inputClass}" 
      placeholder='Buscar...' />
  </div>
    `
    return comp
  }



}

export class DataObject {
  constructor(name = 'newform', refTmn, fields = {}) {
    this.camposRegistro = {};
    this.formOptions = {};
    this.data = this.createReactiveProxy(fields.data);
    this.tmn = refTmn;
    this.table = '';
    this.type = 'normal'
    this.key = '';
    this.focus = '';
    this.id = null;
    this.orderColumns = [];
    this.camposOrden = {}
    this.numberAlert = 0;
    this.resetOnSubmit = false;
    this.structure = [];
    this.formElement = '';
    this.modalName = '';
    this.name = name;
    this.defaultDataObjeto = {};
    this.formClass = defaultClass().form;
    this.functions = {
      closeModal: () => {
        const btnDelete = this.formElement.querySelector('[data-formclick="delete"]');
        const modal = document.querySelector(`#${this.name}`);
        if (btnDelete) btnDelete.innerHTML = this.formOptions.delete;
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        this.numberAlert = 0;
      },
      openModal: () => {
        const btnDelete = this.formElement.querySelector('[data-formclick="delete"]');
        const modal = document.querySelector(`#${this.name}`);
        if (btnDelete) btnDelete.innerHTML = this.formOptions.delete;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        this.numberAlert = 0;
      },
      onMount:()=>{console.log('form montado')},
      submit: async (event, modalName) => {
        let resultEvalute = true;
        this.setDataFromModel(this.data[this.name]);
        for (const fieldName in this.camposRegistro) {
          if (this.camposRegistro[fieldName].validate) {
            let value = this.camposRegistro[fieldName].value;
            let campo = this.camposRegistro[fieldName].name;
            let validate = this.camposRegistro[fieldName].validate;
            if (!eval(validate)) {
              resultEvalute = false;
              const input = globalThis.document.getElementById(`${this.name}_${fieldName}`);
              input.focus();
              input.select();
              console.log(`El campo ${campo} no pasa la validación`)
              return false;
            }
          }
        }

        if (resultEvalute) {
          let defaultTitle = event.submitter.innerHTML;
          event.submitter.disabled = true;
          event.submitter.innerHTML = `
          <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-blue-600 dark:text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
      </svg>
      Procesando...
          `

          // Define una promesa dentro del evento submit
          const promesa = new Promise((resolve, reject) => {
            const datt = this.name;
            this.setDataFromModel(this.data[datt]);
            const paraSQL = this.getDataAll();
            const send = prepararSQL(this.table, paraSQL, this.id);
            const validation = this.validations();

            if (validation) {
              if (send.status == 1) {
                dbSelect(send.tipo, send.sql).then(val => {
                  if (val[0].resp == 1) {
                    resolve(val[0]);
                  } else {
                    reject(val[0]);
                  }
                })
              } else {
                reject('Algo falta por aquí!')
              }
            } else {
              reject('No paso la validación!')
            }

          });

          // Maneja la promesa
          promesa
            .then((respuesta) => {
              console.log(respuesta); // Maneja la respuesta del servidor
              event.submitter.innerHTML = `${defaultTitle} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            `;
              event.submitter.disabled = false;
              if (this.nameModal) {
                this.functions.closeModal();
              }
              this.functions['reload'](respuesta);
              if (this.resetOnSubmit) {
                this.resetValues();
              }

            })
            .catch((error) => {
              console.error("Error al enviar el formulario:", error);
              event.submitter.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg> Error al Guardar !
            
            `;
            });
        }

      },
      delete: async (e) => {
        let sql, reference, val, key;
        const datt = this.name;
        const btnDelete = this.formElement.querySelector('[data-formclick="delete"]');

        if (this.key != '') {
          key = this.key;
          if (this.id) {
            val = this.id;
          } else {
            val = this.getValue(`${datt}!${this.key}`);
          }

          sql = `DELETE FROM ${this.table} WHERE ${this.key} = ${val}`;
          reference = `<span class="font-bold ml-2">${this.camposRegistro[this.key].name}  ${val}</span>`;
        } else {
          this.structure.forEach(value => {
            console.log(value)
            if (value.COLUMN_KEY == 'PRI') {
              key = value.COLUMN_NAME;
              val = this.getValue(`${datt}!${value.COLUMN_NAME}`);
              sql = `DELETE FROM ${this.table} WHERE ${value.COLUMN_NAME} = ${val}`;
              reference = `<span class="font-bold ml-2">${value.COLUMN_NAME}  ${val}</span>`;
            }
          })

        }

        if (sql && val) {
          if (this.numberAlert > 0) {
            let defaultTitle = btnDelete.innerHTML;
            btnDelete.disabled = true;
            btnDelete.innerHTML = `
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            Eliminando...
                `

            // Define una promesa dentro del evento submit
            const promesa = new Promise((resolve, reject) => {
              dbSelect('d', sql).then(val => {
                if (val[0].resp == 1) {
                  resolve(val[0]);
                } else {
                  reject(val[0]);
                }
              })

            });

            // Maneja la promesa
            promesa
              .then((respuesta) => {
                console.log(respuesta); // Maneja la respuesta del servidor
                btnDelete.innerHTML = this.formOptions.delete;
                btnDelete.disabled = false;
                this.numberAlert = 0;
                if (this.modalName) {
                  this.functions.closeModal();
                }
                this.functions['reload'](respuesta);
                if (this.resetOnSubmit) {
                  this.resetValues();
                }
              })
              .catch((error) => {
                console.error("Error al enviar el formulario:", error);
              });


          } else {
            this.numberAlert = 1;
            btnDelete.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline w-4 h-4 mr-2 text-white">
  <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
</svg>  Confirma ELIMINAR ${reference}
                 `
          }



        } else {
          console.error(`NO se puede ELIMINAR ${key} con valor ${val} NULL`)
        }

      },
      reload: () => { }
    };

    if (Object.keys(fields).length > 0) {
      fields.forEach(field => {
        this.camposRegistro[field] = {
          "type": "text",
          "name": field,
          "required": false,
          "placeholder": "",
          "value": "",
          "column": "",
          "rows": "3",
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "class": '',
          "defaultValue": "...",
          "elegirOpcion": false,
          "key": "",
          "introDate": false,
          "setDate": 0,
          "change": '',
          "options": [],
          "noData": false,
          "validate": ''
        };
      });
    }
    this.initCss();

  }

  initCss(){
    // Obtén el elemento por su ID
    const element = document.getElementById('initcss');
    let existe = false;
    
    // Verifica si el elemento existe
    if (element) {
        existe = true;
    } else {
        existe = false;
    }

    if(!existe){
      const styleTag = document.createElement('style');
      styleTag.id = "initcss";
          
          // Agregar estilos al elemento
          styleTag.textContent = `
          @-webkit-keyframes fadeIn {
            0% { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            to { opacity: 1; }
          }
          .fadeIn {
            -webkit-animation-name: fadeIn;
            animation-name: fadeIn;
            -webkit-animation-duration: 0.5s;
            animation-duration: 0.5s;
          }
          `;
  
          // Agregar el elemento <style> al <head>
          document.head.appendChild(styleTag);
    }
  }

  setClass(obj) {
    this.formClass = obj;
  }

  getClass() {
    return this.formClass;
  }

  setClassItem(item, str) {
    this.formClass[item] = str;
  }

  getClassItem(item) {
    return this.formClass[item];
  }

  changeColorClass(color) {
    Object.keys(this.formClass).forEach((tipo) => {
      let inClass = this.formClass[tipo];
      let outClass = inClass.replaceAll('neutral', color)
      this.formClass[tipo] = outClass;
    })
  }

  setClassItemAdd(item, newClass) {
    this.formClass[item] += ` ${newClass}`
  }

  setClassItemChange(item, theClass, newClass) {
    let inClass = this.formClass[item];
    let outClass = inClass.replaceAll(theClass, newClass);
    this.formClass[item] = outClass;
  }

  getFunction() {
    console.log(this.functions);
  }

  setFunction(name, fn) {
    if (typeof fn === 'function') {
      this.functions[name] = fn;
    } else {
      console.error('La función no es válida!')
    }
  }



  getStructure() {
    return this.structure
  }

  async setStructure(table, key = '', reset = false) {
    let ejecute = false;
    if (this.structure.length == 0 || reset == true) {
      ejecute = true;
    } else {
      return true
    }

    if (ejecute) {
      let struc = await structure('t', table);
      if (!struc[0].resp) {
        this.table = table;
        this.key = key;

        let defaultRow = {}
        const newObject = {};
        let groupType = {};
        let primaryKey = {};
        const newStruc = []
        struc.forEach(data => {
          data.table = table;
          data.COLUMN_NAME = data.COLUMN_NAME.toLowerCase()
          newStruc.push(data);
        })

        this.structure = newStruc;

        newStruc.forEach(val => {
          let name = val.COLUMN_NAME;
          groupType[val.COLUMN_NAME] = this.typeToType(val.DATA_TYPE);
          primaryKey[val.COLUMN_NAME] = val.COLUMN_KEY;
          defaultRow[name] = '0';
        })


        for (const fieldName in defaultRow) {
          if (defaultRow.hasOwnProperty(fieldName)) {
            let value = defaultRow[fieldName];
            let type = '';
            let key = '';

            if (fieldName in groupType) {
              type = groupType[fieldName];
            }

            if (fieldName in primaryKey) {
              key = primaryKey[fieldName];
            }

            if (type == 'number') {
              value = 0;
            } else {
              value = '';
            }


            newObject[fieldName] = {
              "type": type,
              "name": fieldName,
              "required": false,
              "placeholder": "",
              "value": value,
              "column": "",
              "rows": "3",
              "attribute": 0,
              "hidden": false,
              "pattern": '',
              "class": '',
              "defaultValue": "...",
              "elegirOpcion": false,
              "key": key,
              "introDate": false,
              "setDate": 0,
              "options": [],
              "noData": false,
              "validate": ''
            };
          }
        }

        this.defaultDataObjeto = newObject;
        return true
      } else {
        console.error(struc[0].msgError)
        return false
      }
    }
  }

  async addStructure(table) {
    let struc = await structure('t', table);
    console.log(struc)
    if (!rstData[0].resp) {
      const newStruc = []
      struc.forEach(data => {
        data.table = table;
        newStruc.push(data);
      })
      const arrayCombinado = this.structure.concat(newStruc);
      const conjuntoUnico = new Set(arrayCombinado.map(objeto => JSON.stringify(objeto)));
      this.structure = Array.from(conjuntoUnico).map(JSON.parse);
      console.log(this.structure)
    }
  }


  setData(fieldName, key, value) {
    const name = this.name;
    if (this.camposRegistro[fieldName]) {
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        this.camposRegistro[fieldName][key] = parseFloat(value)
        this.defaultDataObjeto[fieldName][key] = parseFloat(value);
      } else {
        this.camposRegistro[fieldName][key] = value;
        this.defaultDataObjeto[fieldName][key] = value;
        if (value == 'currency') {
          this.camposRegistro[fieldName].pattern = "[0-9.,]*";
          this.defaultDataObjeto[fieldName].pattern = "[0-9.,]*";
        }
      }
      if (key == 'introDate') {
        let myDate = new Date();
        let days = this.camposRegistro[fieldName]['setDate'];
        let typeInput = this.camposRegistro[fieldName]['type'];
        if (days > 0) {
          myDate.setDate(myDate.getDate() + days);
        } else if (days < 0) {
          myDate.setDate(myDate.getDate() - days);
        }

        if (typeInput == 'datetime-local') {
          this.camposRegistro[fieldName].value = formatDate(myDate).fechaHora;
          this.defaultDataObjeto[fieldName].value = formatDate(myDate).fechaHora;
          this.data[name][fieldName] = formatDate(myDate).fechaHora;
        } else if (typeInput == 'date') {
          this.camposRegistro[fieldName].value = formatDate(myDate).fecha;
          this.defaultDataObjeto[fieldName].value = formatDate(myDate).fecha;
          this.data[name][fieldName] = formatDate(myDate).fecha;
        } else if (typeInput == 'time') {
          this.camposRegistro[fieldName].value = formatDate(myDate).horaLarga;
          this.defaultDataObjeto[fieldName].value = formatDate(myDate).horaLarga;
          this.data[name][fieldName] = formatDate(myDate).horaLarga;
        }
      }

      if (key == 'value') {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          this.data[name][fieldName] = parseFloat(value);
        } else {
          this.data[name][fieldName] = value;
        }
        this.updateElementsWithDataValue(`${name}!${fieldName}`, value)
      }

    }
  }

  setDataDefault(fieldName, key, value) {
    const name = this.name;

    if (this.defaultDataObjeto[fieldName]) {
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        this.defaultDataObjeto[fieldName][key] = parseFloat(value);
      } else {
        this.defaultDataObjeto[fieldName][key] = value;
        if (value == 'currency') {
          this.defaultDataObjeto[fieldName].pattern = "[0-9.,]*";
        }
      }


      if (key == 'value') {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          this.data[name][fieldName] = parseFloat(value);
        } else {
          this.data[name][fieldName] = value;
        }
      }

    }
  }



  setDataFromModel(objectModel) {
    Object.keys(objectModel).forEach((fieldName) => {
      let value = objectModel[fieldName];

      if (this.camposRegistro[fieldName]) {
        if (this.camposRegistro[fieldName].type == 'number' || this.camposRegistro[fieldName].type == 'select') {
          if (!isNaN(parseFloat(value)) && isFinite(value)) {
            this.camposRegistro[fieldName].value = parseFloat(value)
          } else {
            this.camposRegistro[fieldName].value = value;
          }
        } else {
          this.camposRegistro[fieldName].value = value;

        }

      } else {
        console.error('No existe ', fieldName, value)
      }


    })
  }

  getData(fieldName, key) {
    if (this.camposRegistro[fieldName]) {
      return this.camposRegistro[fieldName][key];
    }
    return undefined;
  }

  setDataGroup(fieldNames, key, value) {
    fieldNames.forEach(fieldName => {
      if (this.camposRegistro[fieldName]) {
        this.camposRegistro[fieldName][key] = value;
      }
    });
  }

  setDataKeys(key, objectNameValue) {
    Object.keys(objectNameValue).forEach((val) => {
      if (this.camposRegistro[val]) {
        this.camposRegistro[val][key] = objectNameValue[val];
      }
    })
  }

  setDataObject(fieldName, updates) {
    const name = this.name;
    if (this.camposRegistro[fieldName]) {
      for (const prop in updates) {
        if (updates.hasOwnProperty(prop) && this.camposRegistro[fieldName].hasOwnProperty(prop)) {
          this.camposRegistro[fieldName][prop] = updates[prop];

          if (prop == 'value') {
            if (!isNaN(parseFloat(updates[prop])) && isFinite(updates[prop])) {
              this.data[name][fieldName] = parseFloat(updates[prop]);
            } else {
              this.data[name][fieldName] = updates[prop];
            }
            this.updateElementsWithDataValue(`${name}!${fieldName}`, updates[prop])
          }
        } else {
          console.error(`Prop '${prop}' does not exist in the data object.`);
        }
      }

    } else {
      console.error(`fielName '${fieldName}' does not exist in the data object.`);
    }
  }

  getDataGroup(fieldNames, key) {
    const dataGroup = {};
    fieldNames.forEach(fieldName => {
      if (this.camposRegistro[fieldName]) {
        dataGroup[fieldName] = this.camposRegistro[fieldName][key];
      }
    });
    return dataGroup;
  }

  getDataAll() {
    return this.camposRegistro;
  }

  removeAll() {
    this.camposRegistro = {};
  }

  reordenarClaves(objeto, orden) {
    const resultado = {};
    orden.forEach((clave) => {
      if (objeto.hasOwnProperty(clave)) {
        resultado[clave] = objeto[clave];
      }
    });
    return resultado;
  }

  // Nuevo método para recorrer y aplicar una función a cada campo
  forEachField(callback) {
    for (const fieldName in this.camposRegistro) {
      callback(fieldName, this.camposRegistro[fieldName]);
    }
  }

  validations() {
    let resultado = true;
    for (const fieldName in this.camposRegistro) {
      if (this.camposRegistro[fieldName].validate) {
        let value = this.camposRegistro[fieldName].value;
        let name = this.camposRegistro[fieldName].name;
        let validate = this.camposRegistro[fieldName].validate;
        if (!eval(validate)) {
          resultado = false;
          console.log(`El campo ${name} no pasa la validación`)
        }
      }
    }
    return resultado
  }

  getDataClone() {
    return this.camposRegistro;
  }

  cloneFrom(newObject, clean = false) {
    const name = this.name;
    this.camposRegistro = newObject;
    console.log(newObject)

    for (const fieldName in this.camposRegistro) {
      const type = this.camposRegistro[fieldName].type;
      let value = this.camposRegistro[fieldName].value;
      if (clean == true) {
        if (type == 'number') {
          value = 0;
        } else {
          value = '';
        }

        this.data[name][fieldName] = value;
      }
    }

    this.bindElementsWithDataValues(this.formElement);

  }

  resetValues() {
    const name = this.name;
    for (const fieldName in this.defaultDataObjeto) {
      const introDate = this.defaultDataObjeto[fieldName].introDate;
      let value = this.defaultDataObjeto[fieldName].value;



      if (introDate == true) {
        let myDate = new Date();
        let days = this.camposRegistro[fieldName]['setDate'];
        let typeInput = this.camposRegistro[fieldName]['type'];
        if (days > 0) {
          myDate.setDate(myDate.getDate() + days);
        } else if (days < 0) {
          myDate.setDate(myDate.getDate() - days);
        }

        if (typeInput == 'datetime-local') {
          this.camposRegistro[fieldName].value = formatDate(myDate).fechaHora;
          this.defaultDataObjeto[fieldName].value = formatDate(myDate).fechaHora;
          this.data[name][fieldName] = formatDate(myDate).fechaHora;
        } else if (typeInput == 'date') {
          this.camposRegistro[fieldName].value = formatDate(myDate).fecha;
          this.defaultDataObjeto[fieldName].value = formatDate(myDate).fecha;
          this.data[name][fieldName] = formatDate(myDate).fecha;
        } else if (typeInput == 'time') {
          this.camposRegistro[fieldName].value = formatDate(myDate).horaLarga;
          this.defaultDataObjeto[fieldName].value = formatDate(myDate).horaLarga;
          this.data[name][fieldName] = formatDate(myDate).horaLarga;
        }

      } else {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          this.data[name][fieldName] = parseFloat(value);
          this.camposRegistro[fieldName].value = parseFloat(value);
        } else {
          this.data[name][fieldName] = value;
          this.camposRegistro[fieldName].value = value;
        }
      }
      this.updateElementsWithDataValue(`${name}!${fieldName}`, value)
    }

  }

  updateDataInFormModal(newObjectData) {
    const name = this.name;
    for (const fieldName in this.camposRegistro) {
      const setDate = this.camposRegistro[fieldName].setDate;
      const type = this.camposRegistro[fieldName].type;
      let value = newObjectData[fieldName];

      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        this.data[name][fieldName] = parseFloat(value);
        this.camposRegistro[fieldName].value = parseFloat(value);
      } else {
        this.data[name][fieldName] = value;
        this.camposRegistro[fieldName].value = value;
      }


      // this.updateElementsWithDataValue(`${name}!${fieldName}`, value)
      //this.createFormModal(this.formOptions)
    }
  }

  updateDataInForm(newObjectData) {
    const name = this.name;
    for (const fieldName in this.camposRegistro) {
      const setDate = this.camposRegistro[fieldName].setDate;
      const type = this.camposRegistro[fieldName].type;
      let value = newObjectData[fieldName];

      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        this.data[name][fieldName] = parseFloat(value);
        this.camposRegistro[fieldName].value = parseFloat(value);
      } else {
        this.data[name][fieldName] = value;
        this.camposRegistro[fieldName].value = value;
      }



      //this.updateElementsWithDataValue(`${name}!${fieldName}`, value)
      this.createForm(this.formOptions)
    }
  }

  updateDataInFormForNew() {
    const name = this.name;
    for (const fieldName in this.defaultDataObjeto) {
      const introDate = this.defaultDataObjeto[fieldName].introDate;
      let value = this.defaultDataObjeto[fieldName].value;



      if (introDate == true) {
        let myDate = new Date();
        let days = this.defaultDataObjeto[fieldName]['setDate'];
        let typeInput = this.defaultDataObjeto[fieldName]['type'];
        if (days > 0) {
          myDate.setDate(myDate.getDate() + days);
        } else if (days < 0) {
          myDate.setDate(myDate.getDate() - days);
        }

        if (typeInput == 'datetime-local') {
          this.camposRegistro[fieldName].value = formatDate(myDate).fechaHora;
          this.defaultDataObjeto[fieldName].value = formatDate(myDate).fechaHora;
          this.data[name][fieldName] = formatDate(myDate).fechaHora;
        } else if (typeInput == 'date') {
          this.camposRegistro[fieldName].value = formatDate(myDate).fecha;
          this.defaultDataObjeto[fieldName].value = formatDate(myDate).fecha;
          this.data[name][fieldName] = formatDate(myDate).fecha;
        } else if (typeInput == 'time') {
          this.camposRegistro[fieldName].value = formatDate(myDate).horaLarga;
          this.defaultDataObjeto[fieldName].value = formatDate(myDate).horaLarga;
          this.data[name][fieldName] = formatDate(myDate).horaLarga;
        }

      } else {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          this.data[name][fieldName] = parseFloat(value);
          this.camposRegistro[fieldName].value = parseFloat(value);
        } else {
          this.data[name][fieldName] = value;
          this.camposRegistro[fieldName].value = value;
        }
      }
      //this.updateElementsWithDataValue(`${name}!${fieldName}`, value)
      this.createForm(this.formOptions)
    }

  }



  typeToType(inType = 'text') {
    let outType;
    if (inType == 'int') outType = 'number';
    if (inType == 'tinyint') outType = 'number';
    if (inType == 'double') outType = 'number';
    if (inType == 'char') outType = 'text';
    if (inType == 'varchar') outType = 'text';
    if (inType == 'datetime') outType = 'datetime-local';
    if (inType == 'timestamp') outType = 'datetime-local';
    if (inType == 'date') outType = 'date';
    if (inType == 'time') outType = 'time';
    if (inType == 'decimal') outType = 'currency';
    if (inType == 'text') outType = 'text';
    if (inType == 'longtext') outType = 'text';
    if (inType == 'bigint') outType = 'number';


    if (!outType) {
      console.error(`inType ${inType} no definido!`)
      outType = 'text'
    }

    return outType
  }


  // Nuevo método para agregar objetos al array y completar campos
  addObject(dataObject, structure = [], clean = false) {
    const newObject = {};
    const newObjectDefault = {};
    let groupType = {};
    let primaryKey = {};



    if (structure.length > 0) {
      structure.forEach(val => {
        let name = val.COLUMN_NAME.toLowerCase()
        groupType[name] = this.typeToType(val.DATA_TYPE);
        primaryKey[name] = val.COLUMN_KEY;
      })
    } else {
      if (this.structure.length > 0) {
        this.structure.forEach(val => {
          let name = val.COLUMN_NAME.toLowerCase()
          groupType[name] = this.typeToType(val.DATA_TYPE);
          primaryKey[name] = val.COLUMN_KEY;
        })
      }
    }



    for (const fieldName in dataObject) {
      if (dataObject.hasOwnProperty(fieldName)) {
        let value = dataObject[fieldName];
        let type = this.detectDataType(value);
        let key = '';

        if (type == 'datetime') {
          value = formatDate(new Date(value)).fechaHora;
        }
        if (clean == true) {
          if (type == 'number') {
            value = 0;
          } else {
            value = '';
          }
        } else {
          if (value == null) {
            value = '';
          }
        }

        if (fieldName in groupType) {
          type = groupType[fieldName];
        }

        if (fieldName in primaryKey) {
          key = primaryKey[fieldName];
        }


        newObject[fieldName] = {
          "type": type,
          "name": fieldName,
          "required": false,
          "placeholder": "",
          "value": value,
          "column": "",
          "rows": "3",
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "class": '',
          "defaultValue": "...",
          "elegirOpcion": false,
          "key": key,
          "introDate": false,
          "setDate": 0,
          "change": '',
          "options": [],
          "noData": false,
          "validate": ''
        };

        newObjectDefault[fieldName] = {
          "type": type,
          "name": fieldName,
          "required": false,
          "placeholder": "",
          "value": value,
          "column": "",
          "rows": "3",
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "class": '',
          "defaultValue": "...",
          "elegirOpcion": false,
          "key": key,
          "introDate": false,
          "setDate": 0,
          "change": '',
          "options": [],
          "noData": false,
          "validate": ''
        };
      }
    }

    this.camposRegistro = newObject;
    this.defaultDataObjeto = newObjectDefault;



  }

  addObjectSpecial(fieldName, value, type = 'text') {
    const newObject = {
      "type": type,
      "name": fieldName,
      "required": false,
      "placeholder": "",
      "value": value,
      "column": "",
      "rows": "3",
      "attribute": 0,
      "hidden": false,
      "pattern": '',
      "class": '',
      "defaultValue": "...",
      "elegirOpcion": false,
      "key": '',
      "introDate": false,
      "setDate": 0,
      "change": '',
      "options": [],
      "noData": true
    };

    this.camposRegistro[fieldName] = newObject;
    this.defaultDataObjeto[fieldName] = newObject;
    this.setValueRoute(`${this.name}!${fieldName}`, value);

  }

  getDefaultObject() {
    return this.defaultDataObjeto;
  }

  setDefaultObject(objeto) {
    console.log(objeto)
    console.log(this.defaultDataObjeto)
  }

  loadDefaultObject() {
    this.camposRegistro = this.defaultDataObjeto
  }

  async addObjectFromRunCode(sq, clean = false) {
    let rstData = await runCode(sq);
    if (!rstData[0].resp) {
      this.setValue(this.name, {});
      this.removeAll();

      if (!rstData[0].ninguno) {
        rstData.forEach(value => {
          this.addObject(value, [], clean)
        })

        this.forEachField((campo, dato) => {
          this.setValueRoute(`${this.name}!${campo}`, dato.value);
        })
      } else {
        this.loadDefaultObject();
      }
    } else {
      console.error(rstData[0].msgError)
    }

  }

  async addObjectFromDBSelect(sql, clean = false) {
    let rstData = await dbSelect('s', sql)

    if (!rstData[0].resp) {
      this.setValue(this.name, {});

      if (!rstData[0].Ninguno) {
        rstData.forEach(value => {
          this.addObject(value, [], clean)
        })

        this.forEachField((campo, dato) => {
          this.setValueRoute(`${this.name}!${campo}`, dato.value);
        })
      } else {
        this.loadDefaultObject()
      }

    }

  }

  async addData(dataObj, objectNameValue, clean = false) {
    if (dataObj) {
      this.setValue(this.name, {});
      this.removeAll();

      this.addObject(dataObj, [], clean);
      this.forEachField((campo, dato) => {
        this.setValueRoute(`${this.name}!${campo}`, dato.value);
      })

      if (objectNameValue) {
        Object.keys(objectNameValue).forEach((val) => {
          if (this.camposRegistro[val]) {
            this.camposRegistro[val]['type'] = objectNameValue[val];
          }
        })
      }

    } else {
      console.error(rstData[0].msgError)
    }

  }

  createReactiveProxy(data) {
    const recursiveHandler = {
      get: (target, prop) => {
        const value = target[prop];
        if (typeof value === 'object' && value !== null) {
          return new Proxy(value, recursiveHandler); // Crear un nuevo Proxy para los objetos anidados
        }
        return value;
      },
      set: (target, prop, value) => {
        target[prop] = value;
        this.updateElementsWithDataValue(prop, value); // Actualizar elementos del DOM al cambiar el valor
        return true;
      },
    };

    if (!data) {
      data = {};
    }

    return new Proxy(data, recursiveHandler);
  }

  getValue(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.data;


    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }
    return valorActual;
  }

  getValueAll() {
    return this.data;
  }

  getValueFormat(camino, format) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
        if (format == 'pesos') {
          valorActual = formatNumber(valorActual, { symb: '$', type: 'currency' });
        }
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }
    return valorActual;
  }

  existValue(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.data;
    let existe = false;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        existe = true;
      }
    }
    return existe;
  }

  getDef(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.defaultData;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }

    return valorActual;
  }

  setValue(name, datos, menos) {
    if (typeof datos == 'object') {
      if (menos) {
        Object.keys(datos).forEach((key) => {
          const value = datos[key];
          if (key != menos) {
            this.data[name][key] = value;
          }
        });
      } else {
        this.data[name] = datos;
      }

      Object.keys(this.data[name]).forEach((key) => {
        const value = datos[key];
        this.updateElementsWithDataValue(`${name}!${key}`, value);
      });
    } else {
      this.data[name] = datos;
      this.updateElementsWithDataValue(`${name}`, datos);
    }
  }

  update(name, value) {
    this.data[this.name][name] = value;
    this.updateElementsWithDataValue(`${this.name}!${name}`, value);
  }

  setValueRoute(camino, nuevoValor) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let i = 0; i < propiedades.length - 1; i++) {
      const propiedad = propiedades[i];
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return; // No podemos acceder al camino completo, salimos sin hacer cambios
      }
    }


    const propiedadFinal = propiedades[propiedades.length - 1];
    valorActual[propiedadFinal] = nuevoValor;
    this.updateElementsWithDataValue(camino, nuevoValor);
  }

  setValueRouteUni(camino, nuevoValor) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let i = 0; i < propiedades.length - 1; i++) {
      const propiedad = propiedades[i];
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return; // No podemos acceder al camino completo, salimos sin hacer cambios
      }
    }


    const propiedadFinal = propiedades[propiedades.length - 1];
    valorActual[propiedadFinal] = nuevoValor;

  }

  setDefRoute(camino, nuevoValor) {
    const propiedades = camino.split('!');
    let valorActual = this.defaultData;

    for (let i = 0; i < propiedades.length - 1; i++) {
      const propiedad = propiedades[i];

      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return; // No podemos acceder al camino completo, salimos sin hacer cambios
      }
    }

    const propiedadFinal = propiedades[propiedades.length - 1];
    valorActual[propiedadFinal] = nuevoValor;
  }


  pushValue(name, obj, format = false) {
    const newdata = this.data[obj];
    this.data[name].push(newdata);
    if (this.defaultData[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.defaultData[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)

    }
  }

  cleanValue(obj, format = false) {
    if (this.defaultData[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.defaultData[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)

    } else {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            this.data[obj][key] = "";
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)
    }
  }

  // Actualiza los elementos vinculados a un atributo data-value cuando el dato cambia
  updateElementsWithDataValue(dataKey, value) {
    const componentDiv = document.querySelector(`#${this.name}`);
    const elementsWithDataValue = componentDiv.querySelectorAll(`[data-form="${dataKey}"]`);

    let typeObject = '';
    elementsWithDataValue.forEach((element) => {
      if (dataKey.includes('!')) {
        const [dataObj, dataProp] = dataKey.split('!');
        if (!this.data[dataObj]) {
          this.data[dataObj] = {};
        }
        if (!this.data[dataObj][dataProp]) {
          this.data[dataObj][dataProp] = value;
        }

        typeObject = this.camposRegistro[dataProp].type;

        if (element.type === 'checkbox') {
          element.checked = value ?? false;
        } else if (element.tagName === 'SELECT') {
          element.value = value ?? '';
        } else if (element.tagName === 'INPUT') {
          element.value = value ?? '';
        } else if (element.tagName === 'TEXTAREA') {
          element.textContent = value ?? '';
        } else {
          element.textContent = value ?? '';
        }
      } else {
        if (element.tagName === 'INPUT' && element.type !== 'checkbox') {
          element.value = value ?? '';
        } else if (element.tagName === 'SELECT') {
          element.value = value ?? '';
        } else if (element.type === 'checkbox') {
          element.checked = value ?? false;
        } else if (element.tagName === 'TEXTAREA') {
          element.textContent = value ?? '';
        } else {
          element.textContent = value;
        }
      }
    });
  }

  bindElementsWithDataValues(componentDiv) {
    let elementsWithDataValue;
    if (componentDiv) {
      elementsWithDataValue = componentDiv.querySelectorAll('[data-form]');
    } else {
      elementsWithDataValue = document.querySelectorAll('[data-form]');
    }

    elementsWithDataValue.forEach((element) => {
      const dataKey = element.getAttribute('data-form');
      const dataDefaul = element.getAttribute('data-default');
      const isUpperCase = element.getAttribute('data-UpperCase');
      let valorDefaul = '';



      if (dataKey.includes('!')) {
        const [dataObj, dataProp] = dataKey.split('!');
        if (!this.data[dataObj]) {
          this.data[dataObj] = {};
        }

        if (!this.data[dataObj][dataProp]) {
          this.data[dataObj][dataProp] = "";
        }

        if (dataDefaul) {
          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataObj]) {
            this.defaultData[dataObj] = {};
          }

          if (!this.defaultData[dataObj][dataProp]) {
            this.defaultData[dataObj][dataProp] = "";
          }
          this.defaultData[dataObj][dataProp] = valorDefaul;
          this.data[dataObj][dataProp] = valorDefaul;
        }



        if (element.tagName === 'SELECT') {

          const dataObj = dataKey.split('!')[0];
          this.data[dataObj][dataProp] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.value;
          });
        } else if (element.tagName === 'TEXTAREA') {
          const dataObj = dataKey.split('!')[0];
          this.data[dataObj][dataProp] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.value;
            console.log(event.target.value)
          });
        } else if (element.type === 'checkbox') {

          if (!this.data[dataObj][dataProp]) {
            this.data[dataObj][dataProp] = false;
          }
          element.checked = this.data[dataObj][dataProp] ?? false;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {

          if (element.getAttribute('data-change') !== 'currency') {
            element.value = this.data[dataObj][dataProp] ?? '';

            if (isUpperCase) {
              element.addEventListener('input', (event) => {
                const newValue = event.target.value.toUpperCase();
                this.data[dataObj][dataProp] = newValue;
                event.target.value = newValue;
              });
            } else {
              element.addEventListener('input', (event) => {
                this.data[dataObj][dataProp] = event.target.value;
              });
            }
          }
        } else {
          element.textContent = this.data[dataObj][dataProp] ?? '';
        }



      } else {

        if (dataDefaul) {

          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataKey]) {
            this.defaultData[dataKey] = '';
          }

          this.defaultData[dataKey] = valorDefaul;
          this.data[dataKey] = valorDefaul;
        }

        if (element.tagName === 'SELECT') {
          this.data[dataKey] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.value;
          });
        } else if (element.type === 'checkbox') {
          if (!this.data[dataKey]) {
            this.data[dataKey] = false;
          }
          element.checked = this.data[dataKey] || false;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {
          element.value = this.data[dataKey] || '';
          if (isUpperCase) {
            element.addEventListener('input', (event) => {
              const newValue = event.target.value.toUpperCase();
              this.data[dataKey] = newValue;
              event.target.value = newValue;
            });
          } else {
            element.addEventListener('input', (event) => {
              this.data[dataKey] = event.target.value;
            });
          }
        } else {
          element.textContent = this.data[dataKey] ?? '';
        }
      }

    });
  }

  transformarFechaHora(cadena) {
    // Divide la cadena en fecha y hora usando el espacio como separador
    const partes = cadena.split(' ');

    // Obtiene la fecha y la hora por separado
    const fecha = partes[0];
    const hora = partes[1];

    // Formatea la cadena en el nuevo formato deseado
    const nuevaCadena = `${fecha}T${hora}`;

    return nuevaCadena;
  }

  currency(value, element) {
    let newValue = formatNumberArray(value);
    element.target.value = newValue[2];
    this.setValueRouteUni(element.target.dataset.form, newValue[0]);
  }


  bindChangeEvents(componentDiv) {
    let elementsWithChange;
    let elementsWithOnChange;
    if (componentDiv) {
      elementsWithChange = componentDiv.querySelectorAll('[data-change]');
    } else {
      elementsWithChange = document.querySelectorAll('[data-change]');
    }

    elementsWithChange.forEach((element) => {
      const clickData = element.getAttribute('data-change');
      const [functionName, ...params] = clickData.split(',');
      if (functionName == 'currency') {
        element.addEventListener('change', (e) => {
          this.currency(e.target.value, e)

          const campos = e.target.dataset.form;
          const [...campo] = campos.split('!');
          if (this.getData(campo[1], 'change')) {
            this.executeFunctionByName(this.getData(campo[1], 'change'))
          }
        });

      } else {
        if (params) {
          element.addEventListener('change', () => this.executeFunctionByName(functionName, params));
        } else {
          element.addEventListener('change', () => this.executeFunctionByName(functionName));
        }
      }
    });

    if (componentDiv) {
      elementsWithOnChange = componentDiv.querySelectorAll('[data-onchange]');
    } else {
      elementsWithOnChange = document.querySelectorAll('[data-onchange]');
    }

    elementsWithOnChange.forEach((element) => {
      const clickData = element.getAttribute('data-onchange');
      const [functionName, ...params] = clickData.split(',');

      if (params) {
        element.addEventListener('change', (e) => this.executeFunctionByName(functionName, e, params));
      } else {
        element.addEventListener('change', (e) => this.executeFunctionByName(functionName, e));
      }

    });
  }

  capitalize(str) {
    // Verificar si la cadena está vacía o es nula
    if (!str) {
      return str;
    }

    // Capitalizar la primera letra y concatenar el resto de la cadena
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  labelCapitalize() {
    this.forEachField((field, key) => this.setData(field, 'name', this.capitalize(key.name)))
  }

  // Método para detectar el tipo de dato basado en el valor
  detectDataType(value) {
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return "number";
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
      return "datetime";
    } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
      return "datetime-local";
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return "date";
    } else if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)) {
      return "email";
    } else if (/^(http|https):\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?$/.test(value)) {
      return "url";
    }
    return "text";
  }

  createForm(data = {}) {
    let element;
    let form = '';
    const idElem = this.name;
    let columns = this.formClass.gridColumns;

    if (this.orderColumns.length > 0) {
      this.camposRegistro = this.reordenarClaves(this.camposRegistro, this.orderColumns)
    }


    if (!this.formElement) {
      element = document.querySelector(`#${idElem}`);
      this.formElement = element;
    } else {
      element = this.formElement;
    }

    this.formOptions = data;
    let nameForm = idElem;


    if (data.colorForm) {
      this.changeColorClass(data.colorForm);
    }

    if (this.type == 'modal') {
      this.nameModal = idElem;

      if (data.show == true) {
        element.classList.add('flex');
      } else {
        element.classList.add('hidden');
      }

      form += `<div id="${this.modalName}_mod" tabindex="-1" name="divModal" aria-hidden="true" class="${this.formClass.divModal}">
      <div name="modalContainer" class="${this.formClass.modalContainer}">
          <div name="divPadre" class="${this.formClass.divPadre}">`;

      form += `<div name="header" class="${this.formClass.header}">`
      form += `<div name="titleContainer" class="${this.formClass.titleContainer}">`;
      if (data.title) {
        form += `<h3 name="title" class="${this.formClass.title}">${data.title}</h3>`;
      }

      if ("subtitle" in data) {
        form += `<p name="subtitle" class="${this.formClass.subtitle}">${data.subtitle}</p>`;
      }
      if ("buttons" in data) {
        form += `<div>${data.buttons}</div>`;
      }
      form += '</div>'


      form += `<button name="btnCloseModal" data-modal="closeModal,#${this.modalName}" type="button" class="${this.formClass.btnCloseModal}">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
      </button>`

      form += `</div><form data-action="submit" data-inmodal="${this.nameModal}">`;

    } else {
      form += `<div name="divPadre" class="${this.formClass.divPadre}">`;

      if ("title" in data || "subtitle" in data || "buttons" in data) {
        form += `<div name="header" class="${this.formClass.header}">`
        if ("title" in data || "subtitle" in data) {
          form += `<div name="titleContainer" class="${this.formClass.titleContainer}">`;
          if ("title" in data) {
            form += `<h3 name="title" class="${this.formClass.title}">${data.title}</h3>`;
          }
          if ("subtitle" in data) {
            form += `<p name="subtitle" class="${this.formClass.subtitle}">${data.subtitle}</p>`;
          }
          form += '</div>';
        }

        if ("buttons" in data) {
          form += `${data.buttons}`;
        }
        form += '</div>'

      }

      form += `<form id="form_${nameForm}" data-action="submit">`
    }


    if ("columns" in data) {
      columns = `col-span-12 sm:col-span-${data.columns.sm ?? 6} 
      md:col-span-${data.columns.md ?? 4} 
      lg:col-span-${data.columns.lg ?? 3}`

    }


    form += `<div name="grid" class="${this.formClass.grid}">`;
    this.forEachField((campo, dato) => {
      let fieldElement = '';
      let dataValue = '';
      let colspan = '';
      let esrequired = '';
      let textRequired = '';
      let pattern = '';
      let onChange = '';
      let xClass = '';
      let dataUppercase = '';
      let attributes = '';
      let attributeClass = '';

      if (data.bind) {
        dataValue = `data-form="${data.bind}!${campo}"`;
      } else {
        dataValue = `data-form="${this.name}!${campo}"`;
      }

      if (dato.required == true) {
        esrequired = 'required';
        textRequired = `<span class='text-red-500 text-xs'>(req)</span>`
      }

      if (dato.pattern != '') {
        pattern = `pattern="${dato.pattern}"`;
      }

      if (dato.change != '') {
        onChange = `data-onchange="${dato.change}"`;
      }

      if (dato.class != '') {
        xClass = dato.class;
        if (xClass.includes('uppercase')) {
          dataUppercase = 'data-UpperCase="true"';
        }
      }

      if ('column' in dato) {
        if (dato.column != '') {
          colspan = `${dato.column}`
        } else {
          colspan = columns
        }
      } else {
        colspan = columns
      }

      if (dato.hidden == true) {
        colspan += ' hidden';
      }

      if (dato.attribute == 'readonly') {
        attributes = 'readonly tabindex="-1"';
        attributeClass = this.formClass.inputDisable;
      } else if (dato.attribute == 'locked') {
        attributeClass = this.formClass.input;
        attributes = 'readonly tabindex="-1"';
      } else {
        attributeClass = this.formClass.input;
        attributes = '';
      }



      if (dato.type === 'select') {
        let haySelected = false;
        let options = dato.options.map(option => {
          if (option.value == dato.value || option.value == dato.defaultValue) {
            if (dato.elegirOpcion == true) {
              return `<option value="${option.value}">${option.label}</option>`
            } else {
              haySelected = true;
              return `<option value="${option.value}" selected>${option.label}</option>`
            }
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');

        if (!haySelected) {
          options = `<option value="" disabled selected>Elegir...</option>${options}`
          if (!dato.required) {
            esrequired = 'required';
            textRequired = `<span class='text-red-500 text-xs'>(req)</span>`
          }
        }

        fieldElement = `
        <div class="${colspan}">
          <label for="${nameForm}_${campo}" class="${this.formClass.label}">${dato.name} ${textRequired}</label>
          <select id="${nameForm}_${campo}" ${dataValue} ${onChange} class="${this.formClass.select} ${xClass}" ${esrequired}>
            ${options}
          </select>
        </div>`;
      } else if (dato.type === 'datalist') {
        const options = dato.options.map(option => {
          if ((option.value == dato.value && dato.elegirOpcion == false) || option.value == dato.defaultValue) {
            return `<option value="${option.value}" selected>${option.label}</option>`
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');

        fieldElement = `
        <div class="${colspan}">
        <label for="${nameForm}_${campo}" class="${this.formClass.label}">${dato.name} ${textRequired}</label>
        <input type="text" autocomplete="off" list="lista-${campo}" ${onChange} id="${nameForm}_${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${attributes} class="${attributeClass} ${xClass}">
          <datalist id="lista-${campo}">
            ${options}
          </datalist>
        </div>`;
      } else if (dato.type === 'checkbox') {
        fieldElement = `
          <div class="${colspan}">
            <input type="checkbox" id="${nameForm}_${campo}" ${dataValue} ${onChange} ${esrequired} class="${this.formClass.checkbox}" ${dato.value ? 'checked' : ''}>
            <label class="${this.formClass.labelCheckbox}" for="${nameForm}_${campo}">${dato.name} ${textRequired}</label>
          </div>
        `;
      } else if (dato.type === 'textarea') {
        fieldElement = `
          <div class="${colspan}">
            <label for="${nameForm}_${campo}" class="${this.formClass.label}">${dato.name} ${textRequired}</label>
            <textarea id="${nameForm}_${campo}" ${dataValue} ${esrequired} ${onChange} ${pattern} ${attributes} rows="${dato.rows}" class="${this.formClass.textarea} ${xClass}">${dato.value}</textarea>
          </div>
        `;
      } else if (dato.type === 'currency') {
        fieldElement = `
          <div class="${colspan}">
            <label for="${nameForm}_${campo}" class="${this.formClass.label}">${dato.name} ${textRequired}</label>
            <input type="text" autocomplete="off" data-change="currency" id="${nameForm}_${campo}" ${dataValue} ${esrequired} ${pattern} value="${formatNumberArray(dato.value)[2]}" ${attributes} class="${attributeClass} ${xClass}">
          </div>
        `;
      } else {

        fieldElement = `
          <div class="${colspan}">
            <label for="${nameForm}_${campo}" class="${this.formClass.label}">${dato.name} ${textRequired}</label>
            <input type="${dato.type}" autocomplete="off" id="${nameForm}_${campo}" ${dataValue} ${dataUppercase} ${onChange} ${esrequired} ${pattern} value="${dato.value}" ${attributes} class="${attributeClass} ${xClass}">
          </div>
        `;
      }

      form += fieldElement;
    });

    form += `</div>`;

    if (data.submit || data.delete) {
      form += `<div class="${this.formClass.containerButtons}">`;

      if (data.submit) {
        form += ` <button type="submit" class="${this.formClass.submit}">${data.submit}</button>`;
      }

      if (data.delete) {
        form += ` <button type="button" data-formclick="delete" class="${this.formClass.delete}">${data.delete}</button>`;
      }

      form += `</div>`;
    }

    if (this.type == 'modal') {
      form += `</form></div></div></div>`
    } else {
      form += '</form>'
    }


    element.innerHTML = form;
    this.bindSubmitEvents(element);
    this.bindFormClickEvent(element);
    this.bindClickEvent(element);
    this.bindClickModal(element);
    this.bindElementsWithDataValues(element);
    this.bindChangeEvents(element);
    this.executeFunctionByName('onMount');
    if (this.focus) {
      let elemnetFocus = document.querySelector(`#${nameForm}_${this.focus}`);
      elemnetFocus.focus();
    }
    return form;

  }

  


  // Vincula los eventos submit del formulario con sus functions personalizadas
  bindSubmitEvents(componentDiv) {
    let forms;
    if (componentDiv) {
      forms = componentDiv.querySelectorAll('form[data-action]');
    } else {
      forms = document.querySelectorAll('form[data-action]');
    }

    forms.forEach((form) => {
      const functionName = form.getAttribute('data-action');
      let modalName = '';

      if (form.getAttribute('data-inmodal')) {
        modalName = form.getAttribute('data-inmodal');
        this.modalName = modalName;
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario  
        this.executeFunctionByName(functionName, event, modalName)

      });

      form.addEventListener('keypress', function (event, element) {
        // Verificamos si la tecla presionada es "Enter" (código 13)
        if (event.keyCode === 13) {
          // Prevenimos la acción predeterminada (envío del formulario)
          // event.preventDefault();

          // Obtenemos el elemento activo (el que tiene el foco)
          const elementoActivo = document.activeElement;

          if (elementoActivo.type == 'submit') {
            event.preventDefault();
            elementoActivo.click();
          } else if (elementoActivo.type == 'textarea') {
            // let textus = elementoActivo.value;
            // textus = textus.replace(/\n/g, '\\n');
            // console.log(textus)
          } else {
            event.preventDefault();
            // Obtenemos la lista de elementos del formulario
            // const elementosFormulario = form.elements;
            const elementosFormulario = Array.from(form.elements).filter(elemento => !elemento.readOnly);


            // Buscamos el índice del elemento activo en la lista
            const indiceElementoActivo = Array.prototype.indexOf.call(elementosFormulario, elementoActivo);

            // Movemos el foco al siguiente elemento del formulario
            const siguienteElemento = elementosFormulario[indiceElementoActivo + 1];
            if (siguienteElemento) {
              siguienteElemento.focus();
            }

          }

        }
      });
    });
  }


  bindClickModal(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-modal]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-modal]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-modal');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  bindFormClickEvent(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-formclick]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-formclick]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-formclick');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  bindClickEvent(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-click]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-click]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-click');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  // Ejecuta una función pasando el nombre como string
  executeFunctionByName(functionName, ...args) {
    if (this.functions && typeof this.functions[functionName] === 'function') {
      const func = this.functions[functionName];
      func(...args);
    } else {
      console.error(`La función '${functionName}' no está definida en el Objeto Form.`);

    }
  }
}

export class DataArray {
  constructor(name, refTmn, initial = { fields: [], initialData: [] }) {
    this.from = 1;
    this.recordsPerView = 10;
    this.paginations = true;
    this.data = this.createReactiveProxy(initial.fields);
    this.tmn = refTmn;
    this.name = name || 'newTable';
    this.tableOptions = {};
    this.tableElement = '';
    this.functions = {};
    this.loader = false;
    this.structure = [];
    this.searchValue = '';
    this.searchColumns = [];
    this.orderColumns = [];
    this.widthColumns = [];
    this.widthTable = 'w-full';
    this.widthPadre = 'w-full';
    this.arrayOrder = [];
    this.defaultDataRow = {};
    this.dataArray = initial.initialData.map(item => {
      const newItem = {};
      initial.fields.forEach(field => {
        newItem[field] = {
          "type": "text",
          "name": field,
          "required": false,
          "placeholder": "",
          "value": "",
          "column": 1,
          "attribute": 0,
          "hidden": false,
          "defaultValue": "...",
          "elegirOpcion": false,
          "key": "",
          "introDate": false,
          "setDate": 0,
          "change": '',
          "data": []
        };
      });
      return newItem;
    });

    this.tableClass = defaultClass().table;
    this.initCss();
  }

  initCss(){
    // Obtén el elemento por su ID
    const element = document.getElementById('initcss');
    let existe = false;
    
    // Verifica si el elemento existe
    if (element) {
        existe = true;
    } else {
        existe = false;
    }

    if(!existe){
      const styleTag = document.createElement('style');
      styleTag.id = "initcss";
          
          // Agregar estilos al elemento
          styleTag.textContent = `
          :root {
            --emerald-800: #065f46;
            --emerald-700: #047857;
            --neutral-900: #171717;
            --neutral-800: #262626;
            --neutral-100: #f5f5f5;
            --neutral-200: #e5e5e5;
            --neutral-300: #D4D4D4;
            --sky-700: #0369A1;
            --sky-500: #0EA5E9;
          }
          
          /* Estiliza la barra de desplazamiento vertical */
          ::-webkit-scrollbar {
            background: var(--neutral-100);
            width: 16px;
            height: 14px;
          }
          
          ::-webkit-scrollbar-track {
            background: var(--neutral-100);
          }
          
          ::-webkit-scrollbar-thumb {
            background-color: var(--neutral-200);
            border-radius: 20px;
            border: 4px solid var(--neutral-100);
          }
          
          /* Estilo de la barra de desplazamiento en modo oscuro */
          html.dark ::-webkit-scrollbar {
            background: var(--neutral-900);
            width: 16px;
            height: 14px;
          }
          
          html.dark ::-webkit-scrollbar-track {
            background: var(--neutral-900); /* Cambia el color de fondo en modo oscuro */
          }
          
          html.dark ::-webkit-scrollbar-thumb {
            background-color: var(--neutral-800); /* Cambia el color del pulgar en modo oscuro */
            border: 4px solid var(--neutral-900); /* Cambia el color del borde en modo oscuro */
          }
          
          /* Estilo para el cuadro de expansión de textarea */
          
          textarea::-webkit-resizer {
            background-color: var(--neutral-200); /* Color de fondo */
            border-top: 5px solid var(--neutral-100);
            border-left: 5px solid var(--neutral-100);
            border-right: 5px solid var(--sky-500);
            border-bottom: 5px solid var(--sky-500);
          }

          html.dark textarea::-webkit-resizer {
            background-color: var(--neutral-800); 
            border-top: 5px solid var(--neutral-800);
            border-left: 5px solid var(--neutral-800);
            border-right: 5px solid var(--sky-700);
            border-bottom: 5px solid var(--sky-700);
          }
          

          @-webkit-keyframes fadeIn {
            0% { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            to { opacity: 1; }
          }
          .fadeIn {
            -webkit-animation-name: fadeIn;
            animation-name: fadeIn;
            -webkit-animation-duration: 0.5s;
            animation-duration: 0.5s;
          }
          `;
  
          // Agregar el elemento <style> al <head>
          document.head.appendChild(styleTag);
    }
  }

  createReactiveProxy(data) {
    const recursiveHandler = {
      get: (target, prop) => {
        const value = target[prop];
        if (typeof value === 'object' && value !== null) {
          return new Proxy(value, recursiveHandler); // Crear un nuevo Proxy para los objetos anidados
        }
        return value;
      },
      set: (target, prop, value) => {
        target[prop] = value;
        this.updateElementsWithDataValue(prop, value); // Actualizar elementos del DOM al cambiar el valor
        return true;
      },
    };

    if (!data) {
      data = {};
    }

    return new Proxy(data, recursiveHandler);
  }

  

  getValue(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }
    return valorActual;
  }

  getValueFormat(camino, format) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
        if (format == 'pesos') {
          valorActual = formatNumber(valorActual, { symb: '$', type: 'currency' });
        }
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }
    return valorActual;
  }

  existValue(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.data;
    let existe = false;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        existe = true;
      }
    }
    return existe;
  }

  getDef(camino) {
    const propiedades = camino.split('!');
    let valorActual = this.defaultData;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }

    return valorActual;
  }

  setValue(name, datos, menos) {
    if (typeof datos == 'object') {
      if (menos) {
        Object.keys(datos).forEach((key) => {
          const value = datos[key];
          if (key != menos) {
            this.data[name][key] = value;
          }
        });
      } else {
        this.data[name] = datos;
      }

      Object.keys(this.data[name]).forEach((key) => {
        const value = datos[key];
        this.updateElementsWithDataValue(`${name}!${key}`, value);
      });
    } else {
      this.data[name] = datos;
      this.updateElementsWithDataValue(`${name}`, datos);
    }
  }

  setValueRoute(camino, nuevoValor) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let i = 0; i < propiedades.length - 1; i++) {
      const propiedad = propiedades[i];
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return; // No podemos acceder al camino completo, salimos sin hacer cambios
      }
    }


    const propiedadFinal = propiedades[propiedades.length - 1];
    valorActual[propiedadFinal] = nuevoValor;
    this.updateElementsWithDataValue(camino, nuevoValor);
  }

  setDefRoute(camino, nuevoValor) {
    const propiedades = camino.split('!');
    let valorActual = this.defaultData;

    for (let i = 0; i < propiedades.length - 1; i++) {
      const propiedad = propiedades[i];

      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return; // No podemos acceder al camino completo, salimos sin hacer cambios
      }
    }

    const propiedadFinal = propiedades[propiedades.length - 1];
    valorActual[propiedadFinal] = nuevoValor;
  }


  pushValue(name, obj, format = false) {
    const newdata = this.data[obj];
    this.data[name].push(newdata);
    if (this.defaultData[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.defaultData[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)

    }
  }

  cleanValue(obj, format = false) {
    if (this.defaultData[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.defaultData[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)

    } else {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            this.data[obj][key] = "";
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)
    }
  }

  // Actualiza los elementos vinculados a un atributo data-value cuando el dato cambia
  updateElementsWithDataValue(dataKey, value) {
    const componentDiv = document.querySelector(`#${this.name}`);
    const elementsWithDataValue = componentDiv.querySelectorAll(`[data-value="${dataKey}"]`);

    let typeObject = '';
    elementsWithDataValue.forEach((element) => {
      if (dataKey.includes('!')) {
        const [dataObj, dataProp] = dataKey.split('!');
        if (!this.data[dataObj]) {
          this.data[dataObj] = {};
        }
        if (!this.data[dataObj][dataProp]) {
          this.data[dataObj][dataProp] = value;
        }

        typeObject = this.camposRegistro[dataProp].type;

        // if(typeObject == 'datetime-local'){
        //   value = this.transformarFechaHora(value)
        // }

        if (element.type === 'checkbox') {
          element.checked = value ?? false;
        } else if (element.tagName === 'SELECT') {
          element.value = value ?? '';
        } else if (element.tagName === 'INPUT') {
          element.value = value ?? '';
        } else {
          element.textContent = value ?? '';
        }
      } else {
        if (element.tagName === 'INPUT' && element.type !== 'checkbox') {
          element.value = value ?? '';
        } else if (element.tagName === 'SELECT') {
          element.value = value ?? '';
        } else if (element.type === 'checkbox') {
          element.checked = value ?? false;
        } else {
          element.textContent = value;
        }
      }
    });
  }

  bindElementsWithDataValues(componentDiv) {
    let elementsWithDataValue;
    if (componentDiv) {
      elementsWithDataValue = componentDiv.querySelectorAll('[data-value]');
    } else {
      elementsWithDataValue = document.querySelectorAll('[data-value]');
    }

    elementsWithDataValue.forEach((element) => {
      const dataKey = element.getAttribute('data-value');
      const dataDefaul = element.getAttribute('data-default');
      const isUpperCase = element.getAttribute('data-UpperCase');
      let valorDefaul = '';


      if (dataKey.includes('!')) {
        const [dataObj, dataProp] = dataKey.split('!');
        if (!this.data[dataObj]) {
          this.data[dataObj] = {};
        }

        if (!this.data[dataObj][dataProp]) {
          this.data[dataObj][dataProp] = "";
        }

        if (dataDefaul) {
          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataObj]) {
            this.defaultData[dataObj] = {};
          }

          if (!this.defaultData[dataObj][dataProp]) {
            this.defaultData[dataObj][dataProp] = "";
          }
          this.defaultData[dataObj][dataProp] = valorDefaul;
          this.data[dataObj][dataProp] = valorDefaul;
        }


        if (element.tagName === 'SELECT') {

          const dataObj = dataKey.split('!')[0];
          this.data[dataObj][dataProp] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.value;
          });
        } else if (element.type === 'checkbox') {

          if (!this.data[dataObj][dataProp]) {
            this.data[dataObj][dataProp] = false;
          }
          element.checked = this.data[dataObj][dataProp] ?? false;

          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {
          element.value = this.data[dataObj][dataProp] ?? '';

          if (isUpperCase) {
            element.addEventListener('input', (event) => {
              const newValue = event.target.value.toUpperCase();
              this.data[dataObj][dataProp] = newValue;
              event.target.value = newValue;
            });
          } else {
            element.addEventListener('input', (event) => {
              this.data[dataObj][dataProp] = event.target.value;
            });
          }
        } else {
          element.textContent = this.data[dataObj][dataProp] ?? '';
        }

      } else {

        if (dataDefaul) {

          if (dataDefaul.startsWith('#')) {
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.defaultData[dataKey]) {
            this.defaultData[dataKey] = '';
          }


          this.defaultData[dataKey] = valorDefaul;
          this.data[dataKey] = valorDefaul;
        }

        if (element.tagName === 'SELECT') {
          this.data[dataKey] = element.value;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.value;
          });
        } else if (element.type === 'checkbox') {
          if (!this.data[dataKey]) {
            this.data[dataKey] = false;
          }
          element.checked = this.data[dataKey] || false;

          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.checked;
          });
        } else if (element.tagName === 'INPUT') {
          element.value = this.data[dataKey] || '';
          if (isUpperCase) {
            element.addEventListener('input', (event) => {
              const newValue = event.target.value.toUpperCase();
              this.data[dataKey] = newValue;
              event.target.value = newValue;
            });
          } else {
            element.addEventListener('input', (event) => {
              this.data[dataKey] = event.target.value;
            });
          }
        } else {
          element.textContent = this.data[dataKey] ?? '';
        }
      }

    });
  }

  setClass(obj) {
    this.tableClass = obj;
  }

  getClass() {
    return this.tableClass;
  }

  setClassItem(item, str) {
    this.tableClass[item] = str;
  }

  getClassItem(item) {
    return this.tableClass[item];
  }

  changeColorClass(color) {
    Object.keys(this.tableClass).forEach((tipo) => {
      let inClass = this.tableClass[tipo];
      let outClass = inClass.replaceAll('neutral', color)
      this.tableClass[tipo] = outClass;
    })
  }

  setClassItemAdd(item, newClass) {
    this.tableClass[item] += ` ${newClass}`
  }

  setClassItemChange(item, theClass, newClass) {
    let inClass = this.tableClass[item];
    let outClass = inClass.replaceAll(theClass, newClass);
    this.tableClass[item] = outClass;
  }


  setData(index, fieldName, key, value) {
    if (this.dataArray[index] && this.dataArray[index][fieldName]) {
      this.dataArray[index][fieldName][key] = value;
    }
  }

  setDataObject(key, updates) {
    // Check if the key exists in the data object
    if (this.data.hasOwnProperty(key)) {
      // Get the object corresponding to the key
      const dataObject = this.data[key];

      // Update the properties based on the provided updates
      for (const prop in updates) {
        if (updates.hasOwnProperty(prop) && dataObject.hasOwnProperty(prop)) {
          dataObject[prop] = updates[prop];
        }
      }

      // Update the DOM elements associated with the modified data
      this.updateElementsWithDataValue(key, dataObject);
    } else {
      console.error(`Key '${key}' does not exist in the data object.`);
    }
  }

  getFunction() {
    console.log(this.functions);
  }

  setFunction(name, fn) {
    this.functions[name] = fn
  }

  getStructure() {
    return this.structure;
  }

  async setStructure(table, reset = false) {
    let ejecute = false;
    if (this.structure.length == 0 || reset == true) {
      ejecute = true;
    } else {
      return true
    }

    if (ejecute) {
      let struc = await structure('t', table);

      if (!struc[0].resp) {
        let defaultRow = {}
        const newObject = {};
        let groupType = {};
        let primaryKey = {};
        const newStruc = []

        struc.forEach(data => {
          data.table = table;
          data.COLUMN_NAME = data.COLUMN_NAME.toLowerCase()
          newStruc.push(data);
        })

        this.structure = newStruc;

        newStruc.forEach(val => {
          let name = val.COLUMN_NAME;
          groupType[val.COLUMN_NAME] = this.typeToType(val.DATA_TYPE);
          primaryKey[val.COLUMN_NAME] = val.COLUMN_KEY;
          defaultRow[name] = '0';
        })


        for (const fieldName in defaultRow) {
          if (defaultRow.hasOwnProperty(fieldName)) {
            let value = defaultRow[fieldName];
            let type = '';
            let key = '';

            if (fieldName in groupType) {
              type = groupType[fieldName];
            }

            if (fieldName in primaryKey) {
              key = primaryKey[fieldName];
            }

            if (type == 'number') {
              value = 0;
            } else {
              value = '';
            }


            newObject[fieldName] = {
              "type": type,
              "name": fieldName,
              "required": false,
              "placeholder": "",
              "value": value,
              "column": "",
              "rows": "3",
              "attribute": 0,
              "hidden": false,
              "pattern": '',
              "class": '',
              "defaultValue": "...",
              "elegirOpcion": false,
              "key": key,
              "introDate": false,
              "setDate": 0,
              "change": '',
              "options": [],
              "noData": false,
              "validate": ''
            };
          }
        }

        this.defaultDataRow = newObject;
        return true
      } else {
        console.error(struc[0].msgError)
        return false
      }
    }
  }

  async addStructure(table) {
    let struc = await structure('t', table);
    if (!struc[0].resp) {
      const newStruc = []
      struc.forEach(data => {
        data.table = table;
        newStruc.push(data);
      })
      const arrayCombinado = this.structure.concat(newStruc);
      const conjuntoUnico = new Set(arrayCombinado.map(objeto => JSON.stringify(objeto)));
      this.structure = Array.from(conjuntoUnico).map(JSON.parse);
      console.log('addStructure', this.structure)
      return true
    } else {
      console.error(struc);
      return false
    }

  }

  reordenarClaves(objeto, orden) {
    const resultado = {};
    orden.forEach((clave) => {
      if (objeto.hasOwnProperty(clave)) {
        resultado[clave] = objeto[clave];
      } else {
        resultado[clave] = {
          "type": 'text',
          "name": clave,
          "required": false,
          "placeholder": "",
          "value": ' - ',
          "column": "",
          "rows": "3",
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "class": '',
          "defaultValue": "...",
          "elegirOpcion": false,
          "key": "",
          "introDate": false,
          "setDate": 0,
          "change": '',
          "options": [],
          "noData": false,
          "validate": ''
        };
      }
    });
    return resultado;
  }

  getData(index, fieldName, key) {
    if (this.dataArray[index] && this.dataArray[index][fieldName]) {
      return this.dataArray[index][fieldName][key];
    }
    return undefined;
  }

  setDataGroup(index, fieldNames, key, value) {
    const id = parseInt(index)
    if (this.dataArray[id]) {
      fieldNames.forEach(fieldName => {
        if (this.dataArray[id][fieldName]) {
          this.dataArray[id][fieldName][key] = value;
        }
      });
    }
  }

  getDataGroup(index, fieldNames, key) {
    const id = parseInt(index)
    const dataGroup = {};
    if (this.dataArray[id]) {
      fieldNames.forEach(fieldName => {
        if (this.dataArray[id][fieldName]) {
          dataGroup[fieldName] = this.dataArray[id][fieldName][key];
        }
      });
    }
    return dataGroup;
  }

  getDataObjectForIndex(index) {
    const id = parseInt(index)
    return this.dataArray[id];
  }

  getDataObjectForKey(index, key) {
    const id = parseInt(index)
    const newObject = {};
    Object.keys(this.dataArray[id]).forEach(data => {
      newObject[data] = this.dataArray[id][data][key];
    })
    return newObject;
  }

  getDataAll() {
    return this.dataArray;
  }

  getDataAllKeys(key) {
    const newArray = [];
    this.dataArray.forEach((obj, index) => {
      let newObject = {}
      Object.keys(obj).forEach(data => {
        newObject[data] = this.dataArray[index][data][key];
      })
      newArray.push(newObject)
    })
    return newArray
  }

  getCountAtPositionZero() {
    if (this.orderColumns.length > 0) {
      return this.orderColumns.length
    } else {
      if (this.dataArray.length > 0) {
        const firstPositionObject = this.dataArray[0];
        return Object.keys(firstPositionObject).length;
      } else {
        return 0; // Si no hay objetos en la posición 0, retornamos 0
      }
    }
  }

  typeToType(inType = 'text') {
    let outType;
    if (inType == 'int') outType = 'number';
    if (inType == 'tinyint') outType = 'number';
    if (inType == 'double') outType = 'number';
    if (inType == 'char') outType = 'text';
    if (inType == 'varchar') outType = 'text';
    if (inType == 'datetime') outType = 'datetime-local';
    if (inType == 'timestamp') outType = 'datetime-local';
    if (inType == 'date') outType = 'date';
    if (inType == 'time') outType = 'time';
    if (inType == 'decimal') outType = 'currency';
    if (inType == 'text') outType = 'text';
    if (inType == 'longtext') outType = 'text';

    if (!outType) {
      console.error(`inType ${inType} no definido!`)
      outType = 'text'
    }

    return outType
  }

  setDataKeys(key, objectNameValue) {
    this.dataArray.forEach((item, index) => {
      Object.keys(objectNameValue).forEach((val) => {
        if (this.dataArray[index][val]) {
          this.dataArray[index][val][key] = objectNameValue[val];
        }
      })

    });
  }

  // Nuevo método para recorrer y aplicar una función a cada elemento del array
  forEachItem(callback) {
    this.dataArray.forEach((item, index) => {
      callback(item, index);
    });
  }

  // Nuevo método para agregar objetos al array y completar campos
  addObject(dataObject, structure = [], clean = false) {
    const newObject = {};
    let groupType = {};
    let primaryKey = {};

    if (structure.length > 0) {
      structure.forEach(val => {
        let name = val.COLUMN_NAME.toLowerCase()
        groupType[name] = this.typeToType(val.DATA_TYPE);
        primaryKey[name] = val.COLUMN_KEY;
      })
    } else {
      if (this.structure.length > 0) {
        this.structure.forEach(val => {
          let name = val.COLUMN_NAME.toLowerCase()
          groupType[name] = this.typeToType(val.DATA_TYPE);
          primaryKey[name] = val.COLUMN_KEY;
        })
      }
    }

    for (const fieldName in dataObject) {
      if (dataObject.hasOwnProperty(fieldName)) {
        let value = dataObject[fieldName];
        let type = this.detectDataType(value);
        let key = '';

        if (type == 'datetime') {
          value = formatDate(new Date(value)).fechaHora;
        }

        if (clean == true) {
          if (type == 'number') {
            value = 0;
          } else {
            value = '';
          }
        }

        if (fieldName in groupType) {
          type = groupType[fieldName];
        }

        if (fieldName in primaryKey) {
          key = primaryKey[fieldName];
        }

        newObject[fieldName] = {
          "type": type,
          "name": fieldName,
          "required": false,
          "placeholder": "",
          "value": value,
          "column": "",
          "rows": "3",
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "class": '',
          "defaultValue": "...",
          "elegirOpcion": false,
          "key": key,
          "introDate": false,
          "setDate": 0,
          "change": '',
          "options": [],
          "noData": false,
          "validate": ''
        };
      }
    }

    this.dataArray.push(newObject);
  }

  getDefaultRow() {
    return this.defaultDataRow;
  }

  setDefaultRow(dataObject) {
    const newObject = {};
    let groupType = {};
    let primaryKey = {};

    if (this.structure.length > 0) {
      this.structure.forEach(val => {
        groupType[val.column_name] = this.typeToType(val.data_type);
        primaryKey[val.column_name] = val.column_key;
      })
    }

    for (const fieldName in dataObject) {
      if (dataObject.hasOwnProperty(fieldName)) {
        let value = dataObject[fieldName];
        let type = this.detectDataType(value);
        let key = '';

        if (fieldName in groupType) {
          type = groupType[fieldName];
        }

        if (fieldName in primaryKey) {
          key = primaryKey[fieldName];
        }

        if (type == 'number') {
          value = 0;
        } else {
          value = '';
        }


        newObject[fieldName] = {
          "type": type,
          "name": fieldName,
          "required": false,
          "placeholder": "",
          "value": value,
          "column": "",
          "rows": "3",
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "class": '',
          "defaultValue": "...",
          "elegirOpcion": false,
          "key": key,
          "introDate": false,
          "setDate": 0,
          "change": '',
          "options": [],
          "noData": false,
          "validate": ''
        };
      }
    }

    this.defaultDataRow = newObject;
  }

  async addObjectFromDBSelect(sql) {
    let rstData = await dbSelect('s', sql)
    if (!rstData[0].resp) {

      if (!rstData[0].Ninguno) {
        this.removeAll();
        this.from = 1;
        this.setDefaultRow(rstData[0]);
        rstData.forEach(reg => {
          this.addObject(reg)
        });
      } else {
        this.loadDefaultRow();
      }
    } else {
      console.error(rstData[0].msgError)
    }
  }

  async addObjectFromRunCode(sq) {
    let rstData = await runCode(sq);
    //console.log(rstData)
    if (!rstData[0].resp) {
      if (!rstData[0].Ninguno) {
        this.removeAll();
        this.from = 1;
        this.setDefaultRow(rstData[0]);
        rstData.forEach(reg => {
          this.addObject(reg)
        });
      } else {
        this.loadDefaultRow();
      }
    } else {
      console.error(rstData[0].msgError)
    }
  }

  addObjectFromArray(arr) {
    let rstData = arr;

    if (rstData.length > 0) {
      if (!rstData[0].resp) {
        if (!rstData[0].Ninguno) {
          this.removeAll();
          this.from = 1;
          this.setDefaultRow(rstData[0]);
          rstData.forEach(reg => {
            this.addObject(reg)
          });
        } else {
          this.loadDefaultRow();
        }
      } else {
        console.error(rstData[0].msgError)
      }
    } else {
      console.error('Not rstData');
      this.loadDefaultRow();
    }
  }

  // Método para detectar el tipo de dato basado en el valor
  detectDataType(value) {
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return "number";
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
      return "datetime";
    } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
      return "datetime-local";
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return "date";
    } else if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)) {
      return "email";
    } else if (/^(http|https):\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?$/.test(value)) {
      return "url";
    }
    return "text";
  }

  formatValueByDataType(value, newType = '') {
    let dataType = this.detectDataType(value);

    if (newType != '') {
      dataType = newType;
    }

    if (dataType == 'text' && value == null) value = '';
    switch (dataType) {
      case "number":
        // Formatear número (decimal) con estilo numérico español
        return formatNumber(value);
      case "number-cero":
        // Formatear número (decimal) con estilo numérico español
        return formatNumber(value, { type: 'currency', cero: '-', decimales: 0 });
      case "currency":
        // Formatear número (decimal) con estilo numérico español
        return formatNumber(value, { type: 'currency' });
      case "currency-cero":
        // Formatear número (decimal) con estilo numérico español
        return formatNumber(value, { type: 'currency', cero: '-' });
      case "pesos":
        // Formatear número (decimal) con estilo numérico español
        // return parseFloat(value).toLocaleString('es-ES', { maximumFractionDigits: 2 });
        return formatNumber(value, { type: 'currency', symb: '$' });
      case "datetime-local":
        // Formatear fecha y hora
        const datetime = new Date(value);
        return datetime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
          ' ' + datetime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      case "date":
        // Formatear fecha
        const date = new Date(value + ' 00:00:00');
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      // Agregar más casos según los tipos de datos necesarios
      default:
        return value;
    }
  }

  removeObjectIndex(index) {
    if (index >= 0 && index < this.dataArray.length) {
      this.dataArray.splice(index, 1);
    }
  }

  removeObjectWhere(condition) {
    this.dataArray = this.dataArray.filter(item => !condition(item));
  }

  removeAll() {
    this.dataArray = [];
  }

  loadDefaultRow() {
    this.dataArray = [];
    this.dataArray.push(this.defaultDataRow);
  }

  resetFrom() {
    this.from = 1
  }


  // Nuevo método para obtener los nombres de las claves de un objeto
  getKeys(index) {
    if (this.dataArray[index]) {
      return Object.keys(this.dataArray[index]);
    }
    return [];
  }

  loadingBody() {
    const name = this.name;
    let tabla;

    if (!this.tableElement) {
      tabla = document.querySelector(`#${name}`);
    } else {
      tabla = this.tableElement;
    }

    const body = tabla.querySelector('tbody');
    const rows = this.recordsPerView;
    const cols = this.getCountAtPositionZero();
    let bodyLoading = ''
    body.innerHTML = "";

    for (let i = 0; i < rows; i++) {
      if (i % 2 === 0) {
        bodyLoading += `<tr class="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-200/50 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200">`;
      } else {
        bodyLoading += `<tr class="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200">`;
      }

      for (let j = 0; j < cols; j++) {
        bodyLoading += `<td class="px-4 py-3 select-none whitespace-nowrap w-10 text-semibold">
          <div class="select-none w-32 h-3 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
        </td>`
      }
      bodyLoading += `</tr>`;
    }

    body.innerHTML = bodyLoading;

  }

  loadingTable(rows = 2, cols = 5) {
    const name = this.name;
    let tabla, divContainer;

    if (this.loader) {
      if (!this.tableElement) {
        divContainer = document.querySelector(`#${name}`);
      } else {
        divContainer = this.tableElement;
      }

      tabla = `<table name="table" class="w-full text-sm text-left text-neutral-500 dark:text-neutral-400">
      <thead name="thead" class="bg-neutral-400/30 text-neutral-500 dark:text-neutral-600 border-b border-neutral-300 dark:bg-neutral-900/30 dark:border-neutral-600">
      <tr class="text-md font-semibold">`;

      for (let j = 0; j < cols; j++) {
        tabla += `<th scope="col" class="px-4 py-3 select-none text-xs text-neutral-500 uppercase dark:text-neutral-500 whitespace-nowrap text-left">
          <div class="select-none w-32 h-3 bg-gray-100 rounded-full dark:bg-gray-700 "></div>
        </th>`
      }

      tabla += `</tr></thead>
      <tbody>`

      for (let i = 0; i < rows; i++) {
        if (i % 2 === 0) {
          tabla += `<tr class="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 ">`;
        } else {
          tabla += `<tr class="border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/50 ">`;
        }

        for (let j = 0; j < cols; j++) {
          tabla += `<td class="px-4 py-3 select-none whitespace-nowrap w-10 text-semibold">
            <div class="select-none w-32 h-3 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
          </td>`
        }
        tabla += `</tr>`;
      }

      tabla += `</tbody> </table>`
      divContainer.innerHTML = tabla;
    }
  }


  buscarYResaltar(componentDiv) {
    // Obtén la tabla
    let busqueda = this.searchValue ? this.searchValue.toLowerCase() : '';
    const tabla = componentDiv.querySelector('tbody');

    // Recorre las filas de la tabla
    for (var i = 0; i < tabla.rows.length; i++) {
      // Recorre las celdas de cada fila
      for (var j = 0; j < tabla.rows[i].cells.length; j++) {
        // Si el texto de la celda contiene la búsqueda
        let name = tabla.rows[i].cells[j].getAttribute('name');
        let originalText = tabla.rows[i].cells[j].textContent.trim(); // Mantener el texto original
        let value = originalText.toLowerCase();
        if (this.searchColumns.includes(name)) {
          if (value.includes(busqueda)) {
            // Crear un elemento <span> con la clase y estilos deseados
            let highlightedSpan = document.createElement('span');
            highlightedSpan.classList.add('text-sky-600', 'font-semibold');
            // Encerrar el texto de búsqueda dentro del <span> creado
            let startIndex = value.indexOf(busqueda);
            let endIndex = startIndex + busqueda.length;
            let prefix = originalText.substring(0, startIndex); // Usar el texto original
            let match = originalText.substring(startIndex, endIndex); // Usar el texto original
            let suffix = originalText.substring(endIndex); // Usar el texto original
            let prefixTextNode = document.createTextNode(prefix);
            let matchTextNode = document.createTextNode(match);
            let suffixTextNode = document.createTextNode(suffix);
            highlightedSpan.appendChild(matchTextNode);
            // Reemplazar el contenido de la celda con el nuevo nodo
            tabla.rows[i].cells[j].textContent = ''; // Limpiar el contenido de la celda
            tabla.rows[i].cells[j].appendChild(prefixTextNode);
            tabla.rows[i].cells[j].appendChild(highlightedSpan);
            tabla.rows[i].cells[j].appendChild(suffixTextNode);
          }
        }
      }
    }
  }

  createTable(options = {}) {
    const name = this.name;
    let element;

    if (!this.tableElement) {
      element = document.querySelector(`#${name}`);
      this.tableElement = element;
    } else {
      element = this.tableElement;
    }
    this.tableOptions = options;
    let table = ``;
    let tableHeader = ``;
    let count = 0;
    let desde = 0;
    let hasta = 0;
    let recordsPerView = 0;
    let footer = [];
    let header = [];
    let field = {};
    let xRow = {};
    let hayMas = false;
    let hayMenos = false;
    let arrayTable = 'dataArray'

    if (options.colorTable) {
      this.changeColorClass(options.colorTable);
    }

    if (this.orderColumns.length > 0) {
      this.arrayOrder = this.dataArray.map((objeto) =>
        this.reordenarClaves(objeto, this.orderColumns)
      );
      arrayTable = 'arrayOrder';
    }

    table += `<div class="${this.tableClass.divPadre} ${this.widthPadre}">`;

    if ("title" in options || "subtitle" in options || "btnNew" in options || "buttons" in options) {
      table += `<div name="header" class="${this.tableClass.header}">`;
      if ("title" in options || "subtitle" in options) {
        table += `<div name="titleContainer" class="${this.tableClass.titleContainer}">`;
        if ("title" in options) {
          table += `<h3 name="title" class="${this.tableClass.title}">${options.title}</h3>`;
        }
        if ("subtitle" in options) {
          table += `<p name="subtitle" class="${this.tableClass.subtitle}">${options.subtitle}</p>`;
        }
        table += `</div>`;
      }
      if ("buttons" in options) {
        table += `<div class="${this.tableClass.buttonsContainer}  ${this.widthTable}" >${options.buttons}</div>`;
      }
      if ("btnNew" in options) {
        table += `<button type="button" data-action="seleccionado,0,0" class="${this.tableClass.btnSmall}">${options.btnNew}</button>`;
      }
      table += '</div>';
    }

    table += `<div name="tableContainer" class="${this.tableClass.tableContainer}  ${this.widthTable}">`;
    table += `<table name="table" class="${this.tableClass.table}">`;
    table += `<thead name="thead" class="${this.tableClass.thead}">`;

    tableHeader += `<tr class="${this.tableClass.trtitle}">`;

    if ("row" in options) {
      xRow = options.row;
    }

    desde = this.from > 0 ? this.from : 1;
    recordsPerView = this.recordsPerView;
    hasta = desde + this.recordsPerView - 1;


    Object.keys(this[arrayTable][0]).forEach(item => {
      let objectItem = this[arrayTable][0][item];
      let tipo = this.detectDataType(objectItem.value);
      let xheader = {};
      let xfooter = {};
      let classTitleColumn = '';
      let ColSearch = '';
      let xfield, xname, xattribute, xhidden;

      xattribute = objectItem.attribute ? objectItem.attribute : '';
      xhidden = objectItem.hidden ? 'hidden' : '';


      xname = objectItem.name;

      if (this.searchColumns.includes(item)) {
        ColSearch = '&#9679; '
      }

      if ("header" in options) {
        xheader = options.header[item] ? options.header[item] : {};
      }

      if ("footer" in options) {
        xfooter = options.footer[item] ? options.footer[item] : {};
      }

      if (xattribute) {
        xheader.attribute = xattribute;
        xfooter.attribute = xattribute;
      }

      if (xhidden) {
        xheader.hidden = xhidden;
        xfooter.hidden = xhidden;
      }

      header.push(xheader);
      footer.push(xfooter);

      if ("field" in options) {
        xfield = options.field[item] ? options.field[item] : '';
      } else {
        xfield = '';
      }
      field[item] = xfield;

      if (tipo == 'number') {
        classTitleColumn = 'text-right'
      }

      if ("header" in options) {
        if (options.header[item]) {
          if ('class' in options.header[item]) {
            classTitleColumn = options.header[item].class;
          }
          if ('title' in options.header[item]) {
            xname = options.header[item].title;
          }
        }
      }

      if (tipo == 'number') {
        tableHeader += `<th scope="col" ${xattribute} ${xhidden} class="${this.tableClass.th} ${classTitleColumn}">${ColSearch}${xname}</th>`;
      } else {
        tableHeader += `<th scope="col" ${xattribute} ${xhidden} class="${this.tableClass.th} ${classTitleColumn}">${ColSearch}${xname}</th>`;
      }
    })

    tableHeader += `</tr>`
    table += tableHeader;
    table += `</thead><tbody>`;

    if ("firstRow" in options) {
      table += `<tr>`;
      Object.keys(this[arrayTable][0]).forEach(item => {
        let tipo = this.detectDataType(this[arrayTable][0][item].value);
        let classTitleColumn = '';
        let xfield, xvalue, xattribute, xhidden;

        xattribute = this[arrayTable][0][item].attribute ? this[arrayTable][0][item].attribute : '';
        xhidden = this[arrayTable][0][item].hidden ? 'hidden' : '';

        xvalue = '';

        if ("firstRow" in options) {
          if (options.firstRow[item]) {
            if ('class' in options.firstRow[item]) {
              classTitleColumn = options.firstRow[item].class;
            }
            if ('value' in options.firstRow[item]) {
              xvalue = options.firstRow[item].value;
            }
          }
        }


        table += `<td scope="col" ${xattribute} ${xhidden} class="${this.tableClass.td} ${classTitleColumn}">${xvalue}</td>`;



      })

      table += `</tr>`;
    }

    this[arrayTable].forEach((items, index) => {
      count++;
      if (this.paginations) {
        if ((index + 1) < desde) {
          hayMenos = true;
        } else if ((index + 1) >= desde && (index + 1) <= hasta) {
          let actionClick = '';
          let actionClass = '';
          let trNewClass = '';

          if ('click' in xRow) {
            if (xRow.click.function && xRow.click.field) {
              if (items[xRow.click.field]) {
                actionClick = `data-action="${xRow.click.function},${index},${items[xRow.click.field].value}" `;
                actionClass = this.tableClass.trhover;
              } else {
                console.error('row.click.field: ', `No existe columna ${xRow.click.field} en ${name}`);
              }
            } else {
              console.error('row.click.function', xRow.click.function);
              console.error('row.click.field', xRow.click.field);
            }
          }

          if ('change' in xRow) {
            trNewClass = xRow.change({ items, index });
          }

          if ('alternative' in xRow) {
            if (xRow.alternative == true) {
              if (index % 2 === 0) {
                table += `<tr ${actionClick} class="${this.tableClass.tr} ${this.tableClass.rowNormal} ${actionClass} ${trNewClass}">`;
              } else {
                table += `<tr ${actionClick} class="${this.tableClass.tr} ${this.tableClass.rowAlternative} ${actionClass} ${trNewClass}">`;
              }
            } else {
              table += `<tr ${actionClick} class="${this.tableClass.tr} ${this.tableClass.rowNormal} ${actionClass} ${trNewClass}">`;
            }
          } else {
            table += `<tr ${actionClick} class="${this.tableClass.tr} ${actionClass}">`;
          }

          Object.keys(items).forEach((item, iri) => {
            let xattribute = this[arrayTable][index][item].attribute ? this[arrayTable][index][item].attribute : '';
            let xhidden = this[arrayTable][index][item].hidden ? 'hidden' : '';
            let value = items[item].value;
            let tipo = this.detectDataType(value);
            let valor = this.formatValueByDataType(value);
            let dataClick = '';
            let newClass = '';
            let mywidth = ''

            if (this.widthColumns.length > 0) {
              mywidth = this.widthColumns[iri];
            }

            if (xattribute == 'currency') {
              valor = formatNumberArray(value)[2];
            }

            if (xattribute == 'pesos') {
              valor = pesos(value);
            }

            if (field[item].change) {
              valor = field[item].change({ items, valor, index, value });
            }

            if (field[item].click) {
              dataClick = `data-action="${field[item].click}, ${index}, ${value}"`;
            } else {
              dataClick = ``;
            }

            if (field[item].type) {
              tipo = field[item].type
              valor = this.formatValueByDataType(value, tipo);
            }

            if (field[item].class) {
              newClass = mywidth + ' ' + field[item].class;
            } else {
              if (tipo == 'number') {
                newClass = mywidth + ' text-right'
              } else {
                newClass = mywidth;
              }
            }

            table += `<td ${xattribute} ${xhidden} name="${item}" class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;


          })
          table += `</tr>`;
        } else if ((index + 1) > hasta) {
          hayMas = true;
        }
      } else {
        let actionClick = '';
        let actionClass = '';
        if ('click' in xRow) {
          if (xRow.click.function && xRow.click.field) {
            actionClick = `data-action="${xRow.click.function},${index},${items[xRow.click.field].value}" `;
            actionClass = 'cursor-pointer';
          } else {
            console.error('row.click.function', xRow.click.function);
            console.error('row.click.field', xRow.click.field);
          }
        }

        if ('class' in xRow) {
          if ('alternative' in xRow.class) {
            if (index % 2 === 0) {
              table += `<tr ${actionClick}  class="${this.tableClass.tr} ${xRow.class.normal} ${actionClass}">`;
            } else {
              table += `<tr ${actionClick}  class="${this.tableClass.tr} ${xRow.class.alternative} ${actionClass}">`;
            }
          } else {
            table += `<tr ${actionClick}  class="${this.tableClass.tr} ${xRow.class.normal} ${actionClass}">`;
          }
        } else {
          table += `<tr ${actionClick}  class="${this.tableClass.tr} ${actionClass}">`;
        }

        Object.keys(items).forEach((item) => {
          let xattribute = this[arrayTable][index][item].attribute ? this[arrayTable][index][item].attribute : '';
          let value = items[item].value;
          let tipo = this.detectDataType(value);
          let valor = this.formatValueByDataType(value);
          let dataClick = '';
          let newClass = '';

          if (field[item].change) {
            let resu = field[item].change({ items, valor, index, value });
            console.log(resu)
            valor = resu;
          }

          if (field[item].click) {
            dataClick = `data-action="${field[item].click}, ${index}, ${value}" `;
          } else {
            dataClick = ``;
          }

          if (field[item].class) {
            newClass = field[item].class;
          } else {
            if (tipo == 'number') {
              newClass = 'text-right'
            } else {
              newClass = '';
            }
          }

          if (tipo == 'number') {
            table += `<td ${xattribute} name="${item}" class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else if (tipo == 'date' || tipo == 'datetime-local') {
            table += `<td ${xattribute} name="${item}" class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else {
            table += `<td ${xattribute} name="${item}" class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
          }

        })
        table += `</tr>`;
      }

    });

    table += `</tbody>`;

    if (hayMas == false) {
      table += `<tfoot class="${this.tableClass.tfoot}"><tr class="text-md font-semibold">`
      footer.forEach(ref => {
        let valor = this.formatValueByDataType(ref.value);
        let tipo = this.detectDataType(ref.value);
        let xcss = ref.class ? ref.class : '';
        let xattribute = ref.attribute ? ref.attribute : '';
        let xhidden = ref.hidden ? 'hidden' : '';
        if (tipo == 'number') {
          table += `<td ${xattribute}  class="text-right ${this.tableClass.td} ${xcss}" >${valor}</td>`;
        } else if (tipo == 'date' || tipo == 'datetime-local') {
          table += `<td ${xattribute}  class="${this.tableClass.td} ${xcss}" >${valor}</td>`;
        } else {
          table += `<td ${xattribute}  class="${this.tableClass.td} ${xcss}" >${valor}</td>`;
        }
      })
      table += `</tr>`;
      // if(hayMas){
      // 	table += `<tr><td colspan="${footer.length}" data-tail="td">Hay mas registros</td><tr>`;
      // }
      table += `</tfoot>`;
    }

    table += `</table></div>`;
    table += '</div>';

    if (hayMas || hayMenos) {
      if (count < hasta) {
        hasta = count;
      }
      let buttons = {
        prev: {
          class: this.tableClass.paginationBtn,
          click: `data-pagination="prev"`
        },
        next: {
          class: this.tableClass.paginationBtn,
          click: `data-pagination="next"`
        }
      }


      if (hayMas == true && hayMenos == false) {
        buttons.prev.click = '';
        buttons.prev.class = this.tableClass.paginationBtnDisable;
      } else if (hayMas == false && hayMenos == true) {
        buttons.next.click = '';
        buttons.next.class = this.tableClass.paginationBtnDisable;

      }



      table += `<div class="${this.tableClass.pagination}">
			<!-- Help text -->
			<span class="text-xs text-neutral-600 dark:text-neutral-400">
					Registro <span class="font-semibold ">${desde}</span> al <span class="font-semibold ">${hasta}</span> (total: <span class="font-semibold">${count}</span> registros)
			</span>
			<div class="inline-flex">
				<!-- Buttons -->
				<button ${buttons.prev.click} class="flex items-center justify-center px-3 h-8 text-sm font-medium ${buttons.prev.class} rounded-l ">
						<svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
						</svg>
						Anterior
				</button>
				<button ${buttons.next.click} class="flex items-center justify-center px-3 h-8 text-sm font-medium ${buttons.next.class} border-0 border-l  rounded-r ">
						Siguiente
						<svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
					</svg>
				</button>
			</div>
		</div>`
    }




    element.innerHTML = table;
    this.bindClickPaginations(element);
    this.bindActionEvents(element)
    this.bindClickEvents(element);
    this.bindElementsWithDataValues(element);
    this.bindChangeEvents(element);
    this.buscarYResaltar(element);
    return table;
  }

  updateTable() {
    const name = this.name;
    let element;

    if (!this.tableElement) {
      element = document.querySelector(`#${name}`);
      this.tableElement = element;
    } else {
      element = this.tableElement;
    }

    let options = this.tableOptions;
    let rowGenerate = ``;
    let count = 0;
    let desde = 0;
    let hasta = 0;
    let recordsPerView = 10;
    let field = {};
    let xRow = {};
    let hayMas = false;
    let hayMenos = false;
    let arrayTable = 'dataArray'

    if (options.colorTable) {
      this.changeColorClass(options.colorTable);
    }

    if ("row" in options) {
      xRow = options.row;
    }

    desde = this.from > 0 ? this.from : 1;
    recordsPerView = this.recordsPerView;
    hasta = desde + this.recordsPerView - 1;

    if (this.orderColumns.length > 0) {
      this.arrayOrder = this.dataArray.map((objeto) =>
        this.reordenarClaves(objeto, this.orderColumns)
      );
      arrayTable = 'arrayOrder';
    }

    const tbody = element.querySelector('tbody');

    tbody.innerHTML = '';

    this[arrayTable].forEach((items, index) => {
      count++;
      if (this.paginations) {
        if ((index + 1) < desde) {
          hayMenos = true;
        } else if ((index + 1) >= desde && (index + 1) <= hasta) {
          let actionClick = '';
          let actionClass = '';
          let trNewClass = '';

          if ('click' in xRow) {
            if (xRow.click.function && xRow.click.field) {
              if (items[xRow.click.field]) {
                actionClick = `data-action="${xRow.click.function},${index},${items[xRow.click.field].value}" `;
                actionClass = this.tableClass.trhover;
              } else {
                console.error('row.click.field: ', `No existe columna ${xRow.click.field} en ${name}`);
              }
            } else {
              console.error('row.click.function', xRow.click.function);
              console.error('row.click.field', xRow.click.field);
            }
          }

          if ('change' in xRow) {
            trNewClass = xRow.change({ items, index });
          }

          if ('alternative' in xRow) {
            if (xRow.alternative == true) {
              if (index % 2 === 0) {
                rowGenerate += `<tr ${actionClick} class="${this.tableClass.tr} ${this.tableClass.rowNormal} ${actionClass} ${trNewClass}">`;
              } else {
                rowGenerate += `<tr ${actionClick} class="${this.tableClass.tr} ${this.tableClass.rowAlternative} ${actionClass} ${trNewClass}">`;
              }
            } else {
              rowGenerate += `<tr ${actionClick} class="${this.tableClass.tr} ${this.tableClass.rowNormal} ${actionClass} ${trNewClass}">`;
            }
          } else {
            rowGenerate += `<tr ${actionClick} class="${this.tableClass.tr} ${actionClass}">`;
          }

          Object.keys(items).forEach((item, iri) => {
            let xattribute = this[arrayTable][index][item].attribute ? this[arrayTable][index][item].attribute : '';
            let xhidden = this[arrayTable][index][item].hidden ? 'hidden' : '';
            let value = items[item].value;
            let tipo = this.detectDataType(value);
            let valor = this.formatValueByDataType(value);
            let dataClick = '';
            let newClass = '';
            let mywidth = ''
            let xfield, xvalue;

            if ("field" in options) {
              xfield = options.field[item] ? options.field[item] : '';
            } else {
              xfield = '';
            }
            field[item] = xfield;

            if (this.widthColumns.length > 0) {
              mywidth = this.widthColumns[iri];
            }


            if (xattribute == 'currency') {
              valor = formatNumberArray(value)[2];
            }

            if (xattribute == 'pesos') {
              valor = pesos(value);
            }

            if (field[item] && 'change' in field[item]) {
              valor = field[item].change({ items, valor, index, value });
            }

            if (field[item] && 'click' in field[item]) {
              dataClick = `data-action="${field[item].click}, ${index}, ${value}"`;
            } else {
              dataClick = ``;
            }

            if (field[item].type) {
              tipo = field[item].type
              valor = this.formatValueByDataType(value, tipo);
            }

            if (field[item].class) {
              newClass = mywidth + ' ' + field[item].class;
            } else {
              if (tipo == 'number') {
                newClass = mywidth + ' text-right'
              } else {
                newClass = mywidth;
              }
            }

            rowGenerate += `<td ${xattribute} ${xhidden} name="${item}" class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;


          })
          rowGenerate += `</tr>`;
        } else if ((index + 1) > hasta) {
          hayMas = true;
        }
      } else {
        let actionClick = '';
        let actionClass = '';
        if ('click' in xRow) {
          if (xRow.click.function && xRow.click.field) {
            actionClick = `data-action="${xRow.click.function},${index},${items[xRow.click.field].value}" `;
            actionClass = 'cursor-pointer';
          } else {
            console.error('row.click.function', xRow.click.function);
            console.error('row.click.field', xRow.click.field);
          }
        }

        if ('class' in xRow) {
          if ('alternative' in xRow.class) {
            if (index % 2 === 0) {
              rowGenerate += `<tr ${actionClick}  class="${this.tableClass.tr} ${xRow.class.normal} ${actionClass}">`;
            } else {
              rowGenerate += `<tr ${actionClick}  class="${this.tableClass.tr} ${xRow.class.alternative} ${actionClass}">`;
            }
          } else {
            rowGenerate += `<tr ${actionClick}  class="${this.tableClass.tr} ${xRow.class.normal} ${actionClass}">`;
          }
        } else {
          rowGenerate += `<tr ${actionClick}  class="${this.tableClass.tr} ${actionClass}">`;
        }

        Object.keys(items).forEach((item) => {
          let xattribute = this[arrayTable][index][item].attribute ? this[arrayTable][index][item].attribute : '';
          let value = items[item].value;
          let tipo = this.detectDataType(value);
          let valor = this.formatValueByDataType(value);
          let dataClick = '';
          let newClass = '';

          if (field[item].change) {
            let resu = field[item].change({ items, valor, index, value });
            console.log(resu)
            valor = resu;
          }

          if (field[item].click) {
            dataClick = `data-action="${field[item].click}, ${index}, ${value}" `;
          } else {
            dataClick = ``;
          }

          if (field[item].class) {
            newClass = field[item].class;
          } else {
            if (tipo == 'number') {
              newClass = 'text-right'
            } else {
              newClass = '';
            }
          }

          if (tipo == 'number') {
            rowGenerate += `<td ${xattribute} name="${item}" class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else if (tipo == 'date' || tipo == 'datetime-local') {
            rowGenerate += `<td ${xattribute} name="${item}" class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else {
            rowGenerate += `<td ${xattribute} name="${item}" class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
          }

        })
        rowGenerate += `</tr>`;

      }

    });


    tbody.innerHTML = rowGenerate;
    this.bindClickPaginations(element);
    this.bindActionEvents(element)
    this.bindClickEvents(element);
    this.bindElementsWithDataValues(element);
    this.bindChangeEvents(element);
    this.buscarYResaltar(element);
  }

  bindChangeEvents(componentDiv) {
    let elementsWithChange;
    let elementsWithOnChange;
    if (componentDiv) {
      elementsWithChange = componentDiv.querySelectorAll('[data-change]');
    } else {
      elementsWithChange = document.querySelectorAll('[data-change]');
    }

    elementsWithChange.forEach((element) => {
      const clickData = element.getAttribute('data-change');
      const [functionName, ...params] = clickData.split(',');
      if (functionName == 'currency') {
        element.addEventListener('change', (e) => { this.currency(e.target.value, e) });
      } else {
        if (params) {
          element.addEventListener('change', () => this.executeFunctionByName(functionName, params));
        } else {
          element.addEventListener('change', () => this.executeFunctionByName(functionName));
        }
      }
    });

    if (componentDiv) {
      elementsWithOnChange = componentDiv.querySelectorAll('[data-onchange]');
    } else {
      elementsWithOnChange = document.querySelectorAll('[data-onchange]');
    }

    elementsWithOnChange.forEach((element) => {
      const clickData = element.getAttribute('data-onchange');
      const [functionName, ...params] = clickData.split(',');

      if (params) {
        element.addEventListener('change', (e) => this.executeFunctionByName(functionName, e, params));
      } else {
        element.addEventListener('change', (e) => this.executeFunctionByName(functionName, e));
      }

    });
  }

  bindClickPaginations(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-pagination]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-pagination]');
    }

    elementsWithClick.forEach((element) => {
      const action = element.getAttribute('data-pagination');

      element.addEventListener('click', () => {
        let pos = this.from;
        let cant = this.recordsPerView;

        if (action == 'next') {
          pos = pos + cant;
          this.from = pos;
          this.createTable(this.tableOptions);
        } else {
          pos = pos - cant;
          this.from = pos;
          this.createTable(this.tableOptions);
        }
      });

    });
  }

  bindActionEvents(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-action]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-action]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-action');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  bindClickEvents(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-click]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-click]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-click');
      const [functionName, ...params] = clickData.split(',');
      if (params) {
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }


  // Ejecuta una función pasando el nombre como string
  executeFunctionByName(functionName, ...args) {
    if (this.functions && typeof this.functions[functionName] === 'function') {
      const func = this.functions[functionName];
      func(...args);
    } else {
      console.error(`La función '${functionName}' no está definida en la DataArray.`);
    }
  }


}
