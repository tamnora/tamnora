// Definición de la librería Tamnora
export default class Tamnora {
  constructor(data) {
    this.data = this.createReactiveProxy(data);
    this.def = {};
    this._styleClasses = {};
    this.functions = {};
    this.folderComp = './components';
    this.templates = {};
    this.state = this.loadStateFromLocalStorage();
    this.onMountCallback = null;
    this.initialize();
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

  // Inicializa la librería y realiza las vinculaciones necesarias
  initialize() {
    this.bindElementsWithDataValues();
    this.bindClickEvents();
    this.applyStyleClassesNavActive()
    this.bindComponents();
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


  setClass(name, styleClass){
    if(name && styleClass){
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

  setData(name, datos, menos){
    if(typeof datos == 'object'){
      if(menos){
        Object.keys(datos).forEach((key) => {
          const value = datos[key];
          if(key != menos){
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


  pushData(name, obj, format = false){
    const newdata = this.data[obj];
    this.data[name].push(newdata);
    if(this.def[obj] && format){
      setTimeout(()=>{
        if(typeof this.data[obj] == 'object'){
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.def[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)
      
    }
  }

  cleanData(obj, format = false){
    if(this.def[obj] && format){
      setTimeout(()=>{
        if(typeof this.data[obj] == 'object'){
          Object.keys(this.data[obj]).forEach((key) => {
            const value = this.def[obj][key] ?? '';
            this.data[obj][key] = value;
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)
      
    }else{
      setTimeout(()=>{
        if(typeof this.data[obj] == 'object'){
          Object.keys(this.data[obj]).forEach((key) => {
            this.data[obj][key] = "";
            this.updateElementsWithDataValue(`${obj}!${key}`, value);
          });
        }
      }, 500)
    }
  }

  getFunction(){
    console.log(this.functions);
  }

  setFunction(name, fn){
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
 
        if (element.type === 'checkbox') {
          element.checked = this.data[dataObj][dataProp] || false;
        } else if (element.tagName === 'SELECT') {
          element.value = this.data[dataObj][dataProp] || '';
        } else if (element.tagName === 'INPUT') {
          element.value = this.data[dataObj][dataProp] || '';
        } else {
          element.textContent = this.data[dataObj][dataProp] || '';
        }
      } else {
        if (element.tagName === 'INPUT' && element.type !== 'checkbox') {
          element.value = value || '';
        } else if (element.tagName === 'SELECT') {
          element.value = value || '';
        } else if (element.type === 'checkbox') {
          element.checked = value || false;
        } else {
          element.textContent = value;
        }
      }
    });
  }
  
  // Vincula los eventos click definidos en atributos data-click a functions
  bindClickEvents(componentDiv) {
    let elementsWithClick;
    if(componentDiv){
      elementsWithClick = componentDiv.querySelectorAll('[data-click]');
    } else {
      elementsWithClick = document.querySelectorAll('[data-click]');
    }

    elementsWithClick.forEach((element) => {
      const clickData = element.getAttribute('data-click');
      const [functionName, params] = clickData.split(',');
      if(params){
        element.addEventListener('click', () => this.executeFunctionByName(functionName, params));
      } else {
        element.addEventListener('click', () => this.executeFunctionByName(functionName));
      }
    });
  }

  async bindComponents() {
    const componentDivs = document.querySelectorAll('[data-component]');
    const cantComponents = componentDivs.length;
    if (cantComponents) {
      componentDivs.forEach(async (componentDiv, index) => {
        const componentName = componentDiv.getAttribute('data-component');
        const objSlots = {};
        const setSlots = componentDiv.querySelectorAll('[set-slot]');

        if(setSlots){
          setSlots.forEach(slot => {
            const nameSlot = slot.getAttribute('set-slot')
            objSlots[nameSlot] = slot.innerHTML;
          })
        }

        await fetch(`${this.folderComp}/${componentName}.html`)
          .then((response) => response.text())
          .then((html) => {
            componentDiv.innerHTML = html;
            const getSlots = componentDiv.querySelectorAll('[get-slot]')

            if(getSlots){
              getSlots.forEach(slot => {
                const nameSlot = slot.getAttribute('get-slot')
                if(objSlots[nameSlot]){
                  slot.innerHTML = objSlots[nameSlot];
                }else{
                  slot.innerHTML = '<span class="text-red-500">set-slot ?</span>'
                }
              })
            }
          })
          .catch((error) => console.error(`Error al cargar el componente ${componentName}:`, error));

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
        
        if((cantComponents - 1) == index){
          // Ejecutamos la función onMount cuando el DOM esté cargado
            this.onDOMContentLoaded();
            this.bindDataFor();
            this.applyStyleClasses();
            this.applyStyleClassesNavActive();
          
        }
      });
    } else {
          // Ejecutamos la función onMount cuando el DOM esté cargado
          document.addEventListener('DOMContentLoaded', () => {
            this.onDOMContentLoaded();
            this.bindDataFor();
            this.applyStyleClasses();
            this.applyStyleClassesNavActive();
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
    if(groupGet){
      groupGet.forEach(propName => {
        const elementsWithDataProp = componentDiv.querySelectorAll(`[get-${propName}]`); // Agrega aquí otros selectores si necesitas más atributos get-
        
        elementsWithDataProp.forEach((element) => {
          if(element){
            element.textContent += dataProps[propName];
          }
        });
      })
    }
  }

  //Aplica las clases de estilo a los elementos con atributos data-tail, pero solo dentro del componente
  applyStyleClasses(componentDiv) {
    let elementsWithTail;
    if(componentDiv){
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

    if(componentDiv){
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

  // Vincula los elementos con atributos data-value a los datos reactivos, pero solo dentro del componente
  bindElementsWithDataValues(componentDiv) {
    let elementsWithDataValue;
    if(componentDiv){
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
          this.data[dataObj][dataProp]="";
        }

        if(dataDefaul){
          if(dataDefaul.startsWith('#')){
            const subcadena = dataDefaul.slice(1);
            valorDefaul = this.data[subcadena];
          } else {
            valorDefaul = dataDefaul
          }

          if (!this.def[dataObj]) {
            this.def[dataObj] = {};
          }
          
          if (!this.def[dataObj][dataProp]) {
            this.def[dataObj][dataProp]="";
          }
          

          this.def[dataObj][dataProp] = valorDefaul;
          this.data[dataObj][dataProp]= valorDefaul;
        }

       
        if (element.tagName === 'SELECT') {
          
          const dataObj = dataKey.split('!')[0];
          this.data[dataObj][dataProp] = element.value;
    
          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.value;
          });
        } else if (element.type === 'checkbox') {
         
          if(!this.data[dataObj][dataProp]){
            this.data[dataObj][dataProp] = false;
          }
          element.checked = this.data[dataObj][dataProp] || false;
          
          element.addEventListener('change', (event) => {
            this.data[dataObj][dataProp] = event.target.checked;
          });
        }else if (element.tagName === 'INPUT') {
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

        if(dataDefaul){

          if(dataDefaul.startsWith('#')){
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
          if(!this.data[dataKey]){
            this.data[dataKey] = false;
          }
          element.checked = this.data[dataKey] || false;
          
          element.addEventListener('change', (event) => {
            this.data[dataKey] = event.target.checked;
          });
        }else if (element.tagName === 'INPUT') {
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
    if(componentDiv){
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

      
      if(dataArray){
        if (dataArray && Array.isArray(dataArray)) {
          
          if(nameTemplate){
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

    if(filter === 'importe'){
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

      
      if(dataArray){
        if (dataArray && Array.isArray(dataArray)) {
          
          if(nameTemplate){
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
 
}



