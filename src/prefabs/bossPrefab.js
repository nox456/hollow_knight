class bossPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'idle_01');

        this.scene = scene;
        this.animation = new BossAnimationComponent(scene, this);

        this.target = null;
        this.isWindingUp = false;
        this.windupTimer = null;
        this.isAttacking = false;
        this.attackTimer = null;
        this.canAttack = true;
        this.isHurt = false;
        this.hurtTimer = null;

        // New animation state flags
        this.isDead = false;
        this.isDizzy = false;
        this.hasPlayedSpecialIdle = false;
        this.isIntroDelay = false;
        this.hasTriggeredDizzy = false;
        this.hasTriggeredPhase3 = false;
        this.isFalling = false;

        // Health
        this.maxHealth = Config.BOSS_MAX_HEALTH;
        this.currentHealth = this.maxHealth;
        this.dizzyHealthThreshold = Config.BOSS_HURT_DAMAGE; // One hit left logic

        // Dynamic Stats
        this.currentSpeed = Config.BOSS_SPEED;
        this.currentAttackDamage = Config.BOSS_ATTACK_DAMAGE;
        this.currentKnockbackForce = Config.PLAYER_KNOCKBACK_VELOCITY;
        this.currentCooldown = Config.BOSS_ATTACK_COOLDOWN_MS;
        this.currentPhase = 1;

        this.setOrigin(0.5, 1);
        this.setScale(1.3);
        scene.physics.add.existing(this, false);

        // Adjust size based on actual sprite dimensions (matched to 1.3 scale)
        this.body.setSize(130, 200);
        this.body.setOffset(-10, -50); // Adjusted to align feet with ground

        this.body.setGravityY(500);
        this.setCollideWorldBounds(true);
    }

    setTarget(target) {
        this.target = target;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.body) return;

        // Dynamically adjust offset
        const bodyWidth = 130;
        const bodyHeight = 200;
        const offsetX = (this.width * 0.5) - (bodyWidth / 2);
        const offsetY = this.height - bodyHeight;
        this.body.setOffset(offsetX, offsetY);

        // Play special idle animation on first update
        if (!this.hasPlayedSpecialIdle) {
            this.playSpecialIdle();
            return;
        }

        // Don't move if dead, dizzy, or falling
        if (this.isDead || this.isDizzy || this.isFalling) {
            this.body.setVelocity(0);
            return;
        }

        // Check locks
        if (!this.target || this.isWindingUp || this.isAttacking || this.isHurt || this.animation.isAnimationLocked || this.isIntroDelay) {
            // Ensure boss is stopped if not in a hurt state (knockback)
            if (!this.isHurt) {
                this.body.setVelocity(0);
            }

            // Play idle when stationary and not in special state
            if (this.body.velocity.x === 0 && !this.animation.isAnimationLocked) {
                this.animation.play('boss_idle');
            }
            return;
        }

        this.followTarget();
    }

    followTarget() {
        const targetX = this.target.x;
        const bossX = this.x;

        const distX = targetX - bossX;
        let moving = false;

        // X Movement
        if (Math.abs(distX) > 10) {
            moving = true;
            if (distX < 0) {
                this.body.setVelocityX(-this.currentSpeed);
                this.setFlipX(true);
            } else {
                this.body.setVelocityX(this.currentSpeed);
                this.setFlipX(false);
            }
        } else {
            this.body.setVelocityX(0);
        }

        // Play walking animation while moving
        if (!this.animation.isAnimationLocked) {
            if (moving) {
                this.animation.play('boss_walk');
            } else {
                this.animation.play('boss_idle');
            }
        }
    }

    onPlayerCollision() {
        if (!this.canAttack || this.isWindingUp || this.isAttacking || this.isHurt || this.isFalling || this.isDead || this.isDizzy) {
            return;
        }

        this.startWindup();
    }

    startWindup() {
        this.isWindingUp = true;
        this.canAttack = false;
        this.body.setVelocity(0);

        // Keep orange tint for telegraphing
        this.setTint(Config.BOSS_ATTACK_WINDUP_COLOR);

        // Play idle during windup
        if (!this.animation.isAnimationLocked) {
            this.animation.play('boss_idle');
        }

        this.windupTimer = this.scene.time.delayedCall(Config.BOSS_ATTACK_WINDUP_MS, () => {
            this.isWindingUp = false;
            this.attack();
        });
    }

    attack() {
        this.isAttacking = true;
        this.body.setVelocity(0);

        // Attack Pool
        let attackAnims = ['boss_punch', 'boss_kick'];
        if (this.currentPhase === 3) {
            attackAnims.push('boss_special_attack');
        }

        const randomAttack = Phaser.Math.RND.pick(attackAnims);

        // Update Stats based on attack type
        if (randomAttack === 'boss_special_attack') {
            this.currentAttackDamage = Config.BOSS_SPECIAL_ATTACK_DAMAGE;
            this.currentKnockbackForce = Config.BOSS_SPECIAL_ATTACK_KNOCKBACK;
            if (this.scene.sound) this.scene.sound.play('boss_punch_sfx'); // Placeholder
        } else {
            // Reset to Phase Standard
            this.updatePhaseStats();
        }

        // Play Sound
        if (this.scene.sound && randomAttack !== 'boss_special_attack') {
            if (randomAttack === 'boss_punch') {
                this.scene.sound.play('boss_punch_sfx');
            } else {
                this.scene.sound.play('boss_kick_sfx');
            }
        }

        // Play attack animation once
        // For 'boss_special_attack', we map it to the loaded animation key 'subzero_special_attack_anim'
        // But wait, my battle.js loader uses 'subzero_special_attack_anim'. The JSON likely defined 'boss_special_attack' internally?
        // Or I should use the key I loaded: 'subzero_special_attack_anim'.
        // If I use 'boss_special_attack' and it's not found, it won't play.
        // Let's check logic:
        // 'boss_punch' -> logic uses 'boss_punch'.
        // 'boss_special_attack' -> user didn't specify internal key.
        // I'll assume I should use the key I loaded: 'subzero_special_attack_anim' for the special one.

        let animToPlay = randomAttack;
        if (randomAttack === 'boss_special_attack') {
            animToPlay = 'subzero_special_attack_anim';
        }

        this.animation.playOnce(animToPlay, () => {
            // Animation complete
            this.isAttacking = false;
            this.clearTint();
            this.updatePhaseStats(); // Reset stats to normal

            // Cooldown before next attack
            this.scene.time.delayedCall(Config.BOSS_ATTACK_COOLDOWN_MS, () => {
                this.canAttack = true;
            });
        });

        // Keep red tint during attack
        this.setTint(Config.BOSS_ATTACK_COLOR);
    }

    updatePhaseStats() {
        this.currentKnockbackForce = Config.PLAYER_KNOCKBACK_VELOCITY;

        if (this.currentPhase === 3) {
            this.currentSpeed = Config.BOSS_SPEED * Config.BOSS_PHASE_3_SPEED_MULT;
            this.currentAttackDamage = Config.BOSS_ATTACK_DAMAGE * Config.BOSS_PHASE_3_DAMAGE_MULT;
        } else if (this.currentPhase === 2) {
            this.currentSpeed = Config.BOSS_SPEED * Config.BOSS_PHASE_2_SPEED_MULT;
            this.currentAttackDamage = Config.BOSS_ATTACK_DAMAGE * Config.BOSS_PHASE_2_DAMAGE_MULT;
        } else {
            this.currentSpeed = Config.BOSS_SPEED;
            this.currentAttackDamage = Config.BOSS_ATTACK_DAMAGE;
        }
    }

    hurt(attackDirection) {
        if (this.isHurt || this.isDead || this.isFalling || this.isDizzy) {
            return;
        }

        // Phase 2+ Blocking Chance
        if (this.currentPhase >= 2 && Math.random() < Config.BOSS_BLOCK_CHANCE) {
            // Trigger Block
            this.animation.playOnce('subzero_blocking_anim', () => {
                this.animation.play('boss_idle');
            });
            return; // Negate damage
        }

        // Cancel ongoing actions
        if (this.windupTimer) { this.windupTimer.destroy(); this.windupTimer = null; }
        this.isWindingUp = false;
        if (this.attackTimer) { this.attackTimer.destroy(); this.attackTimer = null; }
        this.isAttacking = false;

        // Take damage
        this.currentHealth = Math.max(0, this.currentHealth - Config.BOSS_HURT_DAMAGE);
        this.scene.events.emit('boss_hurt', {
            health: this.currentHealth,
            maxHealth: this.maxHealth
        });

        // Check Phase Transitions
        this.checkPhaseTransition();

        // Check Phase 3 Falling Transition (Only once)
        if (this.currentPhase === 3 && !this.hasTriggeredPhase3) {
            this.hasTriggeredPhase3 = true;
            this.startFallingTransition(attackDirection);
            return;
        }

        // Check for death
        if (this.currentHealth <= 0) {
            if (this.scene.sound) this.scene.sound.play('final_hit_sfx');
            this.die();
            return;
        }

        // Check for dizzy (One hit left)
        if (!this.hasTriggeredDizzy && this.currentHealth <= this.dizzyHealthThreshold) {
            this.playDizzyAnimation();
            return;
        }

        // Normal hurt behavior
        this.isHurt = true;
        this.body.setVelocity(0);

        // Random Hurt Animation for Phase 2+
        let hurtAnim = 'boss_hurt';
        if (this.currentPhase >= 2) {
            hurtAnim = Math.random() > 0.5 ? 'boss_hurt' : 'subzero_being_hit2_anim';
        }

        // Play hurt animation
        this.animation.playOnce(hurtAnim, () => {
            if (!this.active) return;
            this.isHurt = false;
            this.clearTint();
            this.canAttack = true;
        });

        // Hurt Sound
        if (this.scene.sound) {
            const hurtSfx = Phaser.Math.RND.pick(['boss_hurt_1_sfx', 'boss_hurt_2_sfx']);
            this.scene.sound.play(hurtSfx);
        }

        this.setTint(Config.BOSS_HURT_COLOR);

        const knockbackDirection = attackDirection > 0 ? 1 : -1;
        this.body.setVelocity(knockbackDirection * Config.BOSS_KNOCKBACK_VELOCITY, -200);

        this.scene.time.delayedCall(300, () => {
            if (this.active && !this.isDead && !this.isFalling) {
                this.body.setVelocityX(0);
            }
        });
    }

    checkPhaseTransition() {
        const hpPct = this.currentHealth / this.maxHealth;

        if (hpPct <= Config.BOSS_PHASE_3_THRESHOLD) {
            this.currentPhase = 3;
        } else if (hpPct <= Config.BOSS_PHASE_2_THRESHOLD) {
            this.currentPhase = 2;
        } else {
            this.currentPhase = 1;
        }

        // Update stats immediately
        this.updatePhaseStats();
    }

    startFallingTransition(attackDirection) {
        this.isFalling = true;
        this.body.setVelocity(0);

        // Launch Boss Away
        const knockbackDirection = attackDirection > 0 ? 1 : -1;
        this.body.setVelocity(knockbackDirection * 600, -800); // Big launch

        // Play Falling Animation
        this.animation.play('subzero_falling_anim');

        this.scene.time.delayedCall(1500, () => {
            if (!this.active) return;
            this.isFalling = false;
            this.body.setVelocity(0);
            this.animation.play('boss_idle');
            this.canAttack = true;
        });
    }

    playSpecialIdle() {
        this.hasPlayedSpecialIdle = true;
        this.body.setVelocity(0);

        this.animation.playOnce('boss_special_idle', () => {
            if (!this.active) return;

            // Ensure animation is unlocked
            this.animation.unlock();

            this.body.setVelocity(0);
            this.animation.play('boss_idle');

            // Add a delay before starting to chase
            this.isIntroDelay = true;
            this.scene.time.delayedCall(1000, () => {
                if (!this.active) return;
                this.isIntroDelay = false;
            });
        });
    }

    playDizzyAnimation() {
        this.hasTriggeredDizzy = true;
        this.isDizzy = true;
        this.body.setVelocity(0);
        this.clearTint();

        // Play Dizzy Sound
        if (this.scene.sound) {
            this.scene.sound.play('boss_dizzy_sfx');
        }

        // Unlock animation if it was locked (e.g. by interrupted attack)
        this.animation.unlock();

        // Play dizzy animation
        this.animation.play('boss_dizzy');

        // Return to combat after dizzy duration
        this.scene.time.delayedCall(Config.BOSS_DIZZY_DURATION_MS, () => {
            if (!this.active) return;
            this.isDizzy = false;
            this.canAttack = true;
            this.animation.play('boss_idle');
        });
    }

    die() {
        this.isDead = true;
        this.body.setVelocityX(0);
        this.clearTint();

        // Play Death Sound
        if (this.scene.sound) {
            this.scene.sound.play('boss_death_sfx');
        }

        // Play death animation once
        this.animation.playOnce('boss_die', () => {
            // Emit boss_dead event after animation completes
            this.scene.events.emit('boss_dead');
        });
    }
}
