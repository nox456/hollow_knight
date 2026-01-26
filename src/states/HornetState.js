class HornetState {
    constructor(owner) {
        this.owner = owner;
    }

    // Getters de acceso a componentes
    get input() {
        return this.owner.controls;
    }

    get movement() {
        return this.owner.movement;
    }

    get combat() {
        return this.owner.combat;
    }

    get health() {
        return this.owner.health;
    }

    get animation() {
        return this.owner.animation;
    }

    get stateMachine() {
        return this.owner.stateMachine;
    }

    // Métodos del ciclo de vida del estado
    enter() {
        // Override en clases hijas
    }

    update(deltaMs) {
        // Override en clases hijas
    }

    exit() {
        // Override en clases hijas
    }
}
