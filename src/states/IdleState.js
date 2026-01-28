class IdleState extends HornetState {
    constructor(owner) {
        super(owner);
    }

    enter() {
        this.movement.stopHorizontalMovement();
        this.animation.play('hornet_idle');
    }

    update(deltaMs) {
        // Prioridad: Caída > Ataque > Dash > Salto > Correr

        // Verificar si está cayendo (no está en el suelo)
        // Solo después de que la física se haya inicializado
        if (this.owner._physicsInitialized && !this.input.isGrounded()) {
            this.stateMachine.setState('JUMP');
            return;
        }

        // Verificar ataque
        if (this.input.isAttackJustPressed() && this.combat.canAttack()) {
            this.stateMachine.setState('ATTACK');
            return;
        }

        // Verificar dash
        if (this.input.isDashJustPressed() && this.movement.canDash()) {
            this.stateMachine.setState('DASH');
            return;
        }

        // Verificar salto
        if (this.input.isJumpPressed() && this.input.isGrounded()) {
            this.stateMachine.setState('JUMP');
            return;
        }

        // Verificar movimiento horizontal
        const axis = this.input.getHorizontalAxis();
        if (axis !== 0) {
            this.stateMachine.setState('RUN');
            return;
        }
    }

    exit() {
        // Nada que limpiar
    }
}
