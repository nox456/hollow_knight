class bossPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Create a taller texture with the square at the top (like player sprite)
        const textureHeight = Config.BOSS_SIZE + 20;
        const graphics = scene.add.graphics();
        graphics.fillStyle(Config.BOSS_COLOR, 1);
        graphics.fillRect(0, 0, Config.BOSS_SIZE, Config.BOSS_SIZE);
        graphics.generateTexture('boss_texture', Config.BOSS_SIZE, textureHeight);
        graphics.destroy();

        super(scene, x, y, 'boss_texture');

        this.scene = scene;
        this.target = null;
        this.isWindingUp = false;
        this.windupTimer = null;
        this.isAttacking = false;
        this.attackTimer = null;
        this.canAttack = true;
        this.isHurt = false;
        this.hurtTimer = null;

        // Health
        this.maxHealth = Config.BOSS_MAX_HEALTH;
        this.currentHealth = this.maxHealth;

        this.setOrigin(0.5, 1);
        scene.physics.add.existing(this, false);
        this.body.setSize(Config.BOSS_SIZE, Config.BOSS_SIZE);
        this.body.setOffset(0, 20);

        this.body.setGravityY(500);
        this.setCollideWorldBounds(true);
    }

    setTarget(target) {
        this.target = target;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.target || this.isWindingUp || this.isAttacking || this.isHurt) {
            return;
        }

        this.followTarget();
    }

    followTarget() {
        const targetX = this.target.x;
        const bossX = this.x;
        const distance = targetX - bossX;

        if (Math.abs(distance) > 10) {
            if (distance < 0) {
                this.body.setVelocityX(-Config.BOSS_SPEED);
                this.setFlipX(true);
            } else {
                this.body.setVelocityX(Config.BOSS_SPEED);
                this.setFlipX(false);
            }
        } else {
            this.body.setVelocityX(0);
        }
    }

    onPlayerCollision() {
        if (!this.canAttack || this.isWindingUp || this.isAttacking || this.isHurt) {
            return;
        }

        this.startWindup();
    }

    startWindup() {
        this.isWindingUp = true;
        this.canAttack = false;
        this.body.setVelocityX(0);

        // Turn orange during wind-up (preparing to attack)
        this.setTint(Config.BOSS_ATTACK_WINDUP_COLOR);

        // After wind-up, execute the actual attack
        this.windupTimer = this.scene.time.delayedCall(Config.BOSS_ATTACK_WINDUP_MS, () => {
            this.isWindingUp = false;
            this.attack();
        });
    }

    attack() {
        this.isAttacking = true;
        this.body.setVelocityX(0);

        // Turn red when attacking
        this.setTint(Config.BOSS_ATTACK_COLOR);

        // Attack duration - return to normal after attack
        this.attackTimer = this.scene.time.delayedCall(Config.BOSS_ATTACK_DURATION_MS, () => {
            this.isAttacking = false;
            this.clearTint();

            // Cooldown before next attack
            this.scene.time.delayedCall(Config.BOSS_ATTACK_COOLDOWN_MS, () => {
                this.canAttack = true;
            });
        });
    }

    hurt(attackDirection) {
        if (this.isHurt) {
            return;
        }

        // Cancel any ongoing wind-up
        if (this.windupTimer) {
            this.windupTimer.destroy();
            this.windupTimer = null;
        }
        this.isWindingUp = false;

        // Cancel any ongoing attack
        if (this.attackTimer) {
            this.attackTimer.destroy();
            this.attackTimer = null;
        }
        this.isAttacking = false;

        // Take damage
        this.currentHealth = Math.max(0, this.currentHealth - Config.BOSS_HURT_DAMAGE);
        this.scene.events.emit('boss_hurt', {
            health: this.currentHealth,
            maxHealth: this.maxHealth
        });

        if (this.currentHealth <= 0) {
            this.scene.events.emit('boss_dead');
            return;
        }

        this.isHurt = true;
        this.body.setVelocityX(0);

        // Turn blue when hurt
        this.setTint(Config.BOSS_HURT_COLOR);

        // Knockback in opposite direction of attack
        const knockbackDirection = attackDirection > 0 ? 1 : -1;
        this.body.setVelocityX(knockbackDirection * Config.BOSS_KNOCKBACK_VELOCITY);

        // Hurt duration - return to normal after hurt
        this.hurtTimer = this.scene.time.delayedCall(Config.BOSS_HURT_DURATION_MS, () => {
            if (!this.active) return;
            this.isHurt = false;
            this.clearTint();
            this.canAttack = true;
        });
    }
}
