export default class Forest extends Phaser.Scene {
  constructor() {
    super({
      key: "Forest",
    });
  }

  private _bg: Phaser.GameObjects.Image;
  private _player: Phaser.GameObjects.Sprite;

  create() {
    this.cameras.main.setBackgroundColor(0x000000);

    this._bg = this.add
      .image(this.game.canvas.width / 2, this.game.canvas.height / 2, "forest_background")
      .setDisplaySize(1280, 800);

    this.anims.create({
      key: "player_sad",
      frames: this.anims.generateFrameNumbers("pg_lvl1", {
        start: 57,
        end: 63,
      }),
      frameRate: 3,
      repeat: -1,
      yoyo: false,
    });

    this.anims.create({
      key: "player_terra",
      frames: this.anims.generateFrameNumbers("pg_lvl1", {
        start: 32,
        end: 35,
      }),
      frameRate: 3,
      repeat: 0,
      yoyo: false,
    });

    this._player = this.add
      .sprite(
        this.game.canvas.width - 50,
        this.game.canvas.height / 2 + 170,
        "pg_lvl1"
      )
      .setScale(2)
      .setFlipX(true);
    this._player.play("player_sad");

    this.tweens.add({
      targets: [this._player],
      x: this.game.renderer.width / 2,
      duration: 5000,
      ease: "Linear",
      onComplete: () => {
        this._player.stop();
        console.log("complete");
        this._player.play("player_terra");
      },
    });

    this._player.on(
      "animationcomplete",
      (animation: Phaser.Animations.Animation) => {
        if (animation.key === "player_terra") {
          this.tweens.add({
            targets: [this._bg],
            alpha: 0,
            duration: 3500,
            ease: "Linear",
            onComplete: () => {
              this.scene.stop(this);  // Ferma la scena attuale
              const gameplay = this.scene.get("GamePlay") as any;
              if (gameplay) {
                gameplay.nextLevel(); // Chiama il metodo che abbiamo corretto sopra
              }
            },
          });
        }
      }
    );
  }

  update(time: number, delta: number): void {}
}
