class RunState extends HornetState {
    constructor(owner) {
        super(owner);
    }

    enter() {
        this.animation.play('hornet_run');
        // Start run sound loop
        if (this.owner.scene.sound) {
            this.runSound = this.owner.scene.sound.add('hornet_run_sfx', { loop: true, volume: 0.5 });
            this.runSound.play();
        }
    }

    update(deltaMs) {
        // Prioridad: Caída > Ataque > Dash > Salto > Movimiento

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

        // Aplicar movimiento
        const axis = this.input.getHorizontalAxis();
        if (axis !== 0) {
            this.movement.moveHorizontal(axis);
        } else {
            // Si no hay input, volver a IDLE
            this.stateMachine.setState('IDLE');
            return;
        }
    }

    exit() {
        // Stop run sound
        if (this.runSound) {
            this.runSound.stop();
            this.runSound.destroy();
            this.runSound = null;
        }
    }
}
