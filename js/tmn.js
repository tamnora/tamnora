export function nzt(valor, devuelve) {
	if (!valor) {
		return devuelve;
	} else {
		return valor;
	}
}

export function formatPesos(importe) {
	let impor = parseFloat(importe);
	let valor = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(impor);
	return valor;
}

export function imprimir(numeroDeCopias) {
	var count = 0;
	while (count < numeroDeCopias) {
		window.print();
		count++;
	}
}

export function PadLeft(value, length) {
	return value.toString().length < length ? PadLeft('0' + value, length) : value;
}

export function PadRight(value, length) {
	return value.toString().length < length ? PadRight(value + '.', length) : value;
}

export function formatNumber(str, dec = 2, leng = 'es', mixto = false) {
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

export function isNumber(variable) {
  if (isNaN(variable) || variable === '' || variable === undefined || variable === null) {
    return false; // La variable no es un número
  } else {
    return true; // La variable es un número
  }
}

export function esMoneda(numero, decimales, signo = '') {
	// Convertimos el string a número flotante
	let numeroFlotante = parseFloat(numero);

	// Redondeamos el número a la cantidad de decimales especificada
	let numeroFlotante2 = numeroFlotante.toFixed(decimales);

	// Convertimos el número flotante a string
	let numeroString = numeroFlotante2.toString();

	// Agregamos los ceros necesarios para completar la cantidad de decimales solicitada
	// while (numeroString.length < numero.length + decimales) {
	//   numeroString += "0";
	// }

	// Devolvemos el número formateado como moneda
	if (signo) {
		return `${signo} ${numeroString}`;
	} else {
		return `${numeroString}`;
	}
}

export function formatearFecha(texto) {
	const regex = /^\d{4}-\d{1,2}-\d{1,2}$/;
	if (regex.test(texto)) {
		let ref = texto + ' 10:22:00'
		const fecha = new Date(ref);
		let dia = fecha.getDate();
    let mes =  fecha.getMonth() + 1 ;
    let anio =  fecha.getFullYear();

    let xdia = dia < 10 ? `0${dia}`: dia;
    let xmes = mes < 10 ? `0${mes}`: mes;
        
    let fcompleta = xdia + "/" + xmes + "/" + anio;
    return fcompleta;
	} else {
		return texto;
	}
}

export function agregarGuion(str) {
	// Agregar guion entre letras y números
	str = str.replace(/([a-zA-Z])(\d)/g, '$1-$2');
	// Agregar guion al final si la cadena termina en números
	str = str.replace(/(\d)([a-zA-Z])/g, '$1-$2');

	return str.toUpperCase();
}
