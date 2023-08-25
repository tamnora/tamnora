export class DataArray {
	constructor(fields, initialData = []) {
		this.from = 1;
		this.recordsPerView = 10;
		this.paginations = true;
		this.nameArray = '';
		this.tableOptions = {};
		this.tableElement = '';
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

	setDataKeys(key, objectNameValue){
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
	addObject(dataObject) {
		const newObject = {};
		for (const fieldName in dataObject) {
			if (dataObject.hasOwnProperty(fieldName)) {
				const value = dataObject[fieldName];
				const type = this.detectDataType(value);
				newObject[fieldName] = {
					"type": type,
					"name": fieldName,
					"required": false,
					"placeholder": "",
					"value": value,
					"column": 1,
					"attribute": 0,
					"defaultValue": "",
					"key": "",
					"setDate": 0,
					"data": []
				};
			}
		}
		this.dataArray.push(newObject);
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
			
		if(dataType == 'text' && value == null) value= '';
			switch (dataType) {
					case "number":
							// Formatear número (decimal) con estilo numérico español
							return parseFloat(value).toLocaleString('es-ES', { maximumFractionDigits: 2 });
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

	
	// Nuevo método para obtener los nombres de las claves de un objeto
	getKeys(index){
		if (this.dataArray[index]) {
				return Object.keys(this.dataArray[index]);
		}
		return [];
	}

	newSimpleTable(elem, options = {}){
		let element;

		if(!this.tableElement){
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
    table += '<table data-tail="table"><thead data-tail="thead">';
		tableHeader += '<tr>';

		if ("row" in options) {
			xRow = options.row;
		}

				desde = this.from > 0 ? this.from : 1;
				recordsPerView = this.recordsPerView;
				hasta = desde + this.recordsPerView - 1;
			
		
		Object.keys(this.dataArray[0]).forEach(item =>{
			let tipo = this.detectDataType(this.dataArray[0][item].value);
			let xheader = {}; 
			let xfooter = {}; 
			let xfield, xname, xattribute;

			xattribute = this.dataArray[0][item].attribute? this.dataArray[0][item].attribute : '';
			xname = this.dataArray[0][item].name;

			if ("header" in options) {
				xheader = options.header[item] ? options.header[item] : {};
			} 

			if ("footer" in options) {
				xfooter = options.footer[item] ? options.footer[item] : {};
			}

			if(xattribute){
				xheader.attribute = xattribute;
				xfooter.attribute = xattribute;
			}

			header.push(xheader);
			footer.push(xfooter);

			if ("field" in options) {
				xfield = options.field[item] ? options.field[item] : '';
			} else {
				xfield = '';
			}
			field[item]= xfield;

			if(tipo == 'number'){
				tableHeader+=`<th scope="col" ${xattribute} class="text-right" data-tail="th">${xname}</th>`;
			} else if(tipo == 'date' || tipo == 'datetime-local') {
				tableHeader+=`<th scope="col" ${xattribute} class="text-left" data-tail="th">${xname}</th>`;
			} else {
				tableHeader+=`<th scope="col" ${xattribute} data-tail="th">${xname}</th>`;
			}
		})

		

		tableHeader += `</tr>`

		table += `<tr>`;

		table+=`<tr data-tail="trh">`
		header.forEach(ref => {
			let valor = this.formatValueByDataType(ref.value);
			let tipo = this.detectDataType(ref.value);
			let xcss = ref.class ? ref.class : '';
			let xattribute = ref.attribute? ref.attribute : '';
			if(tipo == 'number'){
				table += `<th ${xattribute} class="text-right ${xcss}" data-tail="tdh">${valor}</th>`;
			} else if(tipo == 'date' || tipo == 'datetime-local') {
				table += `<th ${xattribute} class="${xcss}" data-tail="tdh">${valor}</th>`;
			} else {
				table += `<th ${xattribute} class="${xcss}" data-tail="tdh">${valor}</th>`;
			}
		})
		table+=`</tr>`;
		table+= tableHeader;

		table +=`</thead><tbody>`;
		
		this.dataArray.forEach((items, index) => {
			count++;
			if(this.paginations){
				if((index + 1) < desde){
					hayMenos = true;
				} else if((index + 1) >= desde && (index + 1) <= hasta){
					let actionClick = '';
					let actionClass = '';
					if('click' in xRow){
						if(xRow.click.function && xRow.click.field){
							actionClick =	`data-click="${xRow.click.function}, ${index}, ${items[xRow.click.field].value}" `;
							actionClass =	'cursor-pointer';
						} else {
							console.error('row.click.function',xRow.click.function);
							console.error('row.click.field', xRow.click.field);
						}
					}

					if('class' in xRow){
						if('alternative' in xRow.class){
							if(index % 2 === 0){
								table += `<tr ${actionClick} data-tail="tr" class="${xRow.class.normal} ${actionClass}">`;
							} else {
								table += `<tr ${actionClick} data-tail="tr" class="${xRow.class.alternative} ${actionClass}">`;
							}
						} else {
							table += `<tr ${actionClick} data-tail="tr" class="${xRow.class.normal} ${actionClass}">`;
						}
					} else {
						table += `<tr ${actionClick} data-tail="tr" class="${actionClass}">`;
					}

					Object.keys(items).forEach((item) =>{
						let xattribute = this.dataArray[index][item].attribute? this.dataArray[index][item].attribute : '';
						let value = items[item].value;
						let tipo = this.detectDataType(value);
						let valor = this.formatValueByDataType(value);
						let dataClick = '';
						let newClass = '';

						
						if(field[item].change){
							valor = field[item].change(items, valor);
						}

						if(field[item].click){
							dataClick = `data-click="${field[item].click}, ${index}, ${value}" data-tail="tdclick"`;
						} else {
							dataClick = `data-tail="td"`;
						}

						if(field[item].class){
							newClass = field[item].class;
						} else {
							newClass = '';
						}

						if(tipo == 'number'){
							table += `<td ${xattribute} class="text-right ${newClass}" ${dataClick}>${valor}</td>`;
						} else if(tipo == 'date' || tipo == 'datetime-local') {
							table += `<td ${xattribute} class="text-left ${newClass}" ${dataClick}>${valor}</td>`;
						} else {
							table += `<td ${xattribute} class=" ${newClass}" ${dataClick}>${valor}</td>`;
						}

					})
					table += `</tr>`;
				} else if((index + 1) > hasta){
					hayMas = true;
				}
			} else {
					let actionClick = '';
					let actionClass = '';
					if('click' in xRow){
						if(xRow.click.function && xRow.click.field){
							actionClick =	`data-click="${xRow.click.function}, ${index}, ${items[xRow.click.field].value}" `;
							actionClass =	'cursor-pointer';
						} else {
							console.error('row.click.function',xRow.click.function);
							console.error('row.click.field', xRow.click.field);
						}
					}

					if('class' in xRow){
						if('alternative' in xRow.class){
							if(index % 2 === 0){
								table += `<tr ${actionClick} data-tail="tr" class="${xRow.class.normal} ${actionClass}">`;
							} else {
								table += `<tr ${actionClick} data-tail="tr" class="${xRow.class.alternative} ${actionClass}">`;
							}
						} else {
							table += `<tr ${actionClick} data-tail="tr" class="${xRow.class.normal} ${actionClass}">`;
						}
					} else {
						table += `<tr ${actionClick} data-tail="tr" class="${actionClass}">`;
					}

				Object.keys(items).forEach((item) =>{
					let xattribute = this.dataArray[index][item].attribute? this.dataArray[index][item].attribute : '';
					let value = items[item].value;
					let tipo = this.detectDataType(value);
					let valor = this.formatValueByDataType(value);
					let dataClick = '';
					let newClass = '';

					
					if(field[item].change){
						valor = field[item].change(items, valor);
					}

					if(field[item].click){
						dataClick = `data-click="${field[item].click}, ${index}, ${value}" data-tail="tdclick"`;
					} else {
						dataClick = `data-tail="td"`;
					}

					if(field[item].class){
						newClass = field[item].class;
					} else {
						newClass = '';
					}

					if(tipo == 'number'){
						table += `<td ${xattribute} class="text-right ${newClass}" ${dataClick}>${valor}</td>`;
					} else if(tipo == 'date' || tipo == 'datetime-local') {
						table += `<td ${xattribute} class="text-left ${newClass}" ${dataClick}>${valor}</td>`;
					} else {
						table += `<td ${xattribute} class=" ${newClass}" ${dataClick}>${valor}</td>`;
					}

				})
				table += `</tr>`;
			} //fin
			
		});

    table+=`</tbody>`;
		table+=`<tfoot><tr class="text-md font-semibold">`
		footer.forEach(ref => {
			let valor = this.formatValueByDataType(ref.value);
			let tipo = this.detectDataType(ref.value);
			let xcss = ref.class ? ref.class : '';
			let xattribute = ref.attribute? ref.attribute : '';
			if(tipo == 'number'){
				table += `<td ${xattribute} class="text-right ${xcss}" data-tail="td">${valor}</td>`;
			} else if(tipo == 'date' || tipo == 'datetime-local') {
				table += `<td ${xattribute} class="${xcss}" data-tail="td">${valor}</td>`;
			} else {
				table += `<td ${xattribute} class="${xcss}" data-tail="td">${valor}</td>`;
			}
		})
		table+=`</tr>`;
		// if(hayMas){
		// 	table += `<tr><td colspan="${footer.length}" data-tail="td">Hay mas registros</td><tr>`;
		// }
		table+=`</tfoot></table>`;

		if(hayMas || hayMenos){
			if(count < hasta){
				hasta = count;
			}
			let buttons = {
				prev:{
					class:'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
				  click:`data-pagination="prev"`
				}, 
				next:{
					class:'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
				  click:`data-pagination="next"`
				}
			}
			
			
			if(hayMas == true && hayMenos == false){
				buttons.prev.click = '';
				buttons.prev.class = 'bg-gray-100 text-gray-400  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600';
			} else if(hayMas == false && hayMenos == true){
				buttons.next.click = '';
				buttons.next.class = 'bg-gray-100 text-gray-400  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600';
			}

			table+=`<div class="flex flex-col items-center pb-3">
			<!-- Help text -->
			<span class="text-sm text-gray-700 dark:text-gray-400">
					Registro <span class="font-semibold text-gray-900 dark:text-white">${desde}</span> al <span class="font-semibold text-gray-900 dark:text-white">${hasta }</span> (total: <span class="font-semibold text-gray-900 dark:text-white">${count}</span> registros)
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

	
		element.innerHTML = table;
		this.bindClickPaginations(element);
    return table;
  }

	bindClickPaginations(componentDiv) {
    let elementsWithClick;
    if(componentDiv){
      elementsWithClick = componentDiv.querySelectorAll('[data-pagination]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-pagination]');
    }

    elementsWithClick.forEach((element) => {
      const action = element.getAttribute('data-pagination');
      
      element.addEventListener('click', () => {
				let pos = this.from;
				let cant = this.recordsPerView;
			
				if(action == 'next'){
					pos = pos + cant;
					this.from = pos;
					this.newSimpleTable(this.tableElement, this.tableOptions);
					console.log(pos);
				} else {
					pos = pos - cant;
					this.from = pos;
					this.newSimpleTable(this.tableElement, this.tableOptions);
					console.log(pos);
				}
			});
      
    });
  }

	

}




