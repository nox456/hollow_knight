class battle extends Phaser.Scene {
	constructor() {
		super("battle");
	}

	preload() {
		this.load.pack("background", "src/assets/background/background_asset.json");
		this.load.pack("backgroundObjects", "src/assets/backgroundObjects/backgroundObjects_asset.json");
		this.load.pack("platform", "src/assets/platform/platform_asset.json");

		this.load.pack("hornet_idle", "src/assets/hornet/idle/hornet_idle_asset.json");
		this.load.pack("hornet_run", "src/assets/hornet/run/sprites/hornet_run_asset.json");
		this.load.pack("hornet_jump", "src/assets/hornet/jump/jump_sprites/hornet_jump_asset.json");
		this.load.pack("hornet_dash", "src/assets/hornet/dash/sprites/dash_assets.json");
		this.load.pack("hornet_dash_air", "src/assets/hornet/dash_in_air/sprites/a_dash_asset.json");
		this.load.pack("hornet_attack", "src/assets/hornet/attack/sprites/attack_asset.json");

		this.load.animation("hornet_idle_anim", "src/assets/hornet/idle/hornet_idle.json");
		this.load.animation("hornet_run_anim", "src/assets/hornet/run/hornet_run.json");
		this.load.animation("hornet_jump_anim", "src/assets/hornet/jump/jump_sprites/hornet_jump.json");
		this.load.animation("hornet_dash_anim", "src/assets/hornet/dash/dash.json");
		this.load.animation("hornet_dash_air_anim", "src/assets/hornet/dash_in_air/a_dash.json");
		this.load.animation("hornet_attack_anim", "src/assets/hornet/attack/attack.json");

		this.load.image("ash_1", "src/assets/particles/sprites/particle_sprite-1-1.png");
		this.load.image("ash_2", "src/assets/particles/sprites/particle_sprite-13-1.png");
		this.load.image("ash_3", "src/assets/particles/sprites/particle_sprite-13-2.png");
		this.load.image("ash_4", "src/assets/particles/sprites/particle_sprite-16-1.png");
		this.load.image("ash_5", "src/assets/particles/sprites/particle_sprite-2-1.png");
		this.load.image("ash_6", "src/assets/particles/sprites/particle_sprite-6-1.png");
		this.load.image("ash_7", "src/assets/particles/sprites/particle_sprite-5-1.png");
		this.load.image("ash_8", "src/assets/particles/sprites/particle_sprite-8-1.png");
		this.load.image("ash_9", "src/assets/particles/sprites/particle_sprite-9-1.png");
		this.load.image("ash_10", "src/assets/particles/sprites/particle_sprite-11-1.png");

		this.load.image("particle_spark", "src/assets/particles/sprites/particle_sprite-4-1.png");
	}

	editorCreate() {
		const bg = this.add.image(700, 300, "Gemini_Generated_Image_vp1tznvp1tznvp1t(1)");
		bg.scaleX = 1.2;
		bg.scaleY = 0.5475445752379887;

		const harinapan = this.add.image(1000, 450, "harinapan");
		harinapan.scaleX = 0.261155160502633;
		harinapan.scaleY = 0.2964073455377455;

		const edificio = this.add.image(61, 398, "edificio");
		edificio.scaleX = 0.19685119272339005;
		edificio.scaleY = 0.32724702996480964;

		this.platform = new platform_prefab(this, 700, 585);
		this.add.existing(this.platform);
		this.platform.scaleX = 1.5;
		this.platform.scaleY = 0.07;
		this.platform.refreshBody();
		this.platform.body.setImmovable(true);
		this.platform.body.allowGravity = false;

		this.player = new hornetPrefab(this, 200, 555);
		this.add.existing(this.player);
		this.player.setOrigin(0.5, 1);
		this.player.scaleX = 0.7;
		this.player.scaleY = 0.7;
		this.player.refreshBody();

		this.physics.add.collider(this.player, this.platform);

		this.events.emit("scene-awake");
	}

	create() {
		this.editorCreate();
		this.createAtmosphere();
		this.player.controls.initialize();
		this.setupEventListeners();
	}

	setupEventListeners() {
		this.events.on(GameEvents.PLAYER_HURT, (data) => {
			console.log(`Hornet hurt! Health: ${data.health}/${data.maxHealth}`);
		});

		this.events.on(GameEvents.PLAYER_DEAD, () => {
			console.log('Hornet died!');
		});

		this.events.on(GameEvents.PLAYER_DASH_START, (isAirDash) => {
			console.log(`Dash! Air: ${isAirDash}`);
		});

		this.events.on(GameEvents.PLAYER_ATTACK_START, () => {
			console.log('Hornet attacked!');
		});
	}

	createAtmosphere() {
		const width = this.scale.width;
		const height = this.scale.height;

		const ashTextures = ['ash_1', 'ash_2', 'ash_3', 'ash_4', 'ash_5', 'ash_6', 'ash_7', 'ash_8', 'ash_9', 'ash_10'];

		this.ashEmitters = [];

		ashTextures.forEach((texture, index) => {
			const emitter = this.add.particles(0, 0, texture, {
				x: { min: 0, max: width },
				y: -100,
				lifespan: 11000,
				speedX: { min: -40 - (index * 2), max: 10 + (index * 2) },
				speedY: { min: 30 + (index * 5), max: 80 + (index * 2) },
				scale: { start: 0.6, end: 0.2 },
				alpha: { start: 0.8, end: 0.1 },
				rotate: { min: 0, max: 360 },
				frequency: 1500 + (index * 100),
				blendMode: 'NORMAL'
			});
			emitter.setDepth(5);
			this.ashEmitters.push(emitter);
		});

		const sparkEmitter = this.add.particles(0, 0, 'particle_spark', {
			emitZone: {
				type: 'random',
				source: new Phaser.Geom.Rectangle(0, height, width, 50)
			},
			lifespan: 2500,
			speedY: { min: -150, max: -300 },
			speedX: { min: -50, max: 50 },
			scale: { start: 0.6, end: 0 },
			tint: [0xffcc00, 0xff4400, 0xff0000],
			blendMode: 'ADD',
			alpha: { start: 1, end: 0 },
			frequency: 200
		});
		sparkEmitter.setDepth(20);
	}

	update() {
	}
}
