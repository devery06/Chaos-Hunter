import IBall from "./IBall";
export default class Ball extends Phaser.GameObjects.Sprite implements IBall {		
		
		private _config: genericConfig;
        private _body: Phaser.Physics.Arcade.Body;

		constructor(params: genericConfig) {
			super(params.scene, params.x, params.y, params.key);
			this._config = params;
			this.initBall();
		}
		
		initBall() {
            
            this.setFrame(this._config.frame);
            this._config.scene.add.existing(this);
            this._config.scene.physics.world.enable(this);
            this._body = <Phaser.Physics.Arcade.Body>this.body;
            this._body.setCollideWorldBounds(true).setBounce(1);
            
        
        }

        setVelocity(x: number, y: number): void {
            this._body.setVelocity(x, y);
        }

        setVelocityX(x: number): void {
           this._body.setVelocityX(x); 
        }

		update(time: number, delta: number) { }
}