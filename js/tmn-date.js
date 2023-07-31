export function formatDate(valor = null, separador = '-') {
	let fechaHora;
	let myDate;
	let sep = separador || '-';
	if (!valor) myDate = new Date();

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
