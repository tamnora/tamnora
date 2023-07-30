# Tamnora.js

Tamnora.js es una librería JavaScript ligera que proporciona enlace de datos reactivo y manipulación del DOM, lo que facilita la creación de aplicaciones web interactivas. Con Tamnora.js, puedes crear interfaces de usuario reactivas vinculando valores de datos a elementos HTML y automatizando las actualizaciones cuando cambian los datos.

## Características

- Enlace de datos reactivo: Tamnora.js te permite crear proxies reactivos para tus objetos de datos, de modo que los cambios en los datos se reflejan automáticamente en los elementos HTML vinculados a ellos.

- Manipulación sencilla del DOM: Puedes vincular fácilmente valores de datos a elementos HTML utilizando el atributo `data-value`, y Tamnora.js se encarga de actualizar los elementos cada vez que cambian los datos.

- Funciones personalizadas: Define y registra funciones personalizadas que se pueden llamar desde el HTML utilizando el atributo `data-click`.

- Arquitectura basada en componentes: Organiza tu interfaz de usuario en componentes reutilizables, cargándolos y renderizándolos dinámicamente.

- Gestión de estado: Guarda y carga el estado de tu aplicación en/desde el almacenamiento local.

- Bucle de datos: Utiliza `data-for` para recorrer matrices y actualizar automáticamente el contenido.

## Empezar

Para comenzar a utilizar Tamnora.js, incluye el script `tamnora.js` en tu archivo HTML:


```html
<!DOCTYPE html>
<html>
<head>
  <title>Ejemplo con Tamnora.js</title>
</head>
<body>
  <input type="text" data-value="nombre" />
  <span data-value="edad"></span>
  <button data-click="saludar">Saludar</button>

  <script src="ruta/hacia/tamnora.js"></script>
  <script>
    const data = {
      nombre: 'Juan',
      edad: 30,
    };

    const tamnora = new Tamnora(data);

    tamnora.setFunction('saludar', () => {
      alert(`¡Hola, ${tamnora.getData('nombre')}!`);
    });

    tamnora.onMount(() => {
      console.log('¡tamnora.js está listo!');
    });
  </script>
</body>
</html>
```

## Contribuciones
Si deseas contribuir a la librería tamnora.js, ¡estamos encantados de recibir tus aportes! Simplemente abre un problema o envía una solicitud de extracción a nuestro repositorio en GitHub.

## Licencia
tamnora.js se distribuye bajo la Licencia MIT. Si deseas conocer los detalles completos, consulta el archivo LICENSE en este repositorio.

¡Gracias por utilizar tamnora.js! Esperamos que esta librería te ayude a crear aplicaciones web interactivas y fáciles de mantener. Si tienes alguna pregunta o problema, no dudes en abrir un problema en nuestro repositorio de GitHub o contactarnos directamente. ¡Que tengas un excelente día!
