class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        // Semi-transparent background
        const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7);
        bg.setOrigin(0);

        // Title (Centered Top)
        this.add.text(this.scale.width / 2, 80, 'PAUSA', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Layout Configuration
        const leftColumnX = this.scale.width * 0.35;
        const rightColumnX = this.scale.width * 0.65;
        const startY = 200;
        const spacing = 70;

        // --- LEFT COLUMN: BUTTONS ---

        // Resume Button
        this.createButton(leftColumnX, startY, 'REANUDAR', () => {
            this.scene.resume('battle');
            this.scene.stop();
        });

        // Restart Button
        this.createButton(leftColumnX, startY + spacing, 'REINICIAR', () => {
            this.scene.stop('battle');
            this.scene.start('battle');
            this.scene.stop();
        });

        // Music Button
        this.musicBtn = this.createButton(leftColumnX, startY + spacing * 2, 'MÚSICA: ON', () => {
            const battleScene = this.scene.get('battle');
            if (battleScene && battleScene.bgm) {
                if (battleScene.bgm.isPlaying) {
                    battleScene.bgm.pause();
                    this.musicBtn.setText('MÚSICA: OFF');
                } else {
                    battleScene.bgm.resume();
                    this.musicBtn.setText('MÚSICA: ON');
                }
            }
        });

        // Check initial music state
        const battleScene = this.scene.get('battle');
        if (battleScene && battleScene.bgm && battleScene.bgm.isPaused) {
            this.musicBtn.setText('MÚSICA: OFF');
        }

        // SFX Button
        const sfxState = this.sound.mute ? 'SONIDO: OFF' : 'SONIDO: ON';
        this.sfxBtn = this.createButton(leftColumnX, startY + spacing * 3, sfxState, () => {
            this.sound.mute = !this.sound.mute;
            this.sfxBtn.setText(this.sound.mute ? 'SONIDO: OFF' : 'SONIDO: ON');
        });


        // --- RIGHT COLUMN: CONTROLES ---

        const controlsTitle = this.add.text(rightColumnX, startY, 'CONTROLES', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#ffcc00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        const controlsText = [
            '',
            'Flechas ← →',
            '',
            'ATACAR:',
            'Z',
            '',
            'DASH:',
            'Shift'
        ];

        this.add.text(rightColumnX, startY + 140, controlsText, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 8,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Resume with ESC key
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.resume('battle');
            this.scene.stop();
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.text(x, y, text, {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => button.setStyle({ fill: '#ffff00', backgroundColor: '#555555' }))
            .on('pointerout', () => button.setStyle({ fill: '#ffffff', backgroundColor: '#333333' }))
            .on('pointerdown', callback);

        return button;
    }
}
