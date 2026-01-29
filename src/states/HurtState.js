
class HurtState extends HornetState {
    constructor(owner) {
        super(owner);
        this.recoverTimer = 0;
        this.recoverDuration = 200; // Match HealthComponent knockback duration
    }

    enter() {
        // Play hurt animation if available, or idle
        // Assuming no dedicated hurt animation for now, use idle but maybe tint?
        // Actually battle.js doesn't load a hurt animation.
        this.animation.play('hornet_idle');

        // Reset timer
        this.recoverTimer = this.recoverDuration;
    }

    update(deltaMs) {
        if (this.recoverTimer > 0) {
            this.recoverTimer -= deltaMs;
        } else {
            // Recovery complete
            if (this.input.isGrounded()) {
                this.stateMachine.setState('IDLE');
            } else {
                this.stateMachine.setState('JUMP');
            }
        }
    }

    exit() {
        // Cleanup if needed
        this.owner.setVelocityX(0); // Ensure stop if not already stopped by HealthComponent
    }
}
