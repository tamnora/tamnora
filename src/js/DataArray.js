export class DataArray {
	constructor(fields, initialData = []) {
		this.dataArray = initialData.map(item => {
			const newItem = {};
			fields.forEach(field => {
				newItem[field] = {
					"type": "text",
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
		if (this.dataArray[index]) {
			fieldNames.forEach(fieldName => {
				if (this.dataArray[index][fieldName]) {
					this.dataArray[index][fieldName][key] = value;
				}
			});
		}
	}

	getDataGroup(index, fieldNames, key) {
		const dataGroup = {};
		if (this.dataArray[index]) {
			fieldNames.forEach(fieldName => {
				if (this.dataArray[index][fieldName]) {
					dataGroup[fieldName] = this.dataArray[index][fieldName][key];
				}
			});
		}
		return dataGroup;
	}

	getDataAll() {
		return this.dataArray;
	}

	// Nuevo método para recorrer y aplicar una función a cada elemento del array
	forEachItem(callback) {
		this.dataArray.forEach((item, index) => {
			callback(index, item);
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
}



