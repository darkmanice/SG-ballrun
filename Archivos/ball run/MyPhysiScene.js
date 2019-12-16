 
// En esta ocasión, la escena es física y deriva de Physijs.Scene

class MyPhysiScene extends Physijs.Scene {
	constructor (unRenderer) {
		super();
		
		this.setGravity (new THREE.Vector3 (0, -30, 0));
		this.raycaster = new THREE.Raycaster();		
		this.createLights ();
		this.createCamera (unRenderer);

		//se crean los distintos mapas que hay disponibles
		this.createGround();
		this.createNivel2();
		this.nivel = 0;

		this.crearBolaFisica(1, 100, 100, '../imgs/coloresBola.jpg', 0.2, 1, 1);

		//método que crea figuras con los mensajes que se van a mostrar al jugador
		this.crearMensajes();

		//se inicializa una variable que se utiliza en update, usada por la bola y la cámara
		this.rotacion = 0;
	}

	crearBolaFisica(radio, segAncho, segAlto, dirTextura, rozamiento, rebote, masa){	
		var texture = new THREE.TextureLoader().load(dirTextura);
		this.bola = new Physijs.SphereMesh( new THREE.SphereGeometry (radio, segAncho, segAlto), 
			Physijs.createMaterial ( new THREE.MeshPhongMaterial ({map: texture}), rozamiento, rebote), masa );
		this.bola.colisionable = true;
		this.bola.position.set(0, 5, 0);
		this.add(this.bola);
	}
	
	createCamera (unRenderer) {
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.add (this.camera);
	}
	
	createGround () {
		var geometry = new THREE.BoxGeometry (35,0.2,35);
		geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,0,0))
		var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
		var material = new THREE.MeshPhongMaterial ({map: texture});
		var physiMaterial = Physijs.createMaterial (material, 0.2, 1);
		var ground = new Physijs.BoxMesh (geometry, physiMaterial, 0);
		
		geometry = new THREE.BoxGeometry (35, 1, 0.2);
		geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,0.5,0));
		var physiPared = new Physijs.BoxMesh (geometry,physiMaterial,0);
		physiPared.position.z = 17.4;
		
		this.add (physiPared);
		
		physiPared = new Physijs.BoxMesh (geometry,physiMaterial,0);
		physiPared.position.z = -17.4;

		this.add (physiPared);	
		this.add (ground);
		
		var geometriaMeta = new THREE.BoxGeometry (5,0.2,5);
		var materialMeta = new THREE.MeshPhongMaterial ({color: 0x54FF00});
		var physiMaterialMeta = Physijs.createMaterial (materialMeta, 0.2, 1);
		var meta = new Physijs.BoxMesh (geometriaMeta, physiMaterialMeta, 0);

		meta.position.set(25, 0, 0);

		//variable necesaria para controlar en el update el cambio de nivel
		this.ganado = false;
		var that = this;
		meta.addEventListener ('collision',
			function (o,v,r,n) {
				if (o.colisionable){					
					that.mostrarMensaje(4);
					that.ganado = true;
				}
			}
		);

		this.add(meta);
	}

	createNivel2(){
		var geometriaCircuito = new THREE.BoxGeometry (100,0.2,10);
		var geometriaSalida = new THREE.BoxGeometry (5,0.2,5);
		var geometriaMeta = new THREE.BoxGeometry (5,0.2,5);

		var materialCircuito = new THREE.MeshPhongMaterial ({color: 0xFFFFFF});
		var materialSalida = new THREE.MeshPhongMaterial ({color: 0xFF6B6B});
		var materialMeta = new THREE.MeshPhongMaterial ({color: 0x54FF00});		

		var physiMaterialCircuito = Physijs.createMaterial (materialCircuito, 0.2, 1);
		var physiMaterialSalida = Physijs.createMaterial (materialSalida, 0.2, 1);
		var physiMaterialMeta = Physijs.createMaterial (materialMeta, 0.2, 1);

		var circuito = new Physijs.BoxMesh (geometriaCircuito, physiMaterialCircuito, 0);
		var salida = new Physijs.BoxMesh (geometriaSalida, physiMaterialSalida, 0);
		var meta = new Physijs.BoxMesh (geometriaMeta, physiMaterialMeta, 0);

		circuito.position.set(-52.5, 100, 0);
		salida.position.set(0, 100, 0);
		meta.position.set(-105, 103, 0);

		var that = this;
		meta.addEventListener ('collision',
			function (o,v,r,n) {
				if (o.colisionable)
					that.mostrarMensaje(4);
			}
		);

		this.add(circuito);
		this.add(salida);
		this.add(meta);
	}
	
	createLights () {
		var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
		this.add (ambientLight);
		this.spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
		this.spotLight.position.set( 60, 160, 40 );
		this.add (this.spotLight);
	}
	
	getCamera () {
		return this.camera;
	}
	
	setCameraAspect (ratio) {
		this.camera.aspect = ratio;
		this.camera.updateProjectionMatrix();
	}

	sceneReset( muerte = false){
		//variables que permiten poner la bola en su estado inicial y mantenerlo
		this.bola.__dirtyPosition = true;
		this.bola.__dirtyRotation = true;
		this.rotacion = 0;
		this.bola.setLinearVelocity(new THREE.Vector3(0, 0, 0));
		this.bola.setAngularVelocity (new THREE.Vector3(0,0,0));
		//selecciona según el nivel una posición y un mensaje
		if(!muerte){
			if(this.nivel == 0){
				this.bola.position.set(0,5,0);
				this.mostrarMensaje(2);
			} else if(this.nivel == 1) {
				this.bola.position.set(0, 105, 0);
				this.mostrarMensaje(3);
			}
		}
		else {
			if(this.nivel == 0){
				this.bola.position.set(0,5,0);
				this.mostrarMensaje(1);
			} else if(this.nivel == 1) {
				this.bola.position.set(0, 105, 0);
				this.mostrarMensaje(1);
			}
		}
	}

	crearMensajes(){

		//primero cargamos la fuente y creamos los parámetros del texto que vayamos a usar
		//el texto se crea con THREE.TextGeometry, es un objeto no físico
		//inicializamos el cargador de fuentes
		var loader = new THREE.FontLoader();
		//hacemos that = this para acceder a this (la escena) desde el callback
		var that = this;
		//los mensajes son de tamaño similar así que usan los mismos parámetros, que se almacenan en un JSON
		this.paramTexto = null;
		var loaded = false;
		loader.load('helvetiker_regular.typeface.json', function (font) {
			that.paramTexto = {
				font: font,
				size: 3,
				height: 1,
				curveSegments: 6,
				bevelEnabled: true,
				bevelThickness: 0.1,
				bevelSize: 0.1,
				bevelOffset: 0,
				bevelSegments: 3
			}
			that.crearMensajes2();
		});
	}

	crearMensajes2(){

		//se inicializa una variable usada en update
		this.contadorTexto = 0;

		//mensaje del jugador al perder
		var geometriaTexto = new THREE.TextGeometry("Has muerto", this.paramTexto);
		var material = new THREE.MeshBasicMaterial( { color: 0xA50A0A } );			
		this.textoMuerte = new THREE.Mesh (geometriaTexto, material);
		this.textoMuerte.position.set(0, -1000, 0);
		this.add(this.textoMuerte);

		//mensaje de haber seleccionado el circuito 1
		var geometriaTexto = new THREE.TextGeometry("Primer circuito", this.paramTexto);
		var material = new THREE.MeshBasicMaterial( { color: 0xA50A0A } );			
		this.textoGround = new THREE.Mesh (geometriaTexto, material);
		this.textoGround.position.set(0, -1000, 0);
		this.add(this.textoGround);

		//mensaje de haber seleccionado el circuito 2
		var geometriaTexto = new THREE.TextGeometry("Segundo circuito", this.paramTexto);
		var material = new THREE.MeshBasicMaterial( { color: 0xA50A0A } );			
		this.textoNivel2 = new THREE.Mesh (geometriaTexto, material);
		this.textoNivel2.position.set(0, -1000, 0);
		this.add(this.textoNivel2);

		//mensaje de ganar
		var geometriaTexto = new THREE.TextGeometry("Has ganado", this.paramTexto);
		var material = new THREE.MeshBasicMaterial( { color: 0xA50A0A } );			
		this.textoGanar = new THREE.Mesh (geometriaTexto, material);
		this.textoGanar.position.set(0, -1000, 0);
		this.add(this.textoGanar);
	}

	mostrarMensaje(numeroMensaje){
		//un switch que elige que mensaje motrar
		//si se ha seleccionado antes un mensaje, se oculta
		if(this.meshTexto != null){
			this.meshTexto.position.set(0,-1000,0);
		}
		//si no, se guarda en this.meshTexto, al hacer 0 this.meshTexto se pone a nulo, evitando mover texto en update
		switch(numeroMensaje) {
			case 0: this.meshTexto = null; break;
			case 1: this.meshTexto = this.textoMuerte; break;
			case 2: this.meshTexto = this.textoGround; break;
			case 3: this.meshTexto = this.textoNivel2; break;
			case 4: this.meshTexto = this.textoGanar; break;
		}
		if(numeroMensaje != 0){
			this.contadorTexto = 75;
		}
	}

	update () {

		//
		if(this.bola._physijs.touches.length != 0){
			if(this.pulsarW){
				var impulso = new THREE.Vector3(-4,0,-4);
				this.bola.applyForce(impulso.applyAxisAngle(new THREE.Vector3(0,1,0), this.rotacion), new THREE.Vector3(0,1,0));
			}
			if(this.pulsarS){
				var impulso = new THREE.Vector3(4,0,4);
				this.bola.applyForce(impulso.applyAxisAngle(new THREE.Vector3(0,1,0), this.rotacion), new THREE.Vector3(0,1,0));
			}
			if(this.pulsarA){
		        var matrix = this.bola.matrixWorld;
		        this.camera.matrix = matrix; 
				this.rotacion += MyPhysiScene.CONSROTA;
			}
			if(this.pulsarD){
				var matrix = this.bola.matrixWorld;
		        this.camera.matrix = matrix;
				this.rotacion -= MyPhysiScene.CONSROTA;
			}
			if(this.pulsarEspacio){
		        this.bola.applyCentralImpulse(new THREE.Vector3(0,20,0));
		        this.pulsarEspacio = false;
			}
		}
		
		//pone la camara seguiendo a la bola, rotando 
		var separacion = new THREE.Vector3(10,5,10);
		separacion.applyAxisAngle(new THREE.Vector3(0,1,0), this.rotacion);
		this.camera.position.set(this.bola.position.x + separacion.x, this.bola.position.y + separacion.y, this.bola.position.z+ separacion.z); 
		this.camera.lookAt(this.bola.position);

		//si hay un texto en la variable de texto a mostrar, se pone junto a la bola
		if(this.meshTexto != null){
			if(this.contadorTexto > 0){
				this.contadorTexto = this.contadorTexto - 1;	
				var separacionTexto = new THREE.Vector3(-1,1,1);
				separacionTexto.applyAxisAngle(new THREE.Vector3(0,1,0), this.rotacion + ( 45 * Math.PI/180));
				this.meshTexto.position.set(this.bola.position.x + separacionTexto.x -10, this.bola.position.y + separacionTexto.y, this.bola.position.z + separacionTexto.z +5);
				this.meshTexto.lookAt(this.camera.position);
			}
			else if(this.contadorTexto == 0 && !this.ganado){
				this.meshTexto.position.set(0, -1000, 0);
				this.mostrarMensaje(0);
			}
			else if(this.contadorTexto == 0 && this.ganado){
				this.meshTexto.position.set(0, -1000, 0);
				this.mostrarMensaje(0);
				this.nivel = 1;
				this.ganado = false;
				this.sceneReset();
			}
		}
		
		if(this.bola.position.y < -25 && this.nivel == 0){
			this.sceneReset(true);
		}
		else if(this.bola.position.y < 75 && this.nivel == 1){
			this.sceneReset(true);
		}

		var velocity = null;
		var brake = MyPhysiScene.BRAKE;
		velocity = this.bola.getAngularVelocity();
		this.bola.setAngularVelocity (new THREE.Vector3(velocity.x*brake, velocity.y*brake, velocity.z*brake));
		this.simulate ();
	}
}

MyPhysiScene.CONSROTA = Math.PI/180;
MyPhysiScene.BRAKE=0.95; // En cada frame se reduce la velocidad angular de las esferas un 5%
