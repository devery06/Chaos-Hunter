import Phaser from "phaser";

export default class Forest extends Phaser.Scene {
  constructor() {
    super({
      key: "Forest",
    });
  }

  private _bg: Phaser.GameObjects.Image;
  private _player: Phaser.GameObjects.Sprite;

  create() {
    // MENU BUTTON
    const menuBtn = this.add
      .text(this.scale.width - 80, 40, "MENU", {
        fontFamily: "MaleVolentz",
        fontSize: "30px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setStroke("#000000", 4)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        menuBtn.setColor("#ff0000");
      })
      .on("pointerout", () => {
        menuBtn.setColor("#ffffff");
      })
      .on("pointerdown", () => {
        this.sound.stopAll();
        this.scene.stop();
        if (this.scene.get("Hud").scene.isActive()) {
          this.scene.stop("Hud");
        }
        if (this.scene.get("GamePlay").scene.isActive()) {
          this.scene.stop("GamePlay");
        }
        this.scene.start("Intro"); // Torna al menu
      });

    this.cameras.main.setBackgroundColor(0x000000);

    this._bg = this.add
      .image(this.game.canvas.width / 2, this.game.canvas.height / 2, "forest_background")
      .setDisplaySize(1280, 800);

    // --- TESTO "Ritorno al Villaggio" ---
    // Modificato: Font più piccolo (50px)
    const returnText = this.add.text(
      this.game.canvas.width / 2, 
      this.game.canvas.height / 2, 
      "RITORNO AL VILLAGGIO...", 
      {
        fontFamily: "MaleVolentz",
        fontSize: "50px", // Era 60px, ora leggermente più piccola
        color: "#ffffff"
      }
    )
    .setOrigin(0.5)
    .setStroke("#000000", 6)
    .setAlpha(0)             // Parte invisibile
    .setDepth(100);

    // --- ANIMAZIONI ---
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

    // --- PLAYER ---
    this._player = this.add
      .sprite(
        this.game.canvas.width - 50,
        this.game.canvas.height / 2 + 170,
        "pg_lvl1"
      )
      .setScale(2)
      .setFlipX(true);
    this._player.play("player_sad");

    // Camminata verso il centro
    this.tweens.add({
      targets: [this._player],
      x: this.game.renderer.width / 2,
      duration: 5000,
      ease: "Linear",
      onComplete: () => {
        this._player.stop();
        this._player.play("player_terra");
      },
    });

    // Gestione fine animazione
    this._player.on(
      "animationcomplete",
      (animation: Phaser.Animations.Animation) => {
        if (animation.key === "player_terra") {
          
          // SEQUENZA CINEMATOGRAFICA
          
          // 1. Faccio sparire TUTTO (Sfondo e Player) -> Schermo Nero
          this.tweens.add({
            targets: [this._bg, this._player],
            alpha: 0,
            duration: 2000,
            ease: "Linear",
            onComplete: () => {
                
                // 2. Ora che è nero, faccio apparire la scritta
                this.tweens.add({
                    targets: returnText,
                    alpha: 1,
                    duration: 1500, // Appare in 1.5 secondi
                    ease: "Power2",
                    onComplete: () => {
                        
                        // 3. Aspetto un po' (3 secondi) con la scritta fissa
                        this.time.delayedCall(3000, () => {
                            
                            // 4. Cambio scena
                            this.scene.stop(this);
                            const gameplay = this.scene.get("GamePlay") as any;
                            if (gameplay) {
                                gameplay.nextLevel();
                            }
                        });
                    }
                });
            }
          });
        }
      }
    );
  }

  update(time: number, delta: number): void {}
}