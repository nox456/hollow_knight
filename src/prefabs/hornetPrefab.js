
// You can write more code here

/* START OF COMPILED CODE */

class hornetPrefab extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 8, y ?? 27, texture || "sprite-1-2", frame);

		this.setOrigin(0.5, 1);
		scene.physics.add.existing(this, false);
		this.body.setSize(182, 214, false);

		/* START-USER-CTR-CODE */
		// Inicializar propiedades de animación
		this.currentState = 'idle';
		this.isJumping = false;
		this.isRunning = false;

		// Cargar las animaciones si no existen
		this.createAnimations(scene);

		// Iniciar con la animación idle
		this.play('idlesprite');

		// Aplicar efectos de brillo (Rim Lighting) según GUIA_APLICAR_BRILLO.md
		this.applyGlowEffects();
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	/**
	 * Crea las animaciones de Hornet si aún no existen
	 * @param {Phaser.Scene} scene - La escena de Phaser
	 */
	createAnimations(scene) {
		// Verificar si las animaciones ya existen antes de crearlas
		if (!scene.anims.exists('idlesprite')) {
			// Animación de idle
			scene.anims.create({
				key: 'idlesprite',
				frames: [
					{ key: 'sprite-1-2' },
					{ key: 'sprite-1-3' },
					{ key: 'sprite-1-4' },
					{ key: 'sprite-1-5' },
					{ key: 'sprite-1-6' },
					{ key: 'sprite-1-7' }
				],
				frameRate: 8,
				repeat: -1
			});
		}

		if (!scene.anims.exists('runrun_sprite')) {
			// Animación de correr
			scene.anims.create({
				key: 'runrun_sprite',
				frames: [
					{ key: 'run_sprite-1-1' },
					{ key: 'run_sprite-1-2' },
					{ key: 'run_sprite-1-3' },
					{ key: 'run_sprite-1-4' },
					{ key: 'run_sprite-1-5' },
					{ key: 'run_sprite-1-6' },
					{ key: 'run_sprite-1-7' },
					{ key: 'run_sprite-1-8' }
				],
				frameRate: 8,
				repeat: -1
			});
		}

		if (!scene.anims.exists('jumpprepare_jump_sprite')) {
			// Animación de salto
			scene.anims.create({
				key: 'jumpprepare_jump_sprite',
				frames: [
					{ key: 'prepare_jump_sprite-1-4' },
					{ key: 'jump_sprite-1-1' },
					{ key: 'jump_sprite-1-2' },
					{ key: 'jump_sprite-1-3' },
					{ key: 'jump_sprite-1-4' },
					{ key: 'jump_sprite-1-5' },
					{ key: 'jump_sprite-1-6' },
					{ key: 'land_sprite-1-1' },
					{ key: 'land_sprite-1-2' },
					{ key: 'land_sprite-1-3' }
				],
				frameRate: 8,
				repeat: 0 // No se repite, se ejecuta una vez
			});
		}
	}

	/**
	 * Reproduce la animación de idle
	 */
	playIdle() {
		if (this.currentState !== 'idle' && !this.isJumping) {
			this.currentState = 'idle';
			this.isRunning = false;
			this.play('idlesprite', true);
		}
	}

	/**
	 * Reproduce la animación de correr
	 */
	playRun() {
		if (this.currentState !== 'run' && !this.isJumping) {
			this.currentState = 'run';
			this.isRunning = true;
			this.play('runrun_sprite', true);
		}
	}

	/**
	 * Reproduce la animación de salto
	 */
	playJump() {
		if (!this.isJumping) {
			this.currentState = 'jump';
			this.isJumping = true;
			this.play('jumpprepare_jump_sprite', true);

			// Escuchar cuando termine la animación de salto
			this.once('animationcomplete-jumpprepare_jump_sprite', () => {
				this.isJumping = false;
				// Volver a idle o run dependiendo del estado de movimiento
				if (this.isRunning) {
					this.playRun();
				} else {
					this.playIdle();
				}
			});
		}
	}

	/**
	 * Aplica efectos de brillo (Rim Lighting) según especificaciones
	 * de GUIA_APLICAR_BRILLO.md para ambiente de incendio urbano
	 */
	applyGlowEffects() {
		// B. Mapeo de tintes "Naranja Fuego" suave
		// Formato: (Superior-Izquierda, Superior-Derecha, Inferior-Izquierda, Inferior-Derecha)
		this.setTint(0xffffff, 0xffcc88, 0xffffff, 0xff7722);
	}

	/**
	 * Método update para gestionar las animaciones automáticamente
	 * Llama este método desde el update de tu escena
	 */
	update() {
		// Si está en el suelo y tiene velocidad horizontal, correr
		if (this.body.velocity.x !== 0 && this.body.onFloor() && !this.isJumping) {
			this.playRun();
			// Voltear sprite según la dirección (invertido)
			this.setFlipX(this.body.velocity.x > 0);
		}
		// Si está en el suelo sin velocidad horizontal, idle
		else if (this.body.velocity.x === 0 && this.body.onFloor() && !this.isJumping) {
			this.playIdle();
		}
		// No activar automáticamente el salto - se maneja manualmente desde la escena
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
