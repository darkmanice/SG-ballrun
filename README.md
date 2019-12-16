# Ball run
Práctica de la asignatura Sistemas Gráficos de la UGR. Consiste en un pequeño juego de navegador en el que el usuario puede manejar una bola y tiene que llegar a unos puntos para ganar.

## Pre-requisitos
* Para ejecutar la aplicación en un navegador web se necesita un servidor web local. Si no se tiene ninguno se puede usar el que proporciona Python. Si no se tiene Python puedes [descargarlo](https://www.python.org/downloads/).

* Una vez instalado:
  * Abrir una terminal y situarse en la carpeta Archivos.
  * Lanzamos el servidor web local:
    * En Linux o Mac, ejecutar la orden &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; *python -m SimpleHTTPServer*
    * En Windows, ejecutar la orden &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; *python -m http.server*
  * Abrir el navegador y cargar la página http://localhost:8000
    * Ya podemos abrir la aplicación abriendo desde el navegador la carpeta ball run
    
## Controles
  * W - Desplazarse hacia delante
  * A - Girar hacia la izquierda
  * S - Desaplazarse hacia atras
  * D - Girar hacia la derecha
  * Barra espaciadora - Saltar
  * R - Resetar juego
  * 1 - Nivel 1
  * 2 - Nivel 2

Para ganar se debe llegar a las plataformas verdes. Si caes al vacío pierdes.
Se pueden consultar los controles dentro del juego.

## Pruebas
El juego contiene algunos errores.
* Si tocas una plataforma verde(meta) pero caes al vacío, ganas el nivel.
    
## Autores
* **Javier Lorenzo García**
* **Borja Nicolás González Castilla**
