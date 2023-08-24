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
        "column": 0,
        "attribute": 0,
        "pattern": '',
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
      if(!isNaN(parseFloat(value)) && isFinite(value)){
        this.camposRegistro[fieldName][key] = parseFloat(value)
      } else {
        this.camposRegistro[fieldName][key] = value;
        if(value == 'currency'){
          this.camposRegistro[fieldName].pattern = "[0-9.,]*";
        }

      }
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
					"column": 0,
					"attribute": 0,
          "pattern": '',
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
    let columns = 'col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3'
    
    if (data.title) {
      form += `<h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">${data.title}</h3>`;
    }

    

    if ("columns" in data){
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
      }

      if(dato.required == true){
        esrequired = 'required';
      }

      if(dato.pattern != ''){
        pattern = `pattern="${dato.pattern}"`;
      }

     

      if('column' in dato){
        if(typeof dato.column === 'object'){
          colspan = 'col-span-12 ';
          if(dato.column.sm > 0) colspan += `sm:col-span-${dato.column.sm} `;
          if(dato.column.md > 0) colspan += `md:col-span-${dato.column.md} `;
          if(dato.column.lg > 0) colspan += `lg:col-span-${dato.column.lg} `;
          if(dato.column.xl > 0) colspan += `xl:col-span-${dato.column.xl} `;
          console.log(colspan)
        } else {
          if(dato.column > 0){
            colspan = `col-span-${dato.column}`
          } else {
            colspan = columns
          }
        }
      }else{
        colspan = columns
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
        <div class="${colspan}">
          <label for="${campo}" data-tail="label">${dato.name}</label>
          <select id="${campo}" ${dataValue} data-tail="select" ${esrequired}>
            ${options}
          </select>
        </div>`;
      } else if (dato.type === 'checkbox') {
        fieldElement = `
          <div class="${colspan}">
            <input type="checkbox" id="${campo}" ${dataValue}  ${esrequired} data-tail="checkbox" ${dato.value ? 'checked' : ''}>
            <label for="${campo}">${dato.name}</label>
          </div>
        `;
      } else if (dato.type === 'currency'){
        fieldElement = `
          <div class="${colspan}">
            <label for="${campo}" data-tail="label">${dato.name}</label>
            <input type="text" data-change="currency" id="${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${dato.attribute} data-tail="input">
          </div>
        `;
      } else {
        
        fieldElement = `
          <div class="${colspan}">
            <label for="${campo}" data-tail="label">${dato.name}</label>
            <input type="${dato.type}" id="${campo}" ${dataValue} ${esrequired} ${pattern} value="${dato.value}" ${dato.attribute} data-tail="input">
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