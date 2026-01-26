class StateMachineComponent {
    constructor(owner) {
        this.owner = owner;
        this.states = new Map();
        this.currentState = null;
        this.currentStateName = null;
    }

    registerState(name, stateInstance) {
        this.states.set(name, stateInstance);
    }

    setState(name) {
        // No hacer nada si ya estamos en ese estado
        if (this.currentStateName === name) {
            return;
        }

        // Salir del estado actual
        if (this.currentState) {
            this.currentState.exit();
        }

        // Cambiar al nuevo estado
        const newState = this.states.get(name);
        if (!newState) {
            console.error(`Estado '${name}' no encontrado`);
            return;
        }

        this.currentState = newState;
        this.currentStateName = name;

        // Entrar al nuevo estado
        this.currentState.enter();
    }

    update(deltaMs) {
        if (this.currentState) {
            this.currentState.update(deltaMs);
        }
    }

    getCurrentStateName() {
        return this.currentStateName;
    }
}
