const SERVER = import.meta.env.VITE_SERVER_DEV;

let informe = {};

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
      const valuesInsert = Object.values(data).map(value => (typeof value === 'string' ? `'${value}'` : value)).join(', ');
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
  frase = frase.replace(/(\r\n|\n|\r|\t)/gm, ' ');
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

export function prepararSQL(tabla, json) {
  let dataForSave = {};
  let elValor = '';
  let keyPrimary = '';
  let sql = '';
  let where = '';
  let tipoSQL = '';
  let camposIncompletos = '';
  let typeInput = '';
  let respuesta = {};

  if (tabla && json) {
    // let formValues = Object.values(json).map((field) => field.value);
    // alert(`Valores ingresados: ${formValues.join(", ")}`);
    let comprobation = Object.values(json).filter((field) => {
      if (field.required == true) {
        if (!field.value) {
          camposIncompletos += field.placeholder + ', ';
          return field.name;
        }
      }
    });

    if (!comprobation.length) {
      for (const key in json) {
        //console.log(key, json[key].value)
        if (json[key].key == 'PRI') {
          typeInput = json[key].type;

          if (typeInput == 'integer' || typeInput == 'number') {
            where = `${key} = ${json[key].value}`;
            keyPrimary = parseInt(json[key].value);
          } else {
            where = `${key} = '${json[key].value}'`;
            keyPrimary = json[key].value;
          }
          tipoSQL = json[key].value == 0 ? 'insert' : 'update';
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
              elValor = null;
            }
          } else if (typeInput == 'select') {
            if (json[key].value !== '') {
              elValor = json[key].value;
            } else {
              elValor = null;
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
    const resp = await fetch(`${SERVER}/tsql.php`, {
      method: 'POST',
      body: JSON.stringify({
        data: datos
      })
    });

    const result = await resp.json();
    return result;
  } catch (error) {
    console.log(error)
    console.log(informe)
    console.log(datos)
    const err = [{ resp: 'error', msgError: 'Error 222 al consultar datos!' }];
    return err;
  }
}

export async function login(user, password) {
  let datos = {
    user, password
  };

  try {
    const resp = await fetch(`${SERVER}/login.php`, {
      method: 'POST',
      body: JSON.stringify({
        data: datos
      })
    });

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
    const resp = await fetch(`${SERVER}/structure.php`, {
      method: 'POST',
      body: JSON.stringify({
        data: datos
      })
    });

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
    { str: 'like', cod: '-lk' }
  ];
  input = input.toLowerCase();

  for (let keyword of codwords) {
    if (input.startsWith(keyword)) {
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

export class Tamnora {
  constructor(config = {}) {
    this.data = this.createReactiveProxy(config.data);
    this._componentHTML = config.componentHTML || {};
    this.def = {};
    this._styleClasses = config.styleClasses || {
      label: 'block pl-1 text-sm font-medium text-neutral-900 dark:text-neutral-400',
      navlink: "block py-2 pl-3 pr-4 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-neutral-700 dark:hover:text-white md:dark:hover:bg-transparent",
      input: "bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700",
      select: "bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700",
      btn: "h-10 font-medium rounded-lg px-4 py-2 text-sm focus:ring focus:outline-none transition-bg duration-500",
      btn2: "text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700 transition-bg duration-500",
      btnSmall: "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-semibold rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 transition-bg duration-500",
      btnSimple: "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-semibold rounded-lg text-sm px-3 py-2 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 transition-bg duration-500",
      table: "w-full text-sm text-left text-neutral-500 dark:text-neutral-400",
      thead: "bg-white dark:bg-neutral-800 text-neutral-700  dark:text-neutral-400",
      th: "px-6 py-3 select-none text-xs text-neutral-700 uppercase dark:text-neutral-400",
      tr: "border-b border-neutral-200 dark:border-neutral-700",
      td: "px-6 py-3 select-none",
      tdclick: "px-6 py-3 select-none cursor-pointer font-semibold hover:text-green-400",
      trh: "text-md font-semibold",
      tdh: "px-6 py-2 select-none ",
      tdnumber: "px-6 py-4 text-right",
      darkBlue: "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-700",
      darkRed: "bg-red-700 text-white hover:bg-red-800 focus:ring-red-700",
      darkGreen: "bg-green-700 text-white hover:bg-green-800 focus:ring-green-700",
      darkNeutral: "bg-neutral-700 text-white hover:bg-neutral-800 focus:ring-neutral-700",
      dark: "bg-neutral-300 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 hover:dark:bg-neutral-700 hover:dark:text-white focus:ring-neutral-700",
      navactive: "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500",
      inactive: "text-neutral-600",
    };
    this.functions = {};
    this.templates = {};
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


    // Escuchar el evento de cambio de historial
    window.addEventListener('popstate', () => {
      this.handleNavigation();
    });

  }

  get styleClasses() {
    return this._styleClasses;
  }

  set styleClasses(newClasses) {
    // Finalmente, actualizas el valor de this._styleClasses
    this._styleClasses = newClasses;
    this.applyStyleClasses();
    this.applyStyleClassesNavActive();
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

  setClass(name, styleClass) {
    if (name && styleClass) {
      this.styleClasses[name] = styleClass;
      // Aplicamos las clases de estilo.
      this.applyStyleClasses();
      this.applyStyleClassesNavActive();
    }
  }

  getData(camino) {
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

  getDataFormat(camino, format) {
    const propiedades = camino.split('!');
    let valorActual = this.data;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
        if (format == 'pesos') {
          valorActual = this.pesos(valorActual, 2, '$')
        }
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }
    return valorActual;
  }

  existData(camino) {
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
    let valorActual = this.def;

    for (let propiedad of propiedades) {
      if (valorActual.hasOwnProperty(propiedad)) {
        valorActual = valorActual[propiedad];
      } else {
        return undefined; // Si la propiedad no existe, retornamos undefined
      }
    }

    return valorActual;
  }

  setData(name, datos, menos) {
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

  setDataRoute(camino, nuevoValor) {
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
    let valorActual = this.def;

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


  pushData(name, obj, format = false) {
    const newdata = this.data[obj];
    this.data[name].push(newdata);
    if (this.def[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.def[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)

    }
  }

  cleanData(obj, format = false) {
    if (this.def[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.def[obj][key] ?? '';
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


  // Actualiza los elementos vinculados a un atributo data-value cuando el dato cambia
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
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-change]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-change]');
    }

    elementsWithClick.forEach((element) => {
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
        if (this.styleClasses[cls]) {
          const arrayClases = this.styleClasses[cls].split(/\s+/).filter(Boolean)
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
      if (this.styleClasses['navactive'] && item == navactive) {
        const arrayClases = this.styleClasses['navactive'].split(/\s+/).filter(Boolean)
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

          if (!this.def[dataObj]) {
            this.def[dataObj] = {};
          }

          if (!this.def[dataObj][dataProp]) {
            this.def[dataObj][dataProp] = "";
          }
          this.def[dataObj][dataProp] = valorDefaul;
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

          if (!this.def[dataKey]) {
            this.def[dataKey] = '';
          }


          this.def[dataKey] = valorDefaul;
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

          if (!this.def[dataObj]) {
            this.def[dataObj] = {};
          }

          if (!this.def[dataObj][dataProp]) {
            this.def[dataObj][dataProp] = "";
          }
          this.def[dataObj][dataProp] = valorDefaul;
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

          if (!this.def[dataKey]) {
            this.def[dataKey] = '';
          }


          this.def[dataKey] = valorDefaul;
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
    return this.state[key];
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
        value: () => {
          return element.value
        },
        target: () => {
          return element.target
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
  }

  currency(value, element) {
    let newValue = this.formatNumber(value, 2, 'en');
    if (newValue == 'NaN') {
      newValue = 0;
    }
    element.target.value = newValue;

    this.setDataRoute(element.target.dataset.value, newValue);
  }

  formatNumber(str, dec = 2, leng = 'es', mixto = false) {
    if (!str) {
      str = '0.00t';
    } else {
      str = str + 't';
    }

    let numero = str.replace(/[^0-9.,]/g, '');
    let signo = numero.replace(/[^.,]/g, '');
    let count = numero.split(/[.,]/).length - 1;
    let xNumero = numero.replace(/[.,]/g, ',').split(',');
    let ultimoValor = xNumero.length - 1;
    let xDecimal = xNumero[ultimoValor];

    let numeroFinal = '';
    let resultado = '';

    xNumero.forEach((parte, index) => {
      if (index == ultimoValor) {
        numeroFinal += `${parte}`;
      } else if (index == ultimoValor - 1) {
        numeroFinal += `${parte}.`;
      } else {
        numeroFinal += `${parte}`;
      }
    });

    if (dec > 0) {
      numeroFinal = parseFloat(numeroFinal).toFixed(dec);
    } else {
      numeroFinal = `${Math.round(parseFloat(numeroFinal))}`;
    }

    if (leng == 'en') {
      resultado = numeroFinal;
    } else {
      resultado = new Intl.NumberFormat('de-DE', { minimumFractionDigits: dec }).format(
        parseFloat(numeroFinal)
      );
    }

    if (mixto) {
      let sep = leng == 'en' ? '.' : ',';
      let umo = resultado.split(sep);
      if (parseInt(umo[1]) == 0) {
        resultado = umo[0];
      }
    }

    return resultado;
  }

  pesos(numero, decimales, signo = '') {
    let numeroString = this.formatNumber(numero, decimales);
    if (signo) {
      return `${signo} ${numeroString}`;
    } else {
      return `${numeroString}`;
    }
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
    let values, value, name;
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



  formatDate(valor = null, separador = '-') {
    let fechaHora;
    let myDate;
    let sep = separador || '-';
    if (valor == null) {
      valor = new Date();
      myDate = valor;
    }

    let exp = /^\d{2,4}\-\d{1,2}\-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}$/gm;
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
        fechaHora = valor;
        myDate = new Date(valor);
      } else {
        return '';
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
      fecha: '' + myDate.getFullYear() + '-' + mes + '-' + dia,
      fechaEs: '' + dia + sep + mes + sep + myDate.getFullYear(),
      anio: myDate.getFullYear(),
      mes: mes,
      mesCorto: arrayMes[myDate.getMonth()],
      mesLargo: arrayMeses[myDate.getMonth()],
      dia: dia,
      diaSem: dsem,
      anioMes: anio + sep + mes,
      mesDia: mes + sep + dia,
      diaCorto: arrayDia[dsem],
      diaLargo: arrayDias[dsem],
      fechaCarta:
        arrayDias[dsem] +
        ' ' +
        myDate.getDate() +
        ' de ' +
        arrayMeses[myDate.getMonth()] +
        ' de ' +
        myDate.getFullYear(),
      fechaTonic:
        '' + myDate.getDate() + sep + arrayMes[myDate.getMonth()] + sep + myDate.getFullYear(),
      fechaHoraEs:
        '' +
        dia +
        sep +
        mes +
        sep +
        myDate.getFullYear() +
        ' ' +
        hora +
        ':' +
        minutos +
        ':' +
        segundos,
      fechaHora:
        '' +
        myDate.getFullYear() +
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
      fechaHoraT: '' + myDate.getFullYear() + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos,
      horaLarga: hora + ':' + minutos + ':' + segundos,
      horaCorta: hora + ':' + minutos,
      hora: hora,
      minutos: minutos,
      segundos: segundos
    };

    return myObject;
  }

}

export class DataObject {
  constructor(fields = {}) {
    this.camposRegistro = {};
    this.formOptions = {};
    this.data = this.createReactiveProxy(fields.data);
    this.table = '';
    this.key = '';
    this.numberAlert = 0;
    this.resetOnSubmit = false;
    this.structure = [];
    this.formElement = '';
    this.modalName = '';
    this.defaultObjeto = {};
    this.functions = {
      closeModal: (e) => {
        const modal = document.querySelector(e);
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        this.numberAlert = 0;
      },
      openModal: (e) => {
        const modal = document.querySelector(e);
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        this.numberAlert = 0;
      },
      submit: async (event, modalName) => {
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
            this.setDataFromModel(this.data.form);
            const paraSQL = this.getDataAll();
            const send = prepararSQL(this.table, paraSQL);

            if (send.status == 1) {
              dbSelect(send.tipo, send.sql).then(val => {
                if(val[0].resp == 1){
                  resolve(val[0].msg);
                } else {
                  reject(val[0].msg);
                }
              })
            } else {
              reject('Algo falta por aquí!')
            }
        });

        // Maneja la promesa
        promesa
          .then((respuesta) => {
            console.log(respuesta); // Maneja la respuesta del servidor
            event.submitter.innerHTML = defaultTitle;
            event.submitter.disabled = false;
            if (modalName) {
              this.closeModal(modalName);
            } 
            this.functions['reload']();
            if(this.resetOnSubmit){
              this.resetValues();
            }
            
          })
          .catch((error) => {
            console.error("Error al enviar el formulario:", error);
          });

      },
      delete: async (e) => {
        let sql, reference, val, key;
        const btnDelete = this.formElement.querySelector('[data-formclick="delete"]');
        

        if (this.key != '') {
          key = this.key;
          val = this.getValue(`form!${this.key}`);
          sql = `DELETE FROM ${this.table} WHERE ${this.key} = ${val}`;
          reference = `<span class="font-bold ml-2">${this.key}  ${val}</span>`;
        } else {
          this.structure.forEach(value => {
            if (value.COLUMN_KEY == 'PRI') {
              key = value.COLUMN_NAME;
              val = this.getValue(`form!${value.COLUMN_NAME}`);
              sql = `DELETE FROM ${this.table} WHERE ${value.COLUMN_NAME} = ${val}`;
              reference = `<span class="font-bold ml-2">${value.COLUMN_NAME}  ${val}</span>`;
            }
          })

        }

        console.log(key, val)
        if (sql && val) {
          if (this.numberAlert > 0) {
            let defaultTitle = btnDelete.innerHTML;
            btnDelete.disabled = true;
            btnDelete.innerHTML = `
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-red-500 dark:text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            Eliminando...
                `

            // Define una promesa dentro del evento submit
            const promesa = new Promise((resolve, reject) => {
                dbSelect('d', sql).then(val => {
                  if(val[0].resp == 1){
                    resolve(val[0].msg);
                  } else {
                    reject(val[0].msg);
                  }
                })
              
            });

            // Maneja la promesa
            promesa
              .then((respuesta) => {
                console.log(respuesta); // Maneja la respuesta del servidor
                btnDelete.innerHTML = defaultTitle;
                btnDelete.disabled = false;
                if (this.modalName) {
                  this.closeModal(this.modalName);
                }
                this.functions['reload']();
                if(this.resetOnSubmit){
                  this.resetValues();
                }
              })
              .catch((error) => {
                console.error("Error al enviar el formulario:", error);
              });


          } else {
            this.numberAlert = 1;
            btnDelete.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline w-4 h-4 mr-2 text-red-500 dark:text-white">
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
    this.formClass = {
      divPadre: 'relative overflow-x-auto shadow-md sm:rounded-lg mb-5',
      header: "bg-white dark:bg-neutral-800",
      title: "text-lg font-semibold text-left text-neutral-900 dark:text-white",
      subtitle: "mt-1 text-sm font-normal text-gray-500 dark:text-gray-400",
      label: 'block pl-1 text-sm font-medium text-neutral-900 dark:text-neutral-400',
      input: "bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700",
      select: "bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:outline-none  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-700 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700",
      btn: "h-10 font-medium rounded-lg px-4 py-2 text-sm focus:ring focus:outline-none transition-bg duration-500",
      btnSmall: "text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 transition-bg duration-500",
      submit: "h-10 font-medium rounded-lg px-4 py-2 text-sm focus:ring focus:outline-none transition-bg duration-500 inline-flex items-center bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-500 dark:text-blue-100 dark:hover:bg-blue-600",
      delete: "h-10 font-medium rounded-lg px-4 py-2 text-sm focus:ring focus:outline-none transition-bg duration-500 inline-flex items-center bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-500 dark:text-red-100 dark:hover:bg-red-600",
      darkBlue: "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-700",
      darkRed: "bg-red-700 text-white hover:bg-red-800 focus:ring-red-700",
      darkGreen: "bg-green-700 text-white hover:bg-green-800 focus:ring-green-700",
      darkNeutral: "bg-neutral-700 text-white hover:bg-neutral-800 focus:ring-neutral-700",
      dark: "bg-neutral-300 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 hover:dark:bg-neutral-700 hover:dark:text-white focus:ring-neutral-700",
      navactive: "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500",
      inactive: "text-neutral-600",
    };

    if (Object.keys(fields).length > 0) {
      fields.forEach(field => {
        this.camposRegistro[field] = {
          "type": "text",
          "name": field,
          "required": false,
          "placeholder": "",
          "value": "",
          "column": 0,
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "defaultValue": "",
          "key": "",
          "setDate": 0,
          "options": []
        };
      });
    }
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
    }

    if (ejecute) {
      this.table = table;
      this.key = key;
      let struc = await structure('t', table);
      const newStruc = []
      struc.forEach(data => {
        data.table = table;
        newStruc.push(data);
      })

      this.structure = newStruc;
    }
  }

  async addStructure(table) {
    let struc = await structure('t', table);
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


  setData(fieldName, key, value) {
    if (this.camposRegistro[fieldName]) {
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        this.camposRegistro[fieldName][key] = parseFloat(value)
        this.defaultObjeto[fieldName][key] = parseFloat(value);
      } else {
        this.camposRegistro[fieldName][key] = value;
        this.defaultObjeto[fieldName][key] = value;
        if (value == 'currency') {
          this.camposRegistro[fieldName].pattern = "[0-9.,]*";
          this.defaultObjeto[fieldName].pattern = "[0-9.,]*";
        }
      }
      if(key == 'setDate'){
        let fecha = new Date();
        if(value > 0){
          fecha.setDate(fecha.getDate() + value);
        }
        this.camposRegistro[fieldName].value = this.formatDate(fecha).fechaHora;
        this.defaultObjeto[fieldName].value = this.formatDate(fecha).fechaHora;
        this.data.form[fieldName] = this.formatDate(fecha).fechaHora;
      }
      if(key == 'value'){
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          this.data.form[fieldName] = parseFloat(value);
        } else {
          this.data.form[fieldName] = value; 
        }
      }
    }
  }


  setDataFromModel(objectModel) {
    Object.keys(objectModel).forEach((fieldName) => {
      let value = objectModel[fieldName];

      if (this.camposRegistro[fieldName].type == 'number' || this.camposRegistro[fieldName].type == 'select') {
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          this.camposRegistro[fieldName].value = parseFloat(value)
        } else {
          this.camposRegistro[fieldName].value = value;
        }
      } else {
        this.camposRegistro[fieldName].value = value;

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
      this.camposRegistro[val][key] = objectNameValue[val];
    })
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

  // Nuevo método para recorrer y aplicar una función a cada campo
  forEachField(callback) {
    for (const fieldName in this.camposRegistro) {
      callback(fieldName, this.camposRegistro[fieldName]);
    }
  }

  getDataClone() {
    return this.camposRegistro;
  }

  cloneFrom(newObject, clean = false) {
    this.camposRegistro = newObject;

    for (const fieldName in this.camposRegistro) {
      const type = this.camposRegistro[fieldName].type;
      let value = this.camposRegistro[fieldName].value;
      if (clean == true) {
        if (type == 'number') {
          value = 0;
        } else {
          value = '';
        }
        this.camposRegistro[fieldName].value = value;
      }
    }
  }

  resetValues() {
    for (const fieldName in this.defaultObjeto) {
      const setDate = this.defaultObjeto[fieldName].setDate;
      const type = this.defaultObjeto[fieldName].type;
      let value = this.defaultObjeto[fieldName].value;
      
       

        if(type == 'datetime-local'){
          let fecha = new Date();
          if(setDate > 0){
            fecha.setDate(fecha.getDate() + setDate);
          }
          this.camposRegistro[fieldName].value = this.formatDate(fecha).fechaHora;
          this.data.form[fieldName] = this.formatDate(fecha).fechaHora;
        } else {
            if (!isNaN(parseFloat(value)) && isFinite(value)) {
              this.data.form[fieldName] = parseFloat(value);
              this.camposRegistro[fieldName].value = parseFloat(value);
            } else {
              this.data.form[fieldName] = value;
              this.camposRegistro[fieldName].value = value;
            }
        }
        console.log(this.getDataAll())
        console.log(this.getValue('form'))
    }
  }

  typeToType(inType = 'text') {
    let outType;
    if (inType == 'int') outType = 'number';
    if (inType == 'tinyint') outType = 'number';
    if (inType == 'char') outType = 'text';
    if (inType == 'varchar') outType = 'text';
    if (inType == 'datetime') outType = 'datetime-local';
    if (inType == 'date') outType = 'date';
    if (inType == 'time') outType = 'time';
    if (inType == 'decimal') outType = 'currency';
    if (inType == 'text') outType = 'text';

    if (!outType) {
      console.error(`inType ${inType} no definido!`)
      outType = 'text'
    }

    return outType
  }


  // Nuevo método para agregar objetos al array y completar campos
  addObject(dataObject, structure = [], clean = false) {
    const newObject = {};
    const newObjectDefault={};
    let groupType = {};
    let primaryKey = {};

    if (structure.length > 0) {
      structure.forEach(val => {
        groupType[val.COLUMN_NAME] = this.typeToType(val.DATA_TYPE);
        primaryKey[val.COLUMN_NAME] = val.COLUMN_KEY;
      })
    } else {
      if (this.structure.length > 0) {
        this.structure.forEach(val => {
          groupType[val.COLUMN_NAME] = this.typeToType(val.DATA_TYPE);
          primaryKey[val.COLUMN_NAME] = val.COLUMN_KEY;
        })
      }
    }


    for (const fieldName in dataObject) {
      if (dataObject.hasOwnProperty(fieldName)) {
        let value = dataObject[fieldName];
        let type = this.detectDataType(value);
        let key = '';
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
          "column": 0,
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "defaultValue": "",
          "key": key,
          "setDate": 0,
          "options": []
        };

        newObjectDefault[fieldName] = {
          "type": type,
          "name": fieldName,
          "required": false,
          "placeholder": "",
          "value": value,
          "column": 0,
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "defaultValue": "",
          "key": key,
          "setDate": 0,
          "options": []
        };
      }
    }

    this.camposRegistro = newObject;
    this.defaultObjeto = newObjectDefault;
    console.log(this.camposRegistro)
    console.log(this.defaultObjeto)

  }

  getDefaultObject() {
    return this.defaultObjeto;
  }

  setDefaultObject(objeto) {
    console.log(objeto)
    console.log(this.defaultObjeto)
  }

  


  async addObjectFromRunCode(sq, clean = false) {
    let movimiento = await runCode(sq);
    this.setValue('form', {});

    movimiento.forEach(value => {
      this.addObject(value,[], clean)
    })

    this.forEachField((campo, dato) => {
      this.setValueRoute(`form!${campo}`, dato.value);
    })

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
    console.log(this.data.form)

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
          valorActual = this.pesos(valorActual, 2, '$')
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
    let valorActual = this.def;

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
    let valorActual = this.def;

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
    if (this.def[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.def[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)

    }
  }

  cleanValue(obj, format = false) {
    if (this.def[obj] && format) {
      setTimeout(() => {
        if (typeof this.data[obj] == 'object') {
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.def[obj][key] ?? '';
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
    const elementsWithDataValue = document.querySelectorAll(`[data-form="${dataKey}"]`);
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
    let toggleThemeButton;
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

          if (!this.def[dataObj]) {
            this.def[dataObj] = {};
          }

          if (!this.def[dataObj][dataProp]) {
            this.def[dataObj][dataProp] = "";
          }
          this.def[dataObj][dataProp] = valorDefaul;
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

          if (!this.def[dataKey]) {
            this.def[dataKey] = '';
          }


          this.def[dataKey] = valorDefaul;
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

  currency(value, element) {
    let newValue = this.formatNumber(value, 2, 'en');
    if (newValue == 'NaN') {
      newValue = 0;
    }
    element.target.value = newValue;

    this.setValueRoute(element.target.dataset.form, newValue);
  }

  formatNumber(str, dec = 2, leng = 'es', mixto = false) {
    if (!str) {
      str = '0.00t';
    } else {
      str = str + 't';
    }

    let numero = str.replace(/[^0-9.,]/g, '');
    let signo = numero.replace(/[^.,]/g, '');
    let count = numero.split(/[.,]/).length - 1;
    let xNumero = numero.replace(/[.,]/g, ',').split(',');
    let ultimoValor = xNumero.length - 1;
    let xDecimal = xNumero[ultimoValor];

    let numeroFinal = '';
    let resultado = '';

    xNumero.forEach((parte, index) => {
      if (index == ultimoValor) {
        numeroFinal += `${parte}`;
      } else if (index == ultimoValor - 1) {
        numeroFinal += `${parte}.`;
      } else {
        numeroFinal += `${parte}`;
      }
    });

    if (dec > 0) {
      numeroFinal = parseFloat(numeroFinal).toFixed(dec);
    } else {
      numeroFinal = `${Math.round(parseFloat(numeroFinal))}`;
    }

    if (leng == 'en') {
      resultado = numeroFinal;
    } else {
      resultado = new Intl.NumberFormat('de-DE', { minimumFractionDigits: dec }).format(
        parseFloat(numeroFinal)
      );
    }

    if (mixto) {
      let sep = leng == 'en' ? '.' : ',';
      let umo = resultado.split(sep);
      if (parseInt(umo[1]) == 0) {
        resultado = umo[0];
      }
    }

    return resultado;
  }

  pesos(numero, decimales, signo = '') {
    let numeroString = this.formatNumber(numero, decimales);
    if (signo) {
      return `${signo} ${numeroString}`;
    } else {
      return `${numeroString}`;
    }
  }

  formatDate(valor = null, separador = '-') {
    let fechaHora;
    let myDate;
    let sep = separador || '-';
    if (valor == null) {
      valor = new Date();
      myDate = valor;
    }

    let exp = /^\d{2,4}\-\d{1,2}\-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}$/gm;
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
        fechaHora = valor;
        myDate = new Date(valor);
      } else {
        return '';
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
      fecha: '' + myDate.getFullYear() + '-' + mes + '-' + dia,
      fechaEs: '' + dia + sep + mes + sep + myDate.getFullYear(),
      anio: myDate.getFullYear(),
      mes: mes,
      mesCorto: arrayMes[myDate.getMonth()],
      mesLargo: arrayMeses[myDate.getMonth()],
      dia: dia,
      diaSem: dsem,
      anioMes: anio + sep + mes,
      mesDia: mes + sep + dia,
      diaCorto: arrayDia[dsem],
      diaLargo: arrayDias[dsem],
      fechaCarta:
        arrayDias[dsem] +
        ' ' +
        myDate.getDate() +
        ' de ' +
        arrayMeses[myDate.getMonth()] +
        ' de ' +
        myDate.getFullYear(),
      fechaTonic:
        '' + myDate.getDate() + sep + arrayMes[myDate.getMonth()] + sep + myDate.getFullYear(),
      fechaHoraEs:
        '' +
        dia +
        sep +
        mes +
        sep +
        myDate.getFullYear() +
        ' ' +
        hora +
        ':' +
        minutos +
        ':' +
        segundos,
      fechaHora:
        '' +
        myDate.getFullYear() +
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
      fechaHoraT: '' + myDate.getFullYear() + '-' + mes + '-' + dia + 'T' + hora + ':' + minutos,
      horaLarga: hora + ':' + minutos + ':' + segundos,
      horaCorta: hora + ':' + minutos,
      hora: hora,
      minutos: minutos,
      segundos: segundos
    };

    return myObject;
  }

  bindChangeEvents(componentDiv) {
    let elementsWithClick;
    if (componentDiv) {
      elementsWithClick = componentDiv.querySelectorAll('[data-change]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-change]');
    }

    elementsWithClick.forEach((element) => {
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
  }

  // Método para detectar el tipo de dato basado en el valor
  detectDataType(value) {
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return "number";
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

  createForm(elem, data = {}) {
    let element;
    let form = '';

    if (!this.formElement) {
      element = document.querySelector(elem);
      this.formElement = element;
    } else {
      element = this.formElement;
    }
    this.formOptions = data;

    form += `<div class="${this.formClass.divPadre}">`;
    form += `<div class=" bg-white dark:bg-neutral-800">`;
    let columns = 'col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3'

    if ("title" in data || "subtitle" in data || "buttons" in data) {
      form += `<div class="flex flex-col md:flex-row  justify-between items-start p-5 border-b rounded-t dark:border-neutral-600">`
      if ("title" in data || "subtitle" in data) {
        form += `<div class="flex flex-col mb-3">`;
        if ("title" in data) {
          form += `<h3 class="${this.formClass.title}">${data.title}</h3>`;
        }
        if ("subtitle" in data) {
          form += `<p class="${this.formClass.subtitle}">${data.subtitle}</p>`;
        }
        form += '</div>';
      }

      if ("buttons" in data) {
        form += `${data.buttons}`;
      }
      form += '</div>'

    }

    form += '<form data-action="submit"><div class="p-6">'


    if ("columns" in data) {
      columns = `col-span-12 sm:col-span-${data.columns.sm ?? 6} 
      md:col-span-${data.columns.md ?? 4} 
      lg:col-span-${data.columns.lg ?? 3}`

    }


    form += '<div class="grid grid-cols-12 gap-4">';
    this.forEachField((campo, dato) => {
      let fieldElement = '';
      let dataValue = '';
      let colspan = '';
      let esrequired = '';
      let pattern = '';

      if (data.bind) {
        dataValue = `data-value="${data.bind}!${campo}"`;
      } else {
        dataValue = `data-form="form!${campo}"`;
      }

      if (dato.required == true) {
        esrequired = 'required';
      }

      if (dato.pattern != '') {
        pattern = `pattern="${dato.pattern}"`;
      }

      
      


      if ('column' in dato) {
        if (typeof dato.column === 'object') {
          colspan = 'col-span-12 ';
          if (dato.column.sm > 0) colspan += `sm:col-span-${dato.column.sm} `;
          if (dato.column.md > 0) colspan += `md:col-span-${dato.column.md} `;
          if (dato.column.lg > 0) colspan += `lg:col-span-${dato.column.lg} `;
          if (dato.column.xl > 0) colspan += `xl:col-span-${dato.column.xl} `;
          console.log(colspan)
        } else {
          if (dato.column > 0) {
            colspan = `col-span-${dato.column}`
          } else {
            colspan = columns
          }
        }
      } else {
        colspan = columns
      }


      

      if (dato.hidden == true) {
        colspan += ' hidden';
      }



      if (dato.type === 'select') {
        const options = dato.options.map(option => {
          if (option.value == dato.value) {
            return `<option value="${option.value}" selected>${option.label}</option>`
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');

        fieldElement = `
        <div class="${colspan}">
          <label for="${campo}" class="${this.formClass.label}">${dato.name}</label>
          <select id="${campo}" ${dataValue} class="${this.formClass.select}" ${esrequired}>
            ${options}
          </select>
        </div>`;
      } else if (dato.type === 'datalist') {
        const options = dato.options.map(option => {
          if (option.value == dato.value) {
            return `<option value="${option.value}" selected>${option.label}</option>`
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');

        fieldElement = `
        <div class="${colspan}">
        <label for="${campo}" class="${this.formClass.label}">${dato.name}</label>
        <input type="text" autocomplete="off" list="lista-${campo}" data-change="currency" id="${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${dato.attribute} class="${this.formClass.input}">
          <datalist id="lista-${campo}">
            ${options}
          </datalist>
        </div>`;
      } else if (dato.type === 'checkbox') {
        fieldElement = `
          <div class="${colspan}">
            <input type="checkbox" id="${campo}" ${dataValue}  ${esrequired} class="${this.formClass.checkbox}" ${dato.value ? 'checked' : ''}>
            <label class="${this.formClass.labelCheckbox}" for="${campo}">${dato.name}</label>
          </div>
        `;
      } else if (dato.type === 'currency') {
        fieldElement = `
          <div class="${colspan}">
            <label for="${campo}" class="${this.formClass.label}">${dato.name}</label>
            <input type="text" autocomplete="off" data-change="currency" id="${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${dato.attribute} class="${this.formClass.input}">
          </div>
        `;
      } else {

        fieldElement = `
          <div class="${colspan}">
            <label for="${campo}" class="${this.formClass.label}">${dato.name}</label>
            <input type="${dato.type}" autocomplete="off" id="${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${dato.attribute} class="${this.formClass.input}">
          </div>
        `;
      }

      form += fieldElement;
    });

    form += `</div></div>`;

    if (data.submit || data.delete) {
      form += `<div class="flex items-center justify-start p-6 space-x-2 border-t border-neutral-200 rounded-b dark:border-neutral-600">`;

      if (data.submit) {
        form += ` <button type="submit" class="${this.formClass.submit}">${data.submit}</button>`;
      }

      if (data.delete) {
        form += ` <button type="button" data-formclick="delete" class="${this.formClass.delete}">${data.delete}</button>`;
      }

      form += `</div>`;
    }
    form += '</form></div>'

    element.innerHTML = form;
    this.bindSubmitEvents(element);
    this.bindClickEvent(element)
    this.bindElementsWithDataValues(element);
    this.bindChangeEvents(element);
    return form;

  }

  createFormModal(elem, data = {}) {
    let element;

    if (!this.formElement) {
      element = document.querySelector(elem);
      this.formElement = element;
    } else {
      element = this.formElement;
    }
    this.formOptions = data;
    let nameModal = elem.slice(1) + '_modal';


    let form = `<div id="${nameModal}" tabindex="-1" aria-hidden="true" class="fixed top-0 flex left-0 right-0 z-50 h-screen w-full bg-neutral-900/50 dark:bg-neutral-900/70 p-4 overflow-x-hidden overflow-y-auto md:inset-0 justify-center items-center ">
    <div class="relative w-full max-w-3xl max-h-full ">
        <div class="relative bg-white rounded-lg shadow dark:bg-neutral-800  dark:shadow-neutral-300/50">`;
    let columns = 'col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3';

    form += `<div class="flex items-start justify-between p-5 border-b rounded-t dark:border-neutral-600">`
    form += '<div class="flex flex-col ">';
    if (data.title) {
      form += `<h3 class="text-lg font-semibold text-left text-neutral-900  dark:text-white">${data.title}</h3>`;
    }

    if ("subtitle" in data) {
      form += `<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">${data.subtitle}</p>`;
    }
    if ("buttons" in data) {
      form += `<div>${data.buttons}</div>`;
    }
    form += '</div>'


    form += `<button data-modal="closeModal,#${nameModal}" type="button" class="text-neutral-400 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-neutral-600 dark:hover:text-white">
    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
    </svg>
    <span class="sr-only">Close modal</span>
</button>`

    form += `</div><form data-action="submit" data-inmodal="${nameModal}"><div class="p-6">`;


    if ("columns" in data) {
      columns = `col-span-12 sm:col-span-${data.columns.sm ?? 6} 
      md:col-span-${data.columns.md ?? 4} 
      lg:col-span-${data.columns.lg ?? 3}`

    }


    form += '<div class="grid grid-cols-12 gap-4">';
    this.forEachField((campo, dato) => {
      let fieldElement = '';
      let dataValue = '';
      let colspan = '';
      let esrequired = '';
      let pattern = '';

      if (data.bind) {
        dataValue = `data-value="${data.bind}!${campo}"`;
      } else {
        dataValue = `data-form="form!${campo}"`;
      }

      if (dato.required == true) {
        esrequired = 'required';
      }

      if (dato.pattern != '') {
        pattern = `pattern="${dato.pattern}"`;
      }




      if ('column' in dato) {
        if (typeof dato.column === 'object') {
          colspan = 'col-span-12 ';
          if (dato.column.sm > 0) colspan += `sm:col-span-${dato.column.sm} `;
          if (dato.column.md > 0) colspan += `md:col-span-${dato.column.md} `;
          if (dato.column.lg > 0) colspan += `lg:col-span-${dato.column.lg} `;
          if (dato.column.xl > 0) colspan += `xl:col-span-${dato.column.xl} `;
          console.log(colspan)
        } else {
          if (dato.column > 0) {
            colspan = `col-span-${dato.column}`
          } else {
            colspan = columns
          }
        }
      } else {
        colspan = columns
      }

      if (dato.hidden == true) {
        colspan += ' hidden';
      }

      if (dato.type === 'select') {
        const options = dato.options.map(option => {
          if (option.value == dato.value) {
            return `<option value="${option.value}" selected>${option.label}</option>`
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');

        fieldElement = `
        <div class="${colspan}">
          <label for="${campo}" class="${this.formClass.label}">${dato.name}</label>
          <select id="${campo}" ${dataValue} class="${this.formClass.select}" ${esrequired}>
            ${options}
          </select>
        </div>`;
      } else if (dato.type === 'datalist') {
        const options = dato.options.map(option => {
          if (option.value == dato.value) {
            return `<option value="${option.value}" selected>${option.label}</option>`
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');

        fieldElement = `
        <div class="${colspan}">
        <label for="${campo}" class="${this.formClass.label}">${dato.name}</label>
        <input type="text" autocomplete="off" list="lista-${campo}" data-change="currency" id="${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${dato.attribute} class="${this.formClass.input}">
          <datalist id="lista-${campo}">
            ${options}
          </datalist>
        </div>`;
      } else if (dato.type === 'checkbox') {
        fieldElement = `
          <div class="${colspan}">
            <input type="checkbox" id="${campo}" ${dataValue}  ${esrequired} class="${this.formClass.checkbox}" ${dato.value ? 'checked' : ''}>
            <label class="${this.formClass.labelCheckbox}" for="${campo}">${dato.name}</label>
          </div>
        `;
      } else if (dato.type === 'currency') {
        fieldElement = `
          <div class="${colspan}">
            <label for="${campo}" class="${this.formClass.label}">${dato.name}</label>
            <input type="text" autocomplete="off" data-change="currency" id="${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${dato.attribute} class="${this.formClass.input}">
          </div>
        `;
      } else {
        fieldElement = `
          <div class="${colspan}">
            <label for="${campo}" class="${this.formClass.label}">${dato.name}</label>
            <input type="${dato.type}" autocomplete="off" id="${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${dato.attribute} class="${this.formClass.input}">
          </div>
        `;
      }

      form += fieldElement;
    });

    form += `</div></div>`;

    if (data.submit || data.delete) {
      form += `<div class="flex items-center justify-start p-6 space-x-2 border-t border-neutral-200 rounded-b dark:border-neutral-600">`;

      if (data.submit) {
        form += ` <button type="submit" class="${this.formClass.submit}">${data.submit}</button>`;
      }

      if (data.delete) {
        form += ` <button type="button" data-formclick="delete" class="${this.formClass.delete}">${data.delete}</button>`;
      }

      form += `</div>`;
    }
    form += `</form></div></div></div>`

    element.innerHTML = form;
    this.bindSubmitEvents(element);
    this.bindClickModal(element);
    this.bindClickEvent(element)
    this.bindElementsWithDataValues(element);
    this.bindChangeEvents(element);
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
          event.preventDefault();

          // Obtenemos el elemento activo (el que tiene el foco)
          const elementoActivo = document.activeElement;

          if (elementoActivo.type == 'submit') {
            elementoActivo.click();
          } else {
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

        }
      });
    });
  }

  closeModal(modalName) {
    const modal = document.querySelector(`#${modalName}`);
    modal.classList.remove('flex');
    modal.classList.add('hidden');
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

  bindClickEvent(componentDiv) {
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
  constructor(fields, initialData = []) {
    this.from = 1;
    this.recordsPerView = 10;
    this.paginations = true;
    this.nameArray = '';
    this.tableOptions = {};
    this.tableElement = '';
    this.functions = {};
    this.structure = [];
    this.defaultRow = {};
    this.tableClass = {
      divPadre: "relative bg-white dark:bg-neutral-800 overflow-x-auto shadow-md sm:rounded-lg",
      table: "w-full text-sm text-left text-neutral-500 dark:text-neutral-400",
      header: "bg-white dark:bg-neutral-800",
      title: "text-lg font-semibold text-left text-neutral-900 dark:text-white",
      btnSmall: "text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 font-semibold rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 transition-bg duration-500",
      thead: "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 border-b border-neutral-300 dark:border-neutral-600",
      tfoot: "bg-white dark:bg-neutral-800 text-neutral-700  dark:text-neutral-400",
      pagination: "bg-white dark:bg-neutral-800 text-neutral-700 py-3 dark:text-neutral-400",
      th: "px-6 py-2 select-none text-xs text-neutral-600 uppercase dark:text-neutral-400 whitespace-nowrap",
      tr: "border-b border-neutral-200 dark:border-neutral-700",
      td: "px-6 py-3 select-none whitespace-nowrap",
      tdclick: "px-6 py-3 select-none cursor-pointer font-semibold hover:text-green-400",
      trh: "text-md font-semibold whitespace-nowrap",
      trtitle: "text-md font-semibold ",
      tdh: "px-6 py-2 select-none whitespace-nowrap",
      tdnumber: "px-6 py-4 text-right",
    };
    this.dataArray = initialData.map(item => {
      const newItem = {};
      fields.forEach(field => {
        newItem[field] = {
          "type": "text",
          "name": field,
          "required": false,
          "placeholder": "",
          "value": "",
          "column": 1,
          "attribute": 0,
          "hidden": false,
          "defaultValue": "",
          "key": "",
          "setDate": 0,
          "data": []
        };
      });
      return newItem;
    });
  }

  setData(index, fieldName, key, value) {
    if (this.dataArray[index] && this.dataArray[index][fieldName]) {
      this.dataArray[index][fieldName][key] = value;
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
    }

    if (ejecute) {
      let struc = await structure('t', table);
      const newStruc = []
      struc.forEach(data => {
        data.table = table;
        newStruc.push(data);
      })

      this.structure = newStruc;
      
    }
  }

  async addStructure(table) {
    let struc = await structure('t', table);
    const newStruc = []
    struc.forEach(data => {
      data.table = table;
      newStruc.push(data);
    })
    const arrayCombinado = this.structure.concat(newStruc);
    const conjuntoUnico = new Set(arrayCombinado.map(objeto => JSON.stringify(objeto)));
    this.structure = Array.from(conjuntoUnico).map(JSON.parse);
    console.log('addStructure', this.structure)
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

  typeToType(inType = 'text') {
    let outType;
    if (inType == 'int') outType = 'number';
    if (inType == 'tinyint') outType = 'number';
    if (inType == 'char') outType = 'text';
    if (inType == 'varchar') outType = 'text';
    if (inType == 'datetime') outType = 'datetime-local';
    if (inType == 'date') outType = 'date';
    if (inType == 'time') outType = 'time';
    if (inType == 'decimal') outType = 'currency';
    if (inType == 'text') outType = 'text';

    if (!outType) {
      console.error(`inType ${inType} no definido!`)
      outType = 'text'
    }

    return outType
  }

  setDataKeys(key, objectNameValue) {
    this.dataArray.forEach((item, index) => {
      Object.keys(objectNameValue).forEach((val) => {
        this.dataArray[index][val][key] = objectNameValue[val];
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
        groupType[val.COLUMN_NAME] = this.typeToType(val.DATA_TYPE);
        primaryKey[val.COLUMN_NAME] = val.COLUMN_KEY;
      })
    } else {
      if (this.structure.length > 0) {
        this.structure.forEach(val => {
          groupType[val.COLUMN_NAME] = this.typeToType(val.DATA_TYPE);
          primaryKey[val.COLUMN_NAME] = val.COLUMN_KEY;
        })
      }
    }

    for (const fieldName in dataObject) {
      if (dataObject.hasOwnProperty(fieldName)) {
        let value = dataObject[fieldName];
        let type = this.detectDataType(value);
        let key = '';
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
          "column": 0,
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "defaultValue": "",
          "key": key,
          "setDate": 0,
          "options": []
        };
      }
    }

    this.dataArray.push(newObject);
  }

  getDefaultRow() {
    return this.defaultRow;
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

        if (type == 'number') {
          value = 0;
        } else {
          value = '';
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
          "column": 0,
          "attribute": 0,
          "hidden": false,
          "pattern": '',
          "defaultValue": "",
          "key": key,
          "setDate": 0,
          "options": []
        };
      }
    }

    this.defaultRow = newObject;
  }

  // Método para detectar el tipo de dato basado en el valor
  detectDataType(value) {
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return "number";
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

  formatValueByDataType(value) {
    const dataType = this.detectDataType(value);

    if (dataType == 'text' && value == null) value = '';
    switch (dataType) {
      case "number":
        // Formatear número (decimal) con estilo numérico español
        return parseFloat(value).toLocaleString('es-ES', { maximumFractionDigits: 2 });

      case "pesos":
        // Formatear número (decimal) con estilo numérico español
        // return parseFloat(value).toLocaleString('es-ES', { maximumFractionDigits: 2 });
        return this.formatNumber(value, 2);
      case "datetime-local":
        // Formatear fecha y hora
        const datetime = new Date(value);
        return datetime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
          ' ' + datetime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      case "date":
        // Formatear fecha
        const date = new Date(value);
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
    this.dataArray.push(this.defaultRow);
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

  createTable(elem, options = {}) {
    let element;

    if (!this.tableElement) {
      element = document.querySelector(elem);
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

    table += `<div class="${this.tableClass.divPadre}">`;
    table += `<table class="${this.tableClass.table}">`;
    table += `<div class="flex flex-col md:flex-row justify-between items-start w-full py-3 px-5 ${this.tableClass.header}">`;

    if ("title" in options || "subtitle" in options || "btnNew" in options || "buttons" in options) {
      table += `<div class="flex flex-col flex-grow mb-2">`;
      if ("title" in options) {
        table += `<h3 class="${this.tableClass.title}">${options.title}</h3>`;
      }
      if ("subtitle" in options) {
        table += `<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">${options.subtitle}</p>`;
      }
      table += `</div>`;
      if ("buttons" in options) {
        table += `${options.buttons}`;
      }
      if ("btnNew" in options) {
        table += `<button type="button" data-action="seleccionado,0,0" class="${this.tableClass.btnSmall}">${options.btnNew}</button>`;
      }
      table += '</div>';
    }

    table += `<thead class="${this.tableClass.thead}">`;

    tableHeader += `<tr class="pp ${this.tableClass.trtitle}">`;

    if ("row" in options) {
      xRow = options.row;
    }

    desde = this.from > 0 ? this.from : 1;
    recordsPerView = this.recordsPerView;
    hasta = desde + this.recordsPerView - 1;


    Object.keys(this.dataArray[0]).forEach(item => {
      let tipo = this.detectDataType(this.dataArray[0][item].value);
      let xheader = {};
      let xfooter = {};
      let classTitleColumn = '';
      let xfield, xname, xattribute, xhidden;

      xattribute = this.dataArray[0][item].attribute ? this.dataArray[0][item].attribute : '';
      xhidden = this.dataArray[0][item].hidden ? 'hidden' : '';


      xname = this.dataArray[0][item].name;

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
        tableHeader += `<th scope="col" ${xattribute} ${xhidden} class="${this.tableClass.th} ${classTitleColumn}">${xname}</th>`;
      } else {
        tableHeader += `<th scope="col" ${xattribute} ${xhidden} class="${this.tableClass.th} ${classTitleColumn}">${xname}</th>`;
      }
    })


    tableHeader += `</tr>`

    table += tableHeader;

    table += `</thead><tbody>`;

    this.dataArray.forEach((items, index) => {
      count++;
      if (this.paginations) {
        if ((index + 1) < desde) {
          hayMenos = true;
        } else if ((index + 1) >= desde && (index + 1) <= hasta) {
          let actionClick = '';
          let actionClass = '';
          if ('click' in xRow) {
            if (xRow.click.function && xRow.click.field) {
              actionClick = `data-action="${xRow.click.function}, ${index}, ${items[xRow.click.field].value}" `;
              actionClass = 'cursor-pointer';
            } else {
              console.error('row.click.function', xRow.click.function);
              console.error('row.click.field', xRow.click.field);
            }
          }

          if ('class' in xRow) {
            if ('alternative' in xRow.class) {
              if (index % 2 === 0) {
                table += `<tr ${actionClick} class="${this.tableClass.tr} ${xRow.class.normal} ${actionClass}">`;
              } else {
                table += `<tr ${actionClick} class="${this.tableClass.tr} ${xRow.class.alternative} ${actionClass}">`;
              }
            } else {
              table += `<tr ${actionClick} class="${this.tableClass.tr} ${xRow.class.normal} ${actionClass}">`;
            }
          } else {
            table += `<tr ${actionClick} class="${this.tableClass.tr} ${actionClass}">`;
          }

          Object.keys(items).forEach((item) => {
            let xattribute = this.dataArray[index][item].attribute ? this.dataArray[index][item].attribute : '';
            let xhidden = this.dataArray[index][item].hidden ? 'hidden' : '';
            let value = items[item].value;
            let tipo = this.detectDataType(value);
            let valor = this.formatValueByDataType(value);
            let dataClick = '';
            let newClass = '';


           
            if (xattribute == 'currency') {
              valor = this.formatNumber(value, 2);
            }

            if (xattribute == 'pesos') {
              valor = this.pesos(value, 2, '$');
            }



            if (field[item].change) {
              valor = field[item].change({ items, valor, index });
            }

            if (field[item].click) {
              dataClick = `data-action="${field[item].click}, ${index}, ${value}"`;
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
              table += `<td ${xattribute} ${xhidden} class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
            } else if (tipo == 'date' || tipo == 'datetime-local') {
              table += `<td ${xattribute} ${xhidden} class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
            } else {
              table += `<td ${xattribute} ${xhidden} class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
            }

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
            actionClick = `data-action="${xRow.click.function}, ${index}, ${items[xRow.click.field].value}" `;
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
          let xattribute = this.dataArray[index][item].attribute ? this.dataArray[index][item].attribute : '';
          let value = items[item].value;
          let tipo = this.detectDataType(value);
          let valor = this.formatValueByDataType(value);
          let dataClick = '';
          let newClass = '';

          if (field[item].change) {
            valor = field[item].change({ items, valor, index });
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
            table += `<td ${xattribute} class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else if (tipo == 'date' || tipo == 'datetime-local') {
            table += `<td ${xattribute} class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
          } else {
            table += `<td ${xattribute} class="${this.tableClass.td} ${newClass}" ${dataClick}>${valor}</td>`;
          }

        })
        table += `</tr>`;
      }

    });

    table += `</tbody>`;
    table += `<tfoot class="${this.tableClass.tfoot}"><tr class="text-md font-semibold">`
    footer.forEach(ref => {
      let valor = this.formatValueByDataType(ref.value);
      let tipo = this.detectDataType(ref.value);
      let xcss = ref.class ? ref.class : '';
      let xattribute = ref.attribute ? ref.attribute : '';
      let xhidden = ref.hidden ? 'hidden' : '';
      if (tipo == 'number') {
        table += `<td ${xattribute} ${xhidden} class="text-right ${this.tableClass.td} ${xcss}" >${valor}</td>`;
      } else if (tipo == 'date' || tipo == 'datetime-local') {
        table += `<td ${xattribute} ${xhidden} class="${this.tableClass.td}${xcss}" >${valor}</td>`;
      } else {
        table += `<td ${xattribute} ${xhidden} class="${this.tableClass.td}${xcss}" >${valor}</td>`;
      }
    })
    table += `</tr>`;
    // if(hayMas){
    // 	table += `<tr><td colspan="${footer.length}" data-tail="td">Hay mas registros</td><tr>`;
    // }
    table += `</tfoot></table>`;

    if (hayMas || hayMenos) {
      if (count < hasta) {
        hasta = count;
      }
      let buttons = {
        prev: {
          class: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white',
          click: `data-pagination="prev"`
        },
        next: {
          class: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white',
          click: `data-pagination="next"`
        }
      }


      if (hayMas == true && hayMenos == false) {
        buttons.prev.click = '';
        buttons.prev.class = 'bg-neutral-100 text-neutral-400  dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-600';
      } else if (hayMas == false && hayMenos == true) {
        buttons.next.click = '';
        buttons.next.class = 'bg-neutral-100 text-neutral-400  dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-600';
      }

      table += `<div class="flex flex-col items-center ${this.tableClass.pagination}">
			<!-- Help text -->
			<span class="text-sm text-neutral-700 dark:text-neutral-400">
					Registro <span class="font-semibold text-neutral-900 dark:text-white">${desde}</span> al <span class="font-semibold text-neutral-900 dark:text-white">${hasta}</span> (total: <span class="font-semibold text-neutral-900 dark:text-white">${count}</span> registros)
			</span>
			<div class="inline-flex mt-2 xs:mt-0">
				<!-- Buttons -->
				<button ${buttons.prev.click} class="flex items-center justify-center px-3 h-8 text-sm font-medium ${buttons.prev.class} rounded-l ">
						<svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
						</svg>
						Prev
				</button>
				<button ${buttons.next.click} class="flex items-center justify-center px-3 h-8 text-sm font-medium ${buttons.next.class} border-0 border-l  rounded-r ">
						Next
						<svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
					</svg>
				</button>
			</div>
		</div>`
    }

    table += '</div>'


    element.innerHTML = table;
    this.bindClickPaginations(element);
    this.bindClickEvents(element);
    return table;
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
          this.createTable(this.tableElement, this.tableOptions);
        } else {
          pos = pos - cant;
          this.from = pos;
          this.createTable(this.tableElement, this.tableOptions);
        }
      });

    });
  }

  bindClickEvents(componentDiv) {
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



  // Ejecuta una función pasando el nombre como string
  executeFunctionByName(functionName, ...args) {
    if (this.functions && typeof this.functions[functionName] === 'function') {
      const func = this.functions[functionName];
      func(...args);
    } else {
      console.error(`La función '${functionName}' no está definida en la librería Tamnora.`);
    }
  }

  formatNumber(str, dec = 2, leng = 'es', mixto = false) {
    if (!str) {
      str = '0.00t';
    } else {
      str = str + 't';
    }

    let negativo = str.startsWith('-',0);
    
    let numero = str.replace(/[^0-9.,]/g, '');
    let signo = numero.replace(/[^.,]/g, '');
    let count = numero.split(/[.,]/).length - 1;
    let xNumero = numero.replace(/[.,]/g, ',').split(',');
    let ultimoValor = xNumero.length - 1;
    let xDecimal = xNumero[ultimoValor];

    let numeroFinal = '';
    let resultado = '';

    xNumero.forEach((parte, index) => {
      if (index == ultimoValor) {
        numeroFinal += `${parte}`;
      } else if (index == ultimoValor - 1) {
        numeroFinal += `${parte}.`;
      } else {
        numeroFinal += `${parte}`;
      }
    });

    if (dec > 0) {
      numeroFinal = parseFloat(numeroFinal).toFixed(dec);
    } else {
      numeroFinal = `${Math.round(parseFloat(numeroFinal))}`;
    }

    if (leng == 'en') {
      resultado = numeroFinal;
    } else {
      resultado = new Intl.NumberFormat('de-DE', { minimumFractionDigits: dec }).format(
        parseFloat(numeroFinal)
      );
    }

    if (mixto) {
      let sep = leng == 'en' ? '.' : ',';
      let umo = resultado.split(sep);
      if (parseInt(umo[1]) == 0) {
        resultado = umo[0];
      }
    }

    if(negativo){
      resultado = `-${resultado}`
    }

    return resultado;
  }

  pesos(numero, decimales, signo = '') {
    let numeroString = this.formatNumber(numero, decimales);
    if (signo) {
      return `${signo} ${numeroString}`;
    } else {
      return `${numeroString}`;
    }
  }




}

