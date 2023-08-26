const SERVER = import.meta.env.VITE_SERVER_DEV;


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
				if (json[key].key == 'primary') {
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
					// console.log(typeInput, json[key].value)
					if (typeInput == 'integer' || typeInput == 'number') {
						if (json[key].value > 0) {
							if(json[key].value > 0){
								elValor = parseFloat(json[key].value);
							} else {
								elValor = json[key].value;
							}
						} else {
							if(json[key].value == 0){
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
					} else {
							elValor = json[key].value;
					}
					dataForSave[key] = elValor;
				}
			}

			// console.log(dataForSave);
			sql = createQuerySQL(tipoSQL, {
				t: tabla,
				w: where,
				d: dataForSave
			});

			// console.log(sql);
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
		const err = [{ resp: 'error', msgError: 'Error al consultar datos!' }];
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

export async function runcode(input){
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
		if(opcion){
			data = await dbSelect(opcion, input);
			return data;
		} else {
			console.error('No se reconoce la estructura!')
			return [{resp: 'error', msgError: 'No se reconoce la estructura!'}]
		}
   
}