
// You can write more code here

/* START OF COMPILED CODE */

class hornetPrefab extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 8, y ?? 27, texture || "sprite-1-2", frame);

		this.setOrigin(0.5, 1);
		scene.physics.add.existing(this, false);

		const bodyWidth = 80;
		const bodyHeight = 120;
		const offsetX = (182 - bodyWidth) / 2;
		const offsetY = 214 - bodyHeight;

		// Store original body values to maintain during animations
		this.originalBodyOffsetX = offsetX;
		this.originalBodyOffsetY = offsetY;
		this.originalBodyWidth = bodyWidth;
		this.originalBodyHeight = bodyHeight;

		this.body.setSize(bodyWidth, bodyHeight, false);
		this.body.setOffset(offsetX, offsetY);
		this.removeInteractive();

		this.controls = new InputComponent(scene, this);
		this.movement = new MovementComponent(this);
		this.health = new HealthComponent(this);
		this.combat = new CombatComponent(this);
		this.animation = new AnimationComponent(scene, this);
		this.stateMachine = new StateMachineComponent(this);
		this.registerStates();

		this.setGravityY(Config.HORNET_GRAVITY);
		this.setBounce(Config.HORNET_BOUNCE);
		this.setCollideWorldBounds(true);
		this.applyGlowEffects();

		this._needsInitialState = true;
		this._physicsInitialized = false;
	}

	registerStates() {
		this.stateMachine.registerState('IDLE', new IdleState(this));
		this.stateMachine.registerState('RUN', new RunState(this));
		this.stateMachine.registerState('JUMP', new JumpState(this));
		this.stateMachine.registerState('DASH', new DashState(this));
		this.stateMachine.registerState('DASH_IN_AIR', new DashInAirState(this));
		this.stateMachine.registerState('ATTACK', new AttackState(this));
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		if (this._needsInitialState) {
			this._needsInitialState = false;
			this.controls.initialize();
			this.stateMachine.setState('IDLE');
			return;
		}

		if (!this._physicsInitialized) {
			this._physicsInitialized = true;
		}

		this.controls.update();
		this.movement.update(delta);
		this.health.update();
		this.combat.update();
		this.stateMachine.update(delta);
	}

	applyGlowEffects() {
		this.setTint(
			Config.GLOW_TINT_TOP_LEFT,
			Config.GLOW_TINT_TOP_RIGHT,
			Config.GLOW_TINT_BOTTOM_LEFT,
			Config.GLOW_TINT_BOTTOM_RIGHT
		);
	}

	// Get stable hitbox bounds (not affected by animation)
	getStableHitbox() {
		let width = this.originalBodyWidth;
		let offsetX = this.x - (width / 2);

		// Extend hitbox during attack in the direction player is facing
		if (this.combat.isAttacking) {
			const attackExtension = 60;
			width += attackExtension;

			if (this.flipX) {
				// Facing left - extend to the left
				offsetX = this.x - width + (this.originalBodyWidth / 2);
			} else {
				// Facing right - extend to the right
				offsetX = this.x - (this.originalBodyWidth / 2);
			}
		}

		return {
			x: offsetX,
			y: this.y - this.originalBodyHeight,
			width: width,
			height: this.originalBodyHeight
		};
	}
}
