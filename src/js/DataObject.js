export class DataObject {
  constructor(fields = {}) {
    this.camposRegistro = {};

    if(Object.keys(fields).length > 0){
      fields.forEach(field => {
      this.camposRegistro[field] = {
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
        "options": []
      };
    });
    }
  }

  setData(fieldName, key, value) {
    if (this.camposRegistro[fieldName]) {
      this.camposRegistro[fieldName][key] = value;
    }
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

  setDataKeys(key, objectNameValue){
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

  // newSimpleForm(data = {}){
  //   let form = ``;

  //   if(data.title){
  //     form += `<h6 class="text-normal mb-2 font-bold dark:text-white">${data.title}</h6>`;
  //   }

  //   form += '<div class="grid grid-cols-12 gap-4">';
  //   this.forEachField((campo, dato)=>{
  
  //     let dataValue='';
  //     if(data.bind){
  //       dataValue = `data-value="${data.bind}!${campo}"`
  //     }
  //     form += `<div class="col-span-12 md:col-span-3 sm:col-span-6">
  //     <label for="${campo}" data-tail="label">${dato.name}</label>
  //     <input type="${dato.type}" id="${campo}" ${dataValue} value="${dato.value}" ${dato.attribute}  data-tail="input" >
  //   </div>`;

  //   })

  //   form+=`</div>`

  //   if(data.textSubmit){
  //     form+=`<div class="flex items-center justify-end p-3">
  //   <button type="submit" data-tail="btn2">${data.textSubmit}</button>
  //   </div>`
  //   }
  //   return form;
  // }

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
					"options": []
				};
			}
		}
	
		this.camposRegistro = newObject;
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

  newSimpleForm(data = {}) {
    let form = ``;
    
    if (data.title) {
      form += `<h6 class="text-normal mb-2 font-bold dark:text-white">${data.title}</h6>`;
    }
  
    form += '<div class="grid grid-cols-12 gap-4">';
    this.forEachField((campo, dato) => {
      let fieldElement = '';
      let dataValue = '';
      if (data.bind) {
        dataValue = `data-value="${data.bind}!${campo}"`;
      }
  
      if (dato.type === 'select') {
        const options = dato.options.map(option =>{
          if(option.value == dato.value){
            return `<option value="${option.value}" selected>${option.label}</option>`
          } else {
            return `<option value="${option.value}">${option.label}</option>`
          }
        }).join('');
        
        fieldElement = `
        <div class="col-span-12 md:col-span-3 sm:col-span-6">
          <label for="${campo}" data-tail="label">${dato.name}</label>
          <select id="${campo}" ${dataValue} data-tail="select">
            ${options}
          </select>
        </div>`;
      } else if (dato.type === 'checkbox') {
        fieldElement = `
          <div class="col-span-12 md:col-span-3 sm:col-span-6">
            <input type="checkbox" id="${campo}" ${dataValue} data-tail="checkbox" ${dato.value ? 'checked' : ''}>
            <label for="${campo}">${dato.name}</label>
          </div>
        `;
      } else {
        
        fieldElement = `
          <div class="col-span-12 md:col-span-3 sm:col-span-6">
            <label for="${campo}" data-tail="label">${dato.name}</label>
            <input type="${dato.type}" id="${campo}" ${dataValue} value="${dato.value}" ${dato.attribute}  data-tail="input">
          </div>
        `;
      }
  
      form += fieldElement;
    });
  
    form += `</div>`;
  
    if (data.textSubmit) {
      form += `<div class="flex items-center justify-end p-3">
        <button type="submit" data-tail="btn2">${data.textSubmit}</button>
      </div>`;
    }
    return form;
  }



}