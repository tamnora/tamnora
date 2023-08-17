export class DB {
  constructor() {
    // Endpoint de la API para ejecutar consultas SQL
    this.apiEndpoint = 'http://192.168.0.148/distridaf/tsql.php';
  }
  
  codeTSQL(frase){
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

  // Método para generar la consulta SQL
  createQuerySQL(type, params) {
    const keywords = ['select', 'insert', 'update', 'delete'];
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
  };
  
  run(input) {
    let opcion = '';
    const codwords = ['-sl', '-st', '-in', '-up', '-dl'];
    const keywords = ['select', 'insert', 'update', 'delete'];
    
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
            console.log(keyword)
            lista.forEach(val => {
              if(val.cod == keyword){
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
        
      
       
    return this.execute(opcion, input);
  };

  // Método para ejecutar una consulta a través de la API
  async execute(type, sql) {
    const datos = {
      tipo: type.charAt(0),
  		tsql: this.codeTSQL(sql)
    };

    try {
      // Configurar las cabeceras de la solicitud
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      // Enviar la solicitud POST a la API
      const resp = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          data: datos
        })
      });

      // Leer y devolver la respuesta JSON de la API
      const result = await resp.json();
      return result;
    } catch (error) {
      // Manejar errores de la API
      const err = [{ resp: 'error', msgError: 'Error al consultar datos!' }];
      return err;
    }
  }

  // Métodos para ejecutar consultas SELECT, INSERT, UPDATE y DELETE
  async select(params) {
    return this.execute('select', this.createQuerySQL('select', params));
  }

  async insert(params) {
    return this.execute('insert', this.createQuerySQL('insert', params));
  }

  async update(params) {
    return this.execute('update', this.createQuerySQL('update', params));
  }

  async delete(params) {
    return this.execute('delete', this.createQuerySQL('delete', params));
  }
  
 
  
}