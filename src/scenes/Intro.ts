export default class Intro extends Phaser.Scene {

  //immagini di start
  private _imageStart: Phaser.GameObjects.Image;
  private _start: Phaser.GameObjects.Text;
  private _goVillage: Phaser.GameObjects.Text;
  private _skipScene: Phaser.GameObjects.Text; 

  //icone per le impostazioni
  private _icon: Phaser.GameObjects.Sprite;
  private mute: boolean = false;

  // how to play
  private _how2PlayBotton: Phaser.GameObjects.Text;
  private _how2PlayGraphics: Phaser.GameObjects.Graphics;
  private _how2PlayText: Phaser.GameObjects.Container;
  private _how2PlayBack: Phaser.GameObjects.Text;

  //keyboard menu how to play
  private _keyboard: Phaser.GameObjects.Sprite;
  
  // crediti
  private _creditsBotton: Phaser.GameObjects.Text;
  private _creditsGraphics: Phaser.GameObjects.Rectangle;
  private _creditsContainer: Phaser.GameObjects.Container;

  // musiche
  private _music1: Phaser.Sound.BaseSound;
  private _music2: Phaser.Sound.BaseSound;
  private _music3: Phaser.Sound.BaseSound;

  //Effetti
  private _boss: Phaser.GameObjects.Sprite;
  private _player: Phaser.GameObjects.Sprite;

  
  constructor() {
    super({
      key: "Intro",
    });

  }

  preload() {


  }

  update(time: number, delta: number): void {
  }
  
  create() {
    //setta il background di sfondo a bianco e audio
    this.cameras.main.setBackgroundColor("#000000");

    // Creazione dell'icona e alternanza dei frame
    this._icon = this.add.sprite(this.game.canvas.width - 100, this.game.canvas.height - 100, 'icon', 1)
      .setInteractive()
      .setScale(.7)
      .setAlpha(0)
      .setDepth(3)
      .on('pointerover', () => {
        this._icon.setTintFill(0xff0000);
      })
      .on('pointerout', () => {
        this._icon.clearTint();
      });

    //play e resume la musica
    this._icon.on('pointerdown', () => {
      if (Number(this._icon.frame.name) === 1) {
        
        this._icon.setFrame(0);
        this._music1.pause();
        
      } else {
        
        this._icon.setFrame(1);
        this._music1.resume();
        this._music2.play();
      
      }
    });
    
    //Musiche e audio
    this._music1 = this.sound.add("themeMenu", {loop: true, volume: .4} );
    this._music2 = this.sound.add("confirm", {loop: false, volume: .5} );
    this._music3 = this.sound.add("unequip", {loop: false, volume: .5} );

    //start musica
    this._music1.play();

    //aggiungiamo lo sfondo
    this._imageStart = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, "bgC")
    .setDisplaySize(this.game.canvas.width, this.game.canvas.height)
    .setDepth(0)
    .setAlpha(0);

    //tweens per lo sfondo
    this.tweens.add({
      
      targets: [this._imageStart],
      alpha: 1,      
      duration: 1000,
      onComplete: () => {

        console.log("ICON");
        this.tweens.add({
          targets: [this._icon],
          alpha: { from: 0, to: 1 },
          duration: 2000,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            console.log("Icon fade-in complete");
          }
        });

      }
    
    });

    //
    //
    //Aggiungiamo il testo TAP TO START
    this._start = this.add
    .text(this.game.canvas.width / 2, this.game.canvas.height / 2, "START STORY MODE")
    .setOrigin(0.5)
    .setColor("#CD5C5C")
    .setFontFamily("MaleVolentz")
    .setFontSize(50)
    .setShadow(5, 5, "#000000", 2, false, true)
    .setStroke("#ff0000", 5)
    .setInteractive()
    .setDepth(20);

    this._start.on("pointerover", () => {
      this._start
      .setColor("#ffffff");
    })
    .on("pointerout", () => {
      this._start
      .setColor("#CD5C5C");
    })
    .on("pointerdown", () => {
      this.scene.stop(this);
      this._music1.stop();
      this.scene.start("GamePlay");
      this.scene.start("Hud");
      this.scene.bringToTop("Hud");
    });
    
    //
    // 
    // TESTO E INTERAZIONE ISTRUZIONI
    this._how2PlayBotton = this.add
      .text(this.game.canvas.width / 2, this.game.canvas.height / 2 + 180, "HOW TO PLAY")
      .setOrigin(0.5)
      .setFontFamily("MaleVolentz")
      .setFontSize(30)
      .setColor("#CD5C5C")
      .setShadow(5, 5, "#000000", 2, false, true)
      .setStroke("#ff0000", 5)
      .setInteractive()
      .setDepth(20);

    this._how2PlayBotton.on("pointerover", () => {
      
      this._how2PlayBotton
      .setColor("#ffffff");
    
    })
    .on("pointerout", () => {
      
      this._how2PlayBotton
      .setColor("#CD5C5C");
    
    })
    .on("pointerdown", () => {
      this._music2.play();

      //RIMOZIONE DELLE ALTRE SCRITTE
      this._start.visible = false;
      this._how2PlayBotton.visible = false;
      this._creditsBotton.visible = false;
      this._icon.visible = false;

      this._how2PlayGraphics = this.add
      .graphics()
      .fillStyle(0xCD5C5C, 0.5) 
      .fillRoundedRect(
        this.game.canvas.width / 4,
        this.game.canvas.height / 4,
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        60
      )
      .setAlpha(0)
      .setDepth(3)
      .setInteractive();

      
      this.generateKeyboard();
      this._keyboard = this.add.sprite(this.game.canvas.width / 2 + 250, this.game.canvas.height / 2 + 150, 'spazio', 0)
      .setDepth(4)
      .setScale(1.6);
      

      this._how2PlayText = this.add.container(0, 0).setDepth(3);

      const keyDescriptions = [
        "Move Up",
        "Move Down",
        "Move Left",
        "Move Right",
        "Jump",
        "Talk",
        "Attack",
        "Pause"
      ];

      let keyPositions = [
        { x: this.game.canvas.width / 2 - 160, y: this.game.canvas.height / 2 - 150 },
        { x: this.game.canvas.width / 2 - 160, y: this.game.canvas.height / 2 - 50 },
        { x: this.game.canvas.width / 2 - 160, y: this.game.canvas.height / 2 + 50 },
        { x: this.game.canvas.width / 2 - 160, y: this.game.canvas.height / 2 + 150 },
        { x: this.game.canvas.width / 2 + 160, y: this.game.canvas.height / 2 + 150 },
        { x: this.game.canvas.width / 2 + 160, y: this.game.canvas.height / 2 + 50 },
        { x: this.game.canvas.width / 2 + 160, y: this.game.canvas.height / 2 - 50 },
        { x: this.game.canvas.width / 2 + 160, y: this.game.canvas.height / 2 - 150 },
      ];
      
      let animations = [
          
        { key: "player_jump", frames: { start: 0, end: 7 }, },
        { key: "player_falling", frames: { start: 40, end: 41 }, },
        { key: "player_walk_2", frames: { start: 57, end: 63 }, flipX: true},
        { key: "player_walk", frames: { start: 57, end: 63 }, },
        { key: "player_attack_2", frames: [8, 9, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27], },
        { key: "player_idle", frames: { start: 0, end: 7 }, },
        { key: "player_jump_2", frames: [40, 41, 48, 49], },

      ];

      keyDescriptions.forEach((description, index) => {
        let position = keyPositions[index];
        let text = this.add
          .text(position.x, position.y, description, {
        fontFamily: "MaleVolentz",
        fontSize: "20px",
        color: "#ffffff",
          })
          .setDepth(4)
          .setOrigin(0.5);

        this._how2PlayText.add([text]);

        let animation = animations[index];
        if (animation) {
            // Controlla se l'animazione esiste già per evitare duplicati
            if (!this.anims.exists(animation.key)) {
            // Controlla se l'animazione esiste già per evitare duplicati
            this.anims.create({
              key: animation.key, // Chiave univoca per identificare l'animazione
              frames: Array.isArray(animation.frames)
              ? animation.frames.map(frame => ({ key: "pg_lvl1", frame })) // Mappa i frame se è un array
              : this.anims.generateFrameNumbers("pg_lvl1", animation.frames), // Genera i frame se è un range
              frameRate: 6, // Imposta il frame rate dell'animazione
              repeat: -1, // L'animazione si ripete all'infinito
              yoyo: false, // L'animazione non si ripete al contrario
            });
            }

          } 

          for (let i = 0; i < animations.length; i++) {
            let position;
            if (i < 4) {
              // Le prime quattro animazioni a sinistra
              position = {
                x: this.game.canvas.width / 2 - 70,
                y: this.game.canvas.height / 2 - 165 + i * 100,
              };
            } else {
              // Le ultime quattro animazioni a destra
              position = {
                x: this.game.canvas.width / 2 + 80,
                y: this.game.canvas.height / 2 - 70 + (i - 4) * 100,
              };
            }

            let animation = animations[i];
            if (animation) {
              if (!this.anims.exists(animation.key)) {
                this.anims.create({
                  key: animation.key,
                  frames: Array.isArray(animation.frames)
                    ? animation.frames.map((frame) => ({ key: "pg_lvl1", frame }))
                    : this.anims.generateFrameNumbers("pg_lvl1", animation.frames),
                  frameRate: 6,
                  repeat: -1,
                  yoyo: false,
                });
              }

              let animSprite = this.add
                .sprite(position.x, position.y, "pg_lvl1")
                .setScale(0.7)
                .setDepth(4);
              animSprite.play(animation.key);
              this._how2PlayText.add(animSprite);
            }
          }

        if (description === "Pause") {
          let pauseIcon = this.add.sprite(position.x - 70, position.y, "icon", 2).setScale(0.7).setDepth(4);
          this._how2PlayText.add(pauseIcon);
        }
      });
      
      this.tweens.add({
        targets: [this._how2PlayGraphics],
        alpha: { from: 0, to: 1 },
        duration: 500,
        ease: 'Linear',
      });

      this.tweens.add({
        targets: [this._imageStart],
        alpha: { from: 1, to: .1 },
        duration: 500,
        ease: 'Linear',
      });

      //
      //BACK BOTTON
      //
      this._how2PlayBack = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, "B\nA\nC\nK")
      .setColor("#CD5C5C")
      .setOrigin(.5)
      .setFontFamily("MaleVolentz")
      .setFontSize(30)
      .setShadow(5, 5, "#000000", 2, false, true)
      .setStroke("#ff0000", 5)
      .setDepth(3)
      .setInteractive();

      this._how2PlayBack.on("pointerdown", () => {
        
        this._music3.play();

        //RIMESSA DELLE ALTRE SCRITTE
        this._start.visible = true;
        this._how2PlayBotton.visible = true;
        this._creditsBotton.visible = true;
        this._icon.visible = true;

        this.tweens.add({
          targets: [this._imageStart],
          alpha: { from: .1, to: 1},
          duration: 500,
          onComplete: () => {
            console.log("destroy");
          }
        });
        
        
        
        this._how2PlayBack.destroy();
        this._how2PlayGraphics.destroy();
        this.setIntroSceneDepth(10);

      })
      .on("pointerover", () => {
        
        this._how2PlayBack
        .setColor("#ffffff");
      
      })
      .on("pointerout", () => {
        
        this._how2PlayBack
        .setColor("#CD5C5C");
      
      })
    
    });
  
    //
    //
    //CREDITI TESTO E INTERAZIONE
    this._creditsBotton = this.add
    .text(this.game.canvas.width / 2, this.game.canvas.height / 2 + 220, "CREDITS")
    .setOrigin(.5)
    .setFontFamily("MaleVolentz")
    .setFontSize(25)
    .setColor("#CD5C5C")
    .setShadow(5, 5, "#000000", 2, false, true)
    .setStroke("#ff0000", 5)
    .setInteractive()
    .setDepth(20);

    this._creditsBotton.on("pointerover", () => {
      this._creditsBotton
      .setColor("#ffffff");
    })
    .on("pointerout", () => {
      this._creditsBotton
      .setColor("#CD5C5C");

    })
    .on("pointerdown", () => {
      this._music2.play();
      
      this._creditsGraphics = this.add.rectangle(this.game.canvas.width / 2, this.game.canvas.height / 2, this.game.canvas.width, this.game.canvas.height, 0x000000, .7)
      .setOrigin(.5)
      .setAlpha(0)
      .setDepth(10)
      .setInteractive();

      //Container e testo 
      this._creditsContainer = this.add.container(.5).setDepth(2);

      const creditsText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height, '0', {
        fontFamily: "MaleVolentz",
        fontSize: "30px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5, 0)
      .setText('TEAM MANAGER\n\nVito Daniele Di Michele\n\n\n\nCODING\n\nFrancesco Iannarella\nAndrea Pandolfi\nVito Daniele Di Michele\n\n\n\nGRAFICA\n\nFrancesco MaZZeo\nMarco Polisciano\nMario Morelli\n\n\n\nSUPERVISORI\n\nFabio Naponiello\nSimone Fasulo')
      .setWordWrapWidth(this.game.canvas.width - 50)
      .setDepth(3);

      this.tweens.add({
        targets: [this._creditsGraphics],
        alpha: 1,
        duration: 1000,
        ease: 'Linear',
        onComplete: () => {
          console.log("Credits fade-in complete");
        }
      })
      
      //tween scomparsa crediti testo
      this.tweens.add({
        targets: creditsText,
        y: -creditsText.height,
        duration: 22000,
        ease: 'Linear',
        onComplete: () => {
          console.log("complete and destroy");
          this._creditsGraphics.destroy();
          this._creditsContainer.destroy();
        }
      });

      this._creditsContainer.add(creditsText)
      .setDepth(10);

      this._creditsGraphics.on("pointerdown", () => {
        this._music3.play();
        this._creditsGraphics.destroy();
        this._creditsContainer.destroy();
      });
      
    });

    //Effetto iniziale
    this.tweens.add({
      targets: [this._start, this._how2PlayBotton, this._creditsBotton, this._goVillage, this._skipScene],
      alpha: { from: 0, to: 1 },
      yoyo: false,
      duration: 1500,
      ease: 'Sine.easeInOut',
      repeat: 0,
      onComplete: () => {
        this.animationBoss();
        this.animationPlayer();
        this.cameras.main.flash(500);
        
        this.time.delayedCall(2000, () => {
          this.logoBossPlayer();
        });

      },
      onUpdate: () => {
        this.cameras.main.shake(75, 0.02, false);
      }
    });
    if(!this.anims.exists('player_idle')){
      //
      //
      //
      //
      //CHARACTER ANIMATION
      //
      //
      //
      //
      this.anims.create({
        key: "player_idle",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 0,
          end: 7,
        }),
        frameRate: 4,
        repeat: -1,
        yoyo: false,
      });

      this.anims.create({
        key: "player_walk",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 57,
          end: 63,
        }),
        frameRate: 8,
        repeat: -1,
        yoyo: false,
      });

      this.anims.create({
        key: "player_attack1",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 8,
          end: 11,
        }),
        frameRate: 10,
        repeat: 0,
        yoyo: false,
      });

      this.anims.create({
        key: "player_attack2",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 16,
          end: 19,
        }),
        frameRate: 10,
        repeat: 0,
        yoyo: false,
      });

      this.anims.create({
        key: "player_attack3",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 24,
          end: 27,
        }),
        frameRate: 10,
        repeat: 0,
        yoyo: false,
      });

      this.anims.create({
        key: "player_hit",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 64,
          end: 67,
        }),
        frameRate: 10,
        repeat: 0,
        yoyo: false,
      });

      this.anims.create({
        key: "player_death",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 32,
          end: 37,
        }),
        frameRate: 6,
        repeat: 0,
        yoyo: false,
      });

      this.anims.create({
        key: "player_jump",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 48,
          end: 49,
        }),
        frameRate: 3,
        repeat: -1,
        yoyo: false,
      });

      this.anims.create({
        key: "player_landing",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 40,
          end: 41,
        }),
        frameRate: 3,
        repeat: -1,
        yoyo: false,
      });
    }
  }
    //
    //
    //
    //FINISH ANIMATION CHARACTER
    

  // Creazione effetto boss
  animationBoss(): void {
  //Animazione
  this._boss = this.add.sprite(this.game.canvas.width / 2 - 50, this.game.canvas.height / 2 - 250, 'FinalBossP1')
  .setAlpha(1)
  .setScale(4);

  console.log('creazione anims');
  this.anims.create({
    key: "BossP1-attack",
    frames: this.anims.generateFrameNumbers("FinalBossP1", { frames: [ 34, 35, 36, 66, 37, 38, 39, 66, 40, 41, 42, 66, 43, 44, 45] }),
    frameRate: 7,
    yoyo: false,
    repeat: 0,
    hideOnComplete: true
  });

  this._boss.play("BossP1-attack");
  };

  // Creazione effetto player
  animationPlayer(): void {
  //Animazione player
  this._player = this.add.sprite(this.game.canvas.width / 2 + 100, this.game.canvas.height / 2 - 200, 'pg_lvl1')
  .setAlpha(1)
  .setFlipX(true)
  .setScale(2);

  this.anims.create({
    key: "player_attack",
    frames: this.anims.generateFrameNumbers("pg_lvl1", { frames: [ 8, 9, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27 ] }),
    frameRate: 5.7,
    yoyo: false,
    repeat: 0,
    hideOnComplete: true
  });

  this._player.play("player_attack");
    
  };

  //funzione seconda intro
  logoBossPlayer(): void {
    let pg: Phaser.GameObjects.Image;
    let boss: Phaser.GameObjects.Image;

    pg = this.add.image(this._start.x + 100, this._start.y - 160, 'pg_intro')
    .setAlpha(0)
    .setFlipX(true)
    .setDepth(1)
    .setAngle(15)
    .setScale(4);

    boss = this.add.image(this._start.x - 30, this._start.y - 200, 'FinalBoss_intro')
    .setAlpha(0)
    .setDepth(.9)
    .setAngle(15)
    .setScale(4);

    this.tweens.add({
      
      targets: [pg, boss],
      alpha: { from: 0, to: 1 },
      duration: 1550,
      scaleX: 3.1,
      scaleY: 3.1,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        console.log("boss e player logo");
      }

    });
  }

  //
  // funzioni per how to play
  //
  generateKeyboard(): Phaser.GameObjects.Container {
    const keys = ['sopra', 'sotto', 'sinistra', 'destra', 'L', 'X', 'P'];
    const keyPositions = [
      
      { x: this.game.canvas.width / 2 - 250, y: this.game.canvas.height / 2 - 150 },
      { x: this.game.canvas.width / 2 - 250, y: this.game.canvas.height / 2 - 50 },
      { x: this.game.canvas.width / 2 - 250, y: this.game.canvas.height / 2 + 50 },
      { x: this.game.canvas.width / 2 - 250, y: this.game.canvas.height / 2 + 150 },
      { x: this.game.canvas.width / 2 + 250, y: this.game.canvas.height / 2 + 50 },
      { x: this.game.canvas.width / 2 + 250, y: this.game.canvas.height / 2 - 50},
      { x: this.game.canvas.width / 2 + 250, y: this.game.canvas.height / 2 - 150},
    
    ];

    const container = this.add.container(0, 0).setDepth(4);

    keys.forEach((key, index) => {
      const position = keyPositions[index];
      const sprite = this.add
        .sprite(position.x, position.y, key)
        .setScale(3);
      container.add(sprite);
    });

    return container;
  }

  //funzione per stabilire un setDepth maggiore per la scena di intro
  setIntroSceneDepth(depth: number): void {

    this._imageStart.setDepth(depth);
    this._creditsBotton.setDepth(depth);
    this._how2PlayBotton.setDepth(depth);
    this._start.setDepth(depth);
    this._icon.setDepth(depth);
  
  }

}