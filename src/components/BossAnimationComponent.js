class BossAnimationComponent {
    constructor(scene, owner) {
        this.scene = scene;
        this.owner = owner;
        this.isAnimationLocked = false;

        // Map code-friendly keys to JSON animation keys
        this.animationKeyMap = {
            'boss_special_idle': 'special_idlespecial_idle',
            'boss_idle': 'idleidle',
            'boss_walk': 'walkingwalking',
            'boss_punch': 'punchingpunching',
            'boss_kick': 'kickkick',
            'boss_die': 'subzero_diedie',
            'boss_dizzy': 'dizzydizzy',
            'boss_hurt': 'being_hitbeing_hit'
        };
    }

    play(animKey) {
        if (this.isAnimationLocked) {
            return;
        }

        const realAnimKey = this.animationKeyMap[animKey] || animKey;

        if (!this.scene.anims.exists(realAnimKey)) {
            console.warn(`Animation '${realAnimKey}' does not exist`);
            return;
        }

        this.owner.anims.play(realAnimKey, true);
    }

    playOnce(animKey, onComplete) {
        const realAnimKey = this.animationKeyMap[animKey] || animKey;

        if (!this.scene.anims.exists(realAnimKey)) {
            console.warn(`Animation '${realAnimKey}' does not exist`);
            if (onComplete) onComplete();
            return;
        }

        this.isAnimationLocked = true;

        const completeHandler = () => {
            this.isAnimationLocked = false;
            this.owner.off('animationcomplete', completeHandler);
            if (onComplete) onComplete();
        };

        this.owner.once('animationcomplete', completeHandler);
        // Force repeat 0 to ensure it plays exactly once
        this.owner.anims.play({ key: realAnimKey, repeat: 0 }, false);
    }

    unlock() {
        this.isAnimationLocked = false;
    }
}
