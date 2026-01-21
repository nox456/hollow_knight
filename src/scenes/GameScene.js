class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load assets here
    }

    create() {
        // Create game objects here
        this.add.text(400, 300, 'Hollow Knight', {
            fontSize: '48px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(400, 360, 'Press any key to start', {
            fontSize: '18px',
            fill: '#888888'
        }).setOrigin(0.5);
    }

    update() {
        // Game loop logic here
    }
}
