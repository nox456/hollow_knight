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

		// Sub-Zero boss animation assets
		this.load.pack("subzero_special_idle", "src/assets/sub-zero/special_idle/sprites/special_idle_asset.json");
		this.load.pack("subzero_idle", "src/assets/sub-zero/idle/sprites/idle_asset.json");
		this.load.pack("subzero_walking", "src/assets/sub-zero/walking/walking_asset.json");
		this.load.pack("subzero_punch", "src/assets/sub-zero/punching/punch_asset.json");
		this.load.pack("subzero_kick", "src/assets/sub-zero/Kicking/kick_asset.json");
		this.load.pack("subzero_being_hit", "src/assets/sub-zero/being_hit/being_hit_asset.json");
		this.load.pack("subzero_die", "src/assets/sub-zero/die/sprites/die_asset.json");
		this.load.pack("subzero_dizzy", "src/assets/sub-zero/dizzy/sprites/dizzy_asset.json");
		// New Phase Animations
		// New Phase Animations
		this.load.pack("subzero_blocking", "src/assets/sub-zero/blocking/blocking_asset.json");
		// subzero_being_hit pack already contains being_hit2 images
		this.load.pack("subzero_falling", "src/assets/sub-zero/falling/falling_asset.json");
		this.load.pack("subzero_special_attack", "src/assets/sub-zero/special_atack/special_attack_asset.json");

		// Sub-Zero animation definitions
		this.load.animation("subzero_special_idle_anim", "src/assets/sub-zero/special_idle/special_idle.json");
		this.load.animation("subzero_idle_anim", "src/assets/sub-zero/idle/idle.json");
		this.load.animation("subzero_walking_anim", "src/assets/sub-zero/walking/walking.json");
		this.load.animation("subzero_punch_anim", "src/assets/sub-zero/punching/punching.json");
		this.load.animation("subzero_kick_anim", "src/assets/sub-zero/Kicking/kick.json");
		this.load.animation("subzero_die_anim", "src/assets/sub-zero/die/die.json");
		this.load.animation("subzero_dizzy_anim", "src/assets/sub-zero/dizzy/dizzy.json");
		this.load.animation("subzero_being_hit_anim", "src/assets/sub-zero/being_hit/being_hit.json");
		// New Phase Animation Definitions
		this.load.animation("subzero_blocking_anim", "src/assets/sub-zero/blocking/sprites/blocking.json");
		this.load.animation("subzero_being_hit2_anim", "src/assets/sub-zero/being_hit/sprites/being_hit2.json");
		this.load.animation("subzero_falling_anim", "src/assets/sub-zero/falling/falling.json");
		this.load.animation("subzero_special_attack_anim", "src/assets/sub-zero/special_atack/special_attack.json");
		// Wait, for Phaser packs, usually it loads the atlas/image. The animation JSON is separate.
		// User provided paths:
		// @[src/assets/sub-zero/blocking/sprites/blocking.json] -> Pack? Or Atlas? Usually "sprites" folder implies pack or atlas.
		// Let's assume standard pattern:
		// Pack: src/assets/sub-zero/[name]/sprites/[name]_asset.json (like existing ones)
		// Animation: src/assets/sub-zero/[name]/[name].json

		// Let's look at existing patterns in battle.js:
		// Pack: "src/assets/sub-zero/punching/punch_asset.json"
		// Anim: "src/assets/sub-zero/punching/punching.json"

		// User paths:
		// blocking: src/assets/sub-zero/blocking/sprites/blocking.json (this looks like the atlas/pack file? or just animation?)
		// The user said: "animation of @[src/assets/sub-zero/blocking/sprites/blocking.json]"
		// This is tricky. Sometimes specific file is just the animation definition, sometimes it's the atlas.
		// Given existing files in `list_dir` output:
		// blocking/ has 5 children.
		// falling/ has 15 children.

		// Let's try to load the animation JSONs directly assuming they are valid Phaser animation JSONs.
		// If they are Packs, `load.pack` works. If they are Animations, `load.animation` works.
		// The user explicitly linked .json files.
		// I will trust the paths provided for what they are likely to be based on context (Animation vs Pack).
		// But for `blocking.json` inside `sprites` folder... usually `sprites` folder has the atlas/png.
		// Let's assume the user meant the animation definition file, but check the path.
		// Existing: `src/assets/sub-zero/special_idle/sprites/special_idle_asset.json` (Pack)
		// User: `src/assets/sub-zero/blocking/sprites/blocking.json` -> Likely the PACK/ATLAS definition.

		// I will add them as packs AND try to load standard animation files if I can guess them, OR 
		// rely on `load.animation` if the user pointed to the animation file.

		// Actually, let's look at `list_dir` output again.
		// I didn't list inside `blocking` or `falling`.
		// Safe bet: Load what user gave as Pack first (if it has textures), and try to find animation file.
		// But better: I will list the directories to be sure.

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

		// Load background music
		this.load.audio("deep_docks_theme", "src/assets/sounds/song/cancion.wav");

		// Load Hornet SFX
		this.load.audio("hornet_run_sfx", "src/assets/sounds/hornet/run.wav");
		this.load.audio("hornet_attack_sfx", "src/assets/sounds/hornet/attack_1.wav");
		this.load.audio("hornet_dash_sfx", "src/assets/sounds/hornet/dash.wav");
		this.load.audio("hornet_jump_sfx", "src/assets/sounds/hornet/jump.wav");
		this.load.audio("hornet_hurt_sfx", "src/assets/sounds/hornet/hurt.wav");

		// Load Boss SFX
		this.load.audio("boss_punch_sfx", "src/assets/sounds/subzero/golpe.wav");
		this.load.audio("boss_kick_sfx", "src/assets/sounds/subzero/patada.wav");
		this.load.audio("boss_hurt_1_sfx", "src/assets/sounds/subzero/daño_1.wav");
		this.load.audio("boss_hurt_2_sfx", "src/assets/sounds/subzero/daño_2.wav");
		this.load.audio("boss_dizzy_sfx", "src/assets/sounds/subzero/mareado.wav");
		this.load.audio("boss_death_sfx", "src/assets/sounds/subzero/muerte.wav");
		this.load.audio("final_hit_sfx", "src/assets/sounds/hornet/audio_final.wav");
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

		// Create boss on the right side of the screen
		this.boss = new bossPrefab(this, 1100, 555);
		this.add.existing(this.boss);
		this.boss.setTarget(this.player);

		this.physics.add.collider(this.player, this.platform);
		this.physics.add.collider(this.boss, this.platform);

		// Boss-player collider for physical separation (Hornet cannot pass through Boss)
		this.physics.add.collider(this.player, this.boss, () => {
			// Boss attacks player when colliding
			this.boss.onPlayerCollision();

			// Deal damage only when boss is attacking
			if (this.boss.isAttacking) {
				const isFacingPlayer = (this.boss.flipX && this.player.x < this.boss.x) ||
					(!this.boss.flipX && this.player.x > this.boss.x);

				if (isFacingPlayer) {
					const knockbackDir = this.boss.x < this.player.x ? 1 : -1;
					const knockbackForce = this.boss.currentKnockbackForce || Config.PLAYER_KNOCKBACK_VELOCITY;
					this.player.health.takeDamage(this.boss.currentAttackDamage, knockbackDir, knockbackForce);
				}
			}
			// Player attacks boss when colliding and attacking
			// Note: Usually player attack range is slightly larger than body, so overlap check in Update 
			// (lines 260+) handles weapon range. 
			// But if they physically touch body-to-body, we can also check here as a fallback or close range logic.
			if (this.player.combat.isAttacking) {
				const attackDirection = this.player.flipX ? -1 : 1;
				this.boss.hurt(attackDirection);
			}
		});

		this.events.emit("scene-awake");
	}

	create() {
		this.editorCreate();
		this.createAtmosphere();
		this.createUI();
		this.player.controls.initialize();
		this.setupEventListeners();

		// // Play background music
		this.bgm = this.sound.add("deep_docks_theme", {
			loop: true,
			volume: 0.3
		});
		this.bgm.play();
	}

	createUI() {
		// Player health bar at top left
		this.playerHealthBar = new HealthBarUI(this, 20, 20, 200, 20);

		// Boss health bar at top right
		this.bossHealthBar = new HealthBarUI(this, 1180, 20, 200, 20, {
			hurtEvent: 'boss_hurt',
			healEvent: 'boss_healed'
		});


		// Pause with ESC key
		this.input.keyboard.on('keydown-ESC', () => {
			if (!this.scene.isPaused('battle')) {
				this.scene.pause();
				this.scene.launch('PauseScene');
			}
		});
	}

	setupEventListeners() {
		this.events.on(GameEvents.PLAYER_HURT, (data) => {
			console.log(`Hornet hurt! Health: ${data.health}/${data.maxHealth}`);
			if (this.sound) {
				this.sound.play('hornet_hurt_sfx');
			}
			if (this.player && this.player.stateMachine) {
				this.player.stateMachine.setState('HURT');
			}
		});

		this.events.on(GameEvents.PLAYER_DEAD, () => {
			this.player.destroy();
			this.playerHealthBar.destroy();

			// Show defeat text
			const defeatText = this.add.text(
				this.scale.width / 2,
				this.scale.height / 2,
				'PERDISTE!',
				{
					fontSize: '96px',
					fontFamily: 'Arial Black',
					color: '#ff0000',
					stroke: '#000000',
					strokeThickness: 8
				}
			);
			defeatText.setOrigin(0.5);
			defeatText.setDepth(1000);
		});

		this.events.on(GameEvents.PLAYER_DASH_START, (isAirDash) => {
			console.log(`Dash! Air: ${isAirDash}`);
		});

		this.events.on(GameEvents.PLAYER_ATTACK_START, () => {
			console.log('Hornet attacked!');
		});

		this.events.on('boss_dead', () => {
			// Wait for death animation to complete
			this.time.delayedCall(500, () => {
				if (this.boss && this.boss.active) {
					this.boss.destroy();
				}
				this.bossHealthBar.destroy();

				const victoryText = this.add.text(
					this.scale.width / 2,
					this.scale.height / 2,
					'GANASTE!',
					{
						fontSize: '96px',
						fontFamily: 'Arial Black',
						color: '#ffff00',
						stroke: '#000000',
						strokeThickness: 8
					}
				);
				victoryText.setOrigin(0.5);
				victoryText.setDepth(1000);
			});
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
		// Stable hitbox-based attack detection
		// Stable hitbox-based attack detection
		if (this.player && this.player.active && this.boss && this.boss.active) {

			// Check Player Attack on Boss
			if (this.player.combat.isAttacking) {
				const playerHitbox = this.player.getStableHitbox();
				const bossBody = this.boss.body;

				// Check rectangle intersection using stable player hitbox
				const intersects = Phaser.Geom.Intersects.RectangleToRectangle(
					new Phaser.Geom.Rectangle(playerHitbox.x, playerHitbox.y, playerHitbox.width, playerHitbox.height),
					new Phaser.Geom.Rectangle(bossBody.x, bossBody.y, bossBody.width, bossBody.height)
				);

				if (intersects && !this.player.combat.hasHit) {
					const attackDirection = this.player.flipX ? -1 : 1;
					this.player.combat.hasHit = true;
					this.boss.hurt(attackDirection);
					this.time.delayedCall(50, () => {
						this.triggerHitStop();
					});
				}
			}

			// Check Boss Attack on Player
			if (this.boss.isAttacking && this.boss.isDamageActive) {
				const bossAttackHitbox = this.boss.getAttackHitbox();
				const playerBody = this.player.body;

				const intersects = Phaser.Geom.Intersects.RectangleToRectangle(
					bossAttackHitbox,
					new Phaser.Geom.Rectangle(playerBody.x, playerBody.y, playerBody.width, playerBody.height)
				);

				if (intersects) {
					const knockbackDir = this.boss.x < this.player.x ? 1 : -1;
					const knockbackForce = this.boss.currentKnockbackForce || Config.PLAYER_KNOCKBACK_VELOCITY;
					this.player.health.takeDamage(this.boss.currentAttackDamage, knockbackDir, knockbackForce);
				}
			}
		}
	}

	triggerHitStop() {
		// 1. Pause Physics World
		this.physics.world.pause();

		// 2. Emit visual feedback events
		this.events.emit(GameEvents.HIT_STOP_START);
		this.events.emit(GameEvents.CAMERA_SHAKE_REQUEST, { duration: 100, intensity: 0.01 });
		this.events.emit(GameEvents.SPAWN_HIT_PARTICLES, {
			x: (this.player.x + this.boss.x) / 2,
			y: (this.player.y + this.boss.y) / 2
		});

		// Optional: Pause animations
		if (this.player.anims) this.player.anims.pause();
		if (this.boss.anims) this.boss.anims.pause();

		// 3. Resume after short duration (100-150ms)
		this.time.delayedCall(120, () => {
			this.physics.world.resume();

			if (this.player.anims) this.player.anims.resume();
			if (this.boss.anims) this.boss.anims.resume();

			this.events.emit(GameEvents.HIT_STOP_END);
		});
	}

	freezeGameFrame(duration) {
		// Helper to just pause logic if needed, but triggerHitStop handles the specific requirement
		// Keeping it if user wants a generic helper later
		this.physics.world.pause();
		this.time.delayedCall(duration, () => {
			this.physics.world.resume();
		});
	}
}
