
// You can write more code here

/* START OF COMPILED CODE */

class battle extends Phaser.Scene {

	constructor() {
		super("battle");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	// 1️⃣ PRELOAD: Cargar todos los assets con rutas verificadas
	preload() {
		// Cargar asset packs JSON
		this.load.pack("background", "src/assets/background/background_asset.json");
		this.load.pack("backgroundObjects", "src/assets/backgroundObjects/backgroundObjects_asset.json");
		this.load.pack("platform", "src/assets/platform/platform_asset.json");

		// ✅ FIX: Cargar los tres asset packs de Hornet por separado
		this.load.pack("hornet_idle", "src/assets/hornet/idle/hornet_idle_asset.json");
		this.load.pack("hornet_run", "src/assets/hornet/run/sprites/hornet_run_asset.json");
		this.load.pack("hornet_jump", "src/assets/hornet/jump/jump_sprites/hornet_jump_asset.json");

		// Cargar imagen adicional que no está en los packs (comentada porque no existe)
		// this.load.image("Gemini_Generated_Image_36wnpx36wnpx36wn(1)_1", "src/assets/backgroundObjects/Gemini_Generated_Image_36wnpx36wnpx36wn(1)_1.png");
	}

	// 2️⃣ EDITORCREATE: Generado, pero corregido con 'this.' para evitar conflictos
	/** @returns {void} */
	editorCreate() {

		// gemini_Generated_Image_vp1tznvp1tznvp1t_1_ (Fondo principal)
		const bg = this.add.image(384, 281, "Gemini_Generated_Image_vp1tznvp1tznvp1t(1)");
		bg.scaleX = 0.35066970010407383;
		bg.scaleY = 0.5475445752379887;

		// harinapan (Edificio del fondo)
		const harinapan = this.add.image(653, 450, "harinapan");
		harinapan.scaleX = 0.261155160502633;
		harinapan.scaleY = 0.2964073455377455;

		// edificio
		const edificio = this.add.image(61, 398, "edificio");
		edificio.scaleX = 0.19685119272339005;
		edificio.scaleY = 0.32724702996480964;

		// Otro edificio decorativo - verificar si existe
		// const gemini_Generated_Image_36wnpx36wnpx36wn_1__1 = this.add.image(39, 407, "Gemini_Generated_Image_36wnpx36wnpx36wn(1)_1");
		// gemini_Generated_Image_36wnpx36wnpx36wn_1__1.scaleX = 0.17048086581338262;
		// gemini_Generated_Image_36wnpx36wnpx36wn_1__1.scaleY = 0.28172874204658394;

		// baranda_atras (Baranda de fondo)
		const baranda_atras = this.add.image(339, 540, "baranda_atras");
		baranda_atras.scaleX = 0.6162439803752455;
		baranda_atras.scaleY = 0.06761660397365078;

		// ✅ FIX: Usar 'this.platform' en lugar de conflicto de nombres
		this.platform = new platform_prefab(this, 419, 573);
		this.add.existing(this.platform);
		this.platform.scaleX = 0.6;
		this.platform.scaleY = 0.07;

		// ✅ FIX: Configurar plataforma como inmóvil (Error #4 de la guía)
		this.platform.body.setImmovable(true);
		this.platform.body.allowGravity = false;

		// ✅ FIX: Usar 'this.player' en lugar de conflicto de nombres
		this.player = new hornetPrefab(this, 76, 586);
		this.add.existing(this.player);
		this.player.scaleX = 0.7;
		this.player.scaleY = 0.7;
		this.player.setOrigin(0.5, 1);

		// Barandas decorativas del frente
		const baranda = this.add.image(-12, 588, "baranda");
		baranda.scaleX = 0.1596110705337342;
		baranda.scaleY = 0.13092539050211358;

		const baranda_1 = this.add.image(855, 593, "baranda");
		baranda_1.scaleX = 0.1596110705337342;
		baranda_1.scaleY = 0.13092539050211358;
		baranda_1.angle = -3;

		// ✅ FIX: Usar this.player y this.platform en colisión
		this.physics.add.collider(this.player, this.platform);

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// 3️⃣ CREATE: Inicialización lógica
	create() {
		this.editorCreate();

		// Configurar controles de teclado
		this.cursors = this.input.keyboard.createCursorKeys();

		// Configurar físicas de Hornet
		this.player.setGravityY(500);
		this.player.setBounce(0.1);
		this.player.setCollideWorldBounds(true);
	}

	// 4️⃣ UPDATE: Bucle de juego
	update() {
		// Velocidad de movimiento
		const speed = 200;
		const jumpVelocity = -400;

		// Movimiento horizontal
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-speed);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(speed);
		} else {
			this.player.setVelocityX(0);
		}

		// Salto - activar animación manualmente (evita bucles de animación)
		if (this.cursors.up.isDown && this.player.body.onFloor()) {
			this.player.setVelocityY(jumpVelocity);
			this.player.playJump(); // Activar animación de salto
		}

		// Actualizar animaciones del prefab (idle y run)
		this.player.update();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
