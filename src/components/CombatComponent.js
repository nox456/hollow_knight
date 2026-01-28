class CombatComponent {
    constructor(owner) {
        this.owner = owner;
        this.isAttacking = false;
        this.attackEndTime = 0;
        this.nextAttackTime = 0; // Timestamp for next available attack
        this.hitbox = null;
        this.hitboxGraphics = null;
        this.hasHit = false;
    }

    update() {
        if (this.isAttacking && Date.now() >= this.attackEndTime) {
            this.endAttack();
        }
    }

    startAttack() {
        // Check cooldown
        if (this.isAttacking || Date.now() < this.nextAttackTime) {
            return false;
        }

        this.isAttacking = true;
        this.hasHit = false;
        this.attackEndTime = Date.now() + Config.ATTACK_DURATION_MS;
        this.nextAttackTime = this.attackEndTime + Config.ATTACK_COOLDOWN_MS; // Set cooldown

        this.createHitbox();
        this.owner.scene.events.emit(GameEvents.PLAYER_ATTACK_START);

        return true;
    }

    createHitbox() {
        const direction = this.owner.flipX ? -1 : 1;
        const offsetX = direction * (Config.ATTACK_HITBOX_WIDTH / 2 + 50);

        const hitboxX = this.owner.x + offsetX;
        const hitboxY = this.owner.y - (this.owner.body.height / 2);

        this.hitbox = this.owner.scene.add.zone(
            hitboxX,
            hitboxY,
            Config.ATTACK_HITBOX_WIDTH,
            Config.ATTACK_HITBOX_HEIGHT
        );

        this.owner.scene.physics.add.existing(this.hitbox);

        this.hitbox.body.setAllowGravity(false);
        this.hitbox.body.moves = false;

        this.owner.scene.events.emit(GameEvents.HITBOX_ACTIVATED, {
            hitbox: this.hitbox,
            damage: Config.ATTACK_DAMAGE,
            owner: this.owner
        });
    }

    createDebugGraphics(x, y) {
        this.hitboxGraphics = this.owner.scene.add.graphics();
        this.hitboxGraphics.lineStyle(2, 0xff0000);
        this.hitboxGraphics.strokeRect(
            x - Config.ATTACK_HITBOX_WIDTH / 2,
            y - Config.ATTACK_HITBOX_HEIGHT / 2,
            Config.ATTACK_HITBOX_WIDTH,
            Config.ATTACK_HITBOX_HEIGHT
        );
    }

    destroyHitbox() {
        if (this.hitbox) {
            this.hitbox.destroy();
            this.hitbox = null;
        }

        if (this.hitboxGraphics) {
            this.hitboxGraphics.destroy();
            this.hitboxGraphics = null;
        }

        this.owner.scene.events.emit(GameEvents.HITBOX_DEACTIVATED);
    }

    endAttack() {
        this.isAttacking = false;
        this.destroyHitbox();
        this.owner.scene.events.emit(GameEvents.PLAYER_ATTACK_END);
    }

    isCurrentlyAttacking() {
        return this.isAttacking;
    }

    canAttack() {
        return !this.isAttacking && Date.now() >= this.nextAttackTime;
    }
}
