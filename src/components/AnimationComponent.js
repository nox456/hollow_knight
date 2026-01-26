class AnimationComponent {
    constructor(scene, owner) {
        this.scene = scene;
        this.owner = owner;
        this.isAnimationLocked = false;
        
        // Mapeo de las keys de animación del código a las keys en los JSON
        this.animationKeyMap = {
            'hornet_idle': 'idlesprite',
            'hornet_run': 'runrun_sprite',
            'hornet_jump': 'jumpprepare_jump_sprite',
            'hornet_dash': 'dashprepare_dash',
            'hornet_dash_air': 'a_dashpreparate_a_dash_sprite',
            'hornet_attack': 'attackattack_sprite'
        };
    }

    play(animKey) {
        if (this.isAnimationLocked) {
            return;
        }

        // Obtener la key real del JSON
        const realAnimKey = this.animationKeyMap[animKey] || animKey;

        // Verificar que la animación existe
        if (!this.scene.anims.exists(realAnimKey)) {
            console.error(`Animación '${realAnimKey}' no existe`);
            return;
        }

        try {
            this.owner.anims.play(realAnimKey, true);
        } catch (error) {
            console.error(`Error al reproducir animación '${realAnimKey}':`, error);
        }
    }

    playOnce(animKey, onComplete) {
        // Obtener la key real del JSON
        const realAnimKey = this.animationKeyMap[animKey] || animKey;

        // Verificar que la animación existe
        if (!this.scene.anims.exists(realAnimKey)) {
            console.error(`Animación '${realAnimKey}' no existe`);
            if (onComplete) {
                onComplete();
            }
            return;
        }

        this.isAnimationLocked = true;

        try {
            this.owner.anims.play(realAnimKey, true);

            // Escuchar el evento de animación completada
            this.owner.once('animationcomplete', () => {
                this.isAnimationLocked = false;
                if (onComplete) {
                    onComplete();
                }
            });
        } catch (error) {
            console.error(`Error al reproducir animación '${realAnimKey}':`, error);
            this.isAnimationLocked = false;
            if (onComplete) {
                onComplete();
            }
        }
    }

    unlock() {
        this.isAnimationLocked = false;
    }
}
