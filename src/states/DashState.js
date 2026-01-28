class DashState extends HornetState {
    constructor(owner) {
        super(owner);
    }

    enter() {
        // Ejecutar dash en tierra
        this.movement.applyDash(false);

        // Reproducir animación de dash
        this.animation.play('hornet_dash');

        // Play dash SFX
        if (this.owner.scene.sound) {
            this.owner.scene.sound.play('hornet_dash_sfx');
        }
    }

    update(deltaMs) {
        // Verificar si el dash terminó
        if (!this.movement.isCurrentlyDashing()) {
            // Dash terminado, transicionar según el input
            if (this.input.isGrounded()) {
                const axis = this.input.getHorizontalAxis();
                if (axis !== 0) {
                    this.stateMachine.setState('RUN');
                } else {
                    this.stateMachine.setState('IDLE');
                }
            } else {
                // Si está en aire, ir a JUMP
                this.stateMachine.setState('JUMP');
            }
        }
    }

    exit() {
        // Nada que limpiar
    }
}
