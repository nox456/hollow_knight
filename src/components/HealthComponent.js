class HealthComponent {
    constructor(owner) {
        this.owner = owner;
        this.maxHealth = Config.HORNET_MAX_HEALTH;
        this.currentHealth = this.maxHealth;
        this.isInvincible = false;
        this.invincibilityEndTime = 0;
    }

    update() {
        // Actualizar estado de invencibilidad
        if (this.isInvincible && Date.now() >= this.invincibilityEndTime) {
            this.isInvincible = false;
        }
    }

    takeDamage(amount, knockbackDirection = 0, knockbackForce = Config.PLAYER_KNOCKBACK_VELOCITY) {
        // No recibir daño si está invencible o muerta
        if (this.isInvincible || this.isDead()) {
            return false;
        }

        // Reducir vida
        this.currentHealth = Math.max(0, this.currentHealth - amount);

        // Activar invencibilidad temporal
        this.isInvincible = true;
        this.invincibilityEndTime = Date.now() + Config.INVINCIBILITY_DURATION_MS;

        // Apply knockback
        if (knockbackDirection !== 0) {
            this.owner.body.setVelocity(knockbackDirection * knockbackForce, -100);

            // Note: Movement stop is handled by Physics Drag and the HurtState logic
        }

        // Emitir evento de daño
        this.owner.scene.events.emit(GameEvents.PLAYER_HURT, {
            health: this.currentHealth,
            maxHealth: this.maxHealth,
            damage: amount
        });

        // Verificar muerte
        if (this.isDead()) {
            this.owner.scene.events.emit(GameEvents.PLAYER_DEAD);
        }

        return true;
    }

    heal(amount) {
        if (this.isDead()) {
            return false;
        }

        const oldHealth = this.currentHealth;
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);

        const actualHealing = this.currentHealth - oldHealth;

        if (actualHealing > 0) {
            this.owner.scene.events.emit(GameEvents.PLAYER_HEALED, {
                health: this.currentHealth,
                maxHealth: this.maxHealth,
                healing: actualHealing
            });
            return true;
        }

        return false;
    }

    isDead() {
        return this.currentHealth <= 0;
    }

    getHealth() {
        return this.currentHealth;
    }

    getMaxHealth() {
        return this.maxHealth;
    }

    getHealthPercentage() {
        return (this.currentHealth / this.maxHealth) * 100;
    }

    isCurrentlyInvincible() {
        return this.isInvincible;
    }
}
