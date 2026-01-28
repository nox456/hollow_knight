
// You can write more code here

/* START OF COMPILED CODE */

export default class plataforma extends Phaser.Physics.Arcade.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 398, y ?? 504, texture || "plataforma", frame);

		this.scaleX = 0.27509781224284346;
		this.scaleY = 0.24868946928788976;
		scene.physics.add.existing(this, false);
		this.body.setSize(2816, 1536, false);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
