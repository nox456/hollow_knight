class AttackState extends HornetState {
    constructor(owner) {
        super(owner);
        this.wasGrounded = false;
    }

    enter() {
        // Guardar si estaba en el suelo al iniciar el ataque
        this.wasGrounded = this.input.isGrounded();

        // Iniciar ataque
        this.combat.startAttack();

        // Reducir velocidad horizontal al 30%
        this.movement.scaleVelocity(0.3);

        // Reproducir animación de ataque
        this.animation.play('hornet_attack');

        // Play attack SFX
        if (this.owner.scene.sound) {
            this.owner.scene.sound.play('hornet_attack_sfx');
        }
    }

    update(deltaMs) {
        // Verificar si el ataque terminó
        if (!this.combat.isCurrentlyAttacking()) {
            // Ataque terminado, transicionar según el estado
            if (this.input.isGrounded()) {
                const axis = this.input.getHorizontalAxis();
                if (axis !== 0) {
                    this.stateMachine.setState('RUN');
                } else {
                    this.stateMachine.setState('IDLE');
                }
            } else {
                // Si está en aire, volver a JUMP
                this.stateMachine.setState('JUMP');
            }
            return;
        }

        // Permitir pequeño control horizontal si está en aire
        if (!this.wasGrounded && !this.input.isGrounded()) {
            const axis = this.input.getHorizontalAxis();
            if (axis !== 0) {
                // Movimiento reducido durante ataque en aire
                this.owner.setVelocityX(this.owner.body.velocity.x + (axis * 5));
            }
        }
    }

    exit() {
        // Asegurar que el ataque termine si salimos del estado
        if (this.combat.isCurrentlyAttacking()) {
            this.combat.endAttack();
        }
    }
}
