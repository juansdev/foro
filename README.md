# Foro

## Instalación

Foro fue desarrollado usando las siguientes versiones:
- [Node.js](https://nodejs.org/) v14.17.0.
- Angular v12.0.3.

Inicia el servidor MongoDB.

Instala las dependencies y devDependencies y arranca el servidor del NodeJS.

```
cd api-rest-node
npm update
npm start
```

Los mismos pasos, pero del lado del Frontend:

```
cd foro-angular
npm update --force
npm start
```

IMPORTANTE: Si el Backend esta escuchando mediante un puerto diferente al puerto 3999, siga la ruta "foro-angular/src/app/services" y modifica el archivo "global.ts", cambiando el puerto 3999 por el puerto que te aparece en la consola con el que desplegaste el backend.

## Licencia

MIT

**Uso Libre**
