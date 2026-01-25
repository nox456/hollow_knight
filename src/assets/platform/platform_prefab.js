
// You can write more code here

/* START OF COMPILED CODE */

class platform_prefab extends Phaser.Physics.Arcade.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "Gemini_Generated_Image_uk8q9buk8q9buk8q(1)", frame);

		this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 2816, 1536), Phaser.Geom.Rectangle.Contains);
		this.scaleX = 0.3;
		this.scaleY = 0.3;
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
