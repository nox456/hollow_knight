class MovementComponent {
    constructor(owner) {
        this.owner = owner;
        this.dashCooldownTimer = 0;
        this.dashEndTime = 0;
        this.isDashing = false;
    }

    update(delta) {
        if (this.owner.y > Config.GROUND_Y) {
            this.owner.y = Config.GROUND_Y;
            this.owner.body.velocity.y = 0;
        }

        const minX = 80;
        const maxX = 1320;
        if (this.owner.x < minX) {
            this.owner.x = minX;
            this.owner.setVelocityX(0);
        } else if (this.owner.x > maxX) {
            this.owner.x = maxX;
            this.owner.setVelocityX(0);
        }

        if (this.dashCooldownTimer > 0) {
            this.dashCooldownTimer -= delta;
        }

        if (this.isDashing && Date.now() >= this.dashEndTime) {
            this.isDashing = false;
            this.owner.setVelocityX(0);
            this.owner.scene.events.emit(GameEvents.PLAYER_DASH_END);
        }
    }

    moveHorizontal(direction) {
        if (direction === 0) {
            this.owner.setVelocityX(0);
            return;
        }

        this.owner.setVelocityX(direction * Config.HORNET_WALK_SPEED);

        if (direction < 0) {
            this.owner.setFlipX(false);
        } else if (direction > 0) {
            this.owner.setFlipX(true);
        }
    }

    stopHorizontalMovement() {
        this.owner.setVelocityX(0);
    }

    jump() {
        const tolerance = 5;
        const isAtGroundLevel = this.owner.y >= (Config.GROUND_Y - tolerance);

        if (isAtGroundLevel) {
            this.owner.setVelocityY(Config.HORNET_JUMP_VELOCITY);
            return true;
        }
        return false;
    }

    applyDash(isAirDash) {
        if (!this.canDash()) {
            return false;
        }

        const direction = this.owner.flipX ? 1 : -1;
        const force = isAirDash ? Config.DASH_AIR_FORCE_X : Config.DASH_FORCE_X;
        const duration = isAirDash ? Config.DASH_AIR_DURATION_MS : Config.DASH_DURATION_MS;

        this.owner.setVelocityX(direction * force);

        if (isAirDash) {
            this.owner.setVelocityY(0);
        }

        this.isDashing = true;
        this.dashEndTime = Date.now() + duration;
        this.dashCooldownTimer = Config.DASH_COOLDOWN_MS;

        this.owner.scene.events.emit(GameEvents.PLAYER_DASH_START, isAirDash);

        return true;
    }

    canDash() {
        return this.dashCooldownTimer <= 0 && !this.isDashing;
    }

    isCurrentlyDashing() {
        return this.isDashing;
    }

    scaleVelocity(factor) {
        this.owner.setVelocityX(this.owner.body.velocity.x * factor);
    }
}
