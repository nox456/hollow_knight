class DashInAirState extends HornetState {
    constructor(owner) {
        super(owner);
    }

    enter() {
        // Ejecutar dash en aire
        this.movement.applyDash(true);

        // Reproducir animación de dash en aire
        this.animation.play('hornet_dash_air');

        // Play dash SFX
        if (this.owner.scene.sound) {
            this.owner.scene.sound.play('hornet_dash_sfx');
        }
    }

    update(deltaMs) {
        // Verificar si el dash terminó
        if (!this.movement.isCurrentlyDashing()) {
            // Dash terminado, verificar si aterrizó o sigue en aire
            if (this.input.isGrounded()) {
                const axis = this.input.getHorizontalAxis();
                if (axis !== 0) {
                    this.stateMachine.setState('RUN');
                } else {
                    this.stateMachine.setState('IDLE');
                }
            } else {
                // Sigue en aire, volver a JUMP
                this.stateMachine.setState('JUMP');
            }
        }

        // Permitir control horizontal mínimo durante el dash
        const axis = this.input.getHorizontalAxis();
        if (axis !== 0 && !this.movement.isCurrentlyDashing()) {
            this.movement.moveHorizontal(axis);
        }
    }

    exit() {
        // Nada que limpiar
    }
}
