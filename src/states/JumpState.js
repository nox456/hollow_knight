class JumpState extends HornetState {
    constructor(owner) {
        super(owner);
    }

    enter() {
        // Ejecutar salto solo si estamos en el suelo
        if (this.input.isGrounded()) {
            this.movement.jump();
        }

        // Reproducir animación de salto
        this.animation.play('hornet_jump');
    }

    update(deltaMs) {
        // Prioridad: Ataque > Dash en aire > Control horizontal > Aterrizaje

        // Verificar ataque
        if (this.input.isAttackJustPressed()) {
            this.stateMachine.setState('ATTACK');
            return;
        }

        // Verificar dash en aire
        if (this.input.isDashJustPressed() && this.movement.canDash() && !this.input.isGrounded()) {
            this.stateMachine.setState('DASH_IN_AIR');
            return;
        }

        // Permitir control horizontal en el aire
        const axis = this.input.getHorizontalAxis();
        if (axis !== 0) {
            this.movement.moveHorizontal(axis);
        }

        // Verificar aterrizaje
        if (this.input.isGrounded() && this.owner.body.velocity.y >= 0) {
            // Aterrizar - ir a IDLE o RUN según input
            const horizontalAxis = this.input.getHorizontalAxis();
            if (horizontalAxis !== 0) {
                this.stateMachine.setState('RUN');
            } else {
                this.stateMachine.setState('IDLE');
            }
            return;
        }
    }

    exit() {
        // Nada que limpiar
    }
}
