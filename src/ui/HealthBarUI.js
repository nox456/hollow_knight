class HealthBarUI {
    constructor(scene, x, y, width, height, options = {}) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.currentHealth = 100;
        this.maxHealth = 100;

        // Custom events (defaults to player events)
        this.hurtEvent = options.hurtEvent || GameEvents.PLAYER_HURT;
        this.healEvent = options.healEvent || GameEvents.PLAYER_HEALED;

        // Background bar (dark)
        this.backgroundBar = scene.add.graphics();
        this.backgroundBar.fillStyle(0x222222, 1);
        this.backgroundBar.fillRect(x, y, width, height);
        this.backgroundBar.setDepth(100);

        // Health bar (colored)
        this.healthBar = scene.add.graphics();
        this.healthBar.setDepth(101);

        // Border
        this.border = scene.add.graphics();
        this.border.lineStyle(2, 0xffffff, 1);
        this.border.strokeRect(x, y, width, height);
        this.border.setDepth(102);

        // Make UI fixed to camera
        this.backgroundBar.setScrollFactor(0);
        this.healthBar.setScrollFactor(0);
        this.border.setScrollFactor(0);

        this.draw();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.scene.events.on(this.hurtEvent, (data) => {
            this.setHealth(data.health, data.maxHealth);
        });

        this.scene.events.on(this.healEvent, (data) => {
            this.setHealth(data.health, data.maxHealth);
        });
    }

    setHealth(current, max) {
        this.currentHealth = current;
        this.maxHealth = max;
        this.draw();
    }

    getColor() {
        const percentage = this.currentHealth / this.maxHealth;

        // Interpolate from red (0%) to green (100%)
        // Green: 0x00ff00 (R:0, G:255, B:0)
        // Red: 0xff0000 (R:255, G:0, B:0)

        const red = Math.floor(255 * (1 - percentage));
        const green = Math.floor(255 * percentage);

        return (red << 16) | (green << 8) | 0;
    }

    draw() {
        this.healthBar.clear();

        const percentage = this.currentHealth / this.maxHealth;
        const barWidth = this.width * percentage;
        const color = this.getColor();

        this.healthBar.fillStyle(color, 1);
        this.healthBar.fillRect(this.x, this.y, barWidth, this.height);
    }

    destroy() {
        this.backgroundBar.destroy();
        this.healthBar.destroy();
        this.border.destroy();
    }
}
