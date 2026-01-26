class InputComponent {
    constructor(scene, owner) {
        this.scene = scene;
        this.owner = owner;
        this.cursors = null;
        this.shiftKey = null;
        this.zKey = null;
    }

    initialize() {
        // Crear las teclas del cursor
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        // Añadir teclas adicionales
        this.shiftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.zKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        // Este método se llama cada frame, pero no hace nada activo
        // Los estados consultan los flags cuando los necesitan
    }

    // Retorna -1 (izquierda), 0 (ninguna), 1 (derecha)
    getHorizontalAxis() {
        if (!this.cursors) return 0;

        if (this.cursors.left.isDown) {
            return -1;
        } else if (this.cursors.right.isDown) {
            return 1;
        }
        return 0;
    }

    // Verifica si se presionó el botón de salto
    isJumpPressed() {
        if (!this.cursors) return false;
        return this.cursors.up.isDown;
    }

    // Verifica si se acaba de presionar dash (una vez por presión)
    isDashJustPressed() {
        if (!this.shiftKey) return false;
        return Phaser.Input.Keyboard.JustDown(this.shiftKey);
    }

    // Verifica si se acaba de presionar ataque (una vez por presión)
    isAttackJustPressed() {
        if (!this.zKey) return false;
        return Phaser.Input.Keyboard.JustDown(this.zKey);
    }

    // Verifica si está en el suelo
    isGrounded() {
        // Posición Y del suelo (donde Hornet debería estar parada)
        const groundY = 540;
        const tolerance = 5; // Margen de tolerancia

        // Está en el suelo si está en la posición correcta Y con velocidad hacia abajo o cero
        const isAtGroundLevel = this.owner.y >= (groundY - tolerance);
        const isMovingDownOrStopped = this.owner.body.velocity.y >= 0;

        return isAtGroundLevel && isMovingDownOrStopped;
    }
}
