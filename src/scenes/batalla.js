
// You can write more code here

/* START OF COMPILED CODE */

export default class batalla extends Phaser.Scene {

	constructor() {
		super("batalla");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// fondo
		const fondo = this.add.image(403, 297, "fondo");
		fondo.scaleX = 0.3097838299155921;
		fondo.scaleY = 0.4166050358684542;

		// estructura
		const estructura = this.add.image(204, 347, "estructura");
		estructura.scaleX = 0.23362849946960582;
		estructura.scaleY = 0.18173099297750162;

		// plataforma
		const plataforma = new plataforma(this, 403, 582);
		this.add.existing(plataforma);
		plataforma.scaleX = 0.3437916737294756;
		plataforma.scaleY = 0.17614312033292798;

		// hornetPrefab
		const hornetPrefab = new hornetPrefab(this, 93, 515);
		this.add.existing(hornetPrefab);
		hornetPrefab.scaleX = 1;
		hornetPrefab.scaleY = 1;

		// collider
		this.physics.add.collider(plataforma, hornetPrefab);

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
