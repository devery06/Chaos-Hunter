import Phaser from "phaser";

export default class Intro extends Phaser.Scene {

  // UI Elements
  private _imageStart: Phaser.GameObjects.Image;
  private _icon: Phaser.GameObjects.Sprite;
  
  // Cinematic Elements (Boss & Player)
  private _boss: Phaser.GameObjects.Sprite;
  private _player: Phaser.GameObjects.Sprite;
  
  // Containers
  private _how2PlayContainer: Phaser.GameObjects.Container;
  private _creditsContainer: Phaser.GameObjects.Container;
  private _mainMenuContainer: Phaser.GameObjects.Container;

  // Music
  private _musicTheme: Phaser.Sound.BaseSound;
  private _soundConfirm: Phaser.Sound.BaseSound;
  private _soundBack: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: "Intro" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    // 1. Setup Audio
    if (!this.sound.get("themeMenu")) {
        this._musicTheme = this.sound.add("themeMenu", { loop: true, volume: 0.2 });
        this._musicTheme.play();
    } else if (!this.sound.get("themeMenu").isPlaying) {
        this.sound.get("themeMenu").play();
    }
    
    this._soundConfirm = this.sound.add("confirm", { loop: false, volume: 0.5 });
    this._soundBack = this.sound.add("unequip", { loop: false, volume: 0.5 });

    // 2. Creazione Animazioni Globali
    this.createAnimations();

    // 3. Background
    this._imageStart = this.add.image(this.scale.width / 2, this.scale.height / 2, "bgC")
      .setDisplaySize(this.scale.width, this.scale.height)
      .setAlpha(0);

    // 4. UI e Menu
    this.createMuteIcon();
    this._mainMenuContainer = this.add.container(0, 0);
    this.createMainMenu();
    this._mainMenuContainer.setAlpha(0); // Parte invisibile

    // 5. SEQUENZA INTRO: Fade In -> Start Cinematic
    this.tweens.add({
      targets: [this._imageStart],
      alpha: 1,
      duration: 1000,
      onComplete: () => {
          this.showMenuAndCinematic();
      }
    });
  }

  showMenuAndCinematic() {
      // Fade In Menu e Icona
      this.tweens.add({
          targets: [this._mainMenuContainer, this._icon],
          alpha: 1,
          duration: 1500,
          ease: 'Sine.easeInOut'
      });

      // Start Cinematic Boss vs Player
      this.playCinematicSequence();
  }

  // --- CINEMATICS ---

  playCinematicSequence() {
      const cx = this.scale.width / 2;
      const cy = this.scale.height / 2;

      // BOSS
      this._boss = this.add.sprite(cx - 50, cy - 250, 'FinalBossP1').setScale(4).setAlpha(1);
      this._boss.play("BossP1-intro-attack");

      // PLAYER
      this._player = this.add.sprite(cx + 100, cy - 200, 'pg_lvl1').setScale(2).setFlipX(true).setAlpha(1);
      this._player.play("player_intro_attack");

      // Effetti Camera
      this.cameras.main.flash(500);
      this.time.addEvent({
          delay: 100,
          callback: () => this.cameras.main.shake(75, 0.005),
          repeat: 10
      });
  }

  // --- COMPONENTI UI ---

  createMuteIcon() {
    this._icon = this.add.sprite(this.scale.width - 100, this.scale.height - 100, 'icon', 1)
      .setInteractive({ useHandCursor: true })
      .setScale(0.7)
      .setAlpha(0) // Parte invisibile
      .setDepth(100);

    this._icon.on('pointerover', () => this._icon.setTintFill(0xff0000));
    this._icon.on('pointerout', () => this._icon.clearTint());
    
    this._icon.on('pointerdown', () => {
      if (this.sound.mute) {
        this.sound.mute = false;
        this._icon.setFrame(1);
      } else {
        this.sound.mute = true;
        this._icon.setFrame(0);
      }
    });
  }

  createMainMenu() {
    const w = this.scale.width;
    const h = this.scale.height;

    const btnStart = this.createButton(w / 2, h / 2, "START STORY MODE", 50, () => {
        this.scene.stop(this);
        this.sound.stopAll();
        this.scene.start("GamePlay");
        this.scene.start("Hud");
        this.scene.bringToTop("Hud");
    });

    const btnArcade = this.createButton(w / 2, h / 2 + 80, "ARCADE MODE", 40, () => {
        this.sound.stopAll();
        this.scene.start("Arcade");
    });

    const btnHow = this.createButton(w / 2, h / 2 + 180, "HOW TO PLAY", 30, () => {
        this._soundConfirm.play();
        this.openHowToPlay();
    });

    const btnCredits = this.createButton(w / 2, h / 2 + 220, "CREDITS", 25, () => {
        this._soundConfirm.play();
        this.openCredits();
    });

    this._mainMenuContainer.add([btnStart, btnArcade, btnHow, btnCredits]);
  }

  createButton(x: number, y: number, text: string, size: number, callback: () => void): Phaser.GameObjects.Text {
      const btn = this.add.text(x, y, text, {
          fontFamily: "MaleVolentz",
          fontSize: size + "px",
          color: "#CD5C5C"
      })
      .setOrigin(0.5)
      .setStroke("#ff0000", 5)
      .setShadow(5, 5, "#000000", 2, false, true)
      .setInteractive({ useHandCursor: true })
      .setDepth(20);

      btn.on("pointerover", () => btn.setColor("#ffffff"));
      btn.on("pointerout", () => btn.setColor("#CD5C5C"));
      btn.on("pointerdown", callback);

      return btn;
  }

  // --- SOTTOMENU: HOW TO PLAY ---

  openHowToPlay() {
    this._mainMenuContainer.setVisible(false);
    this._icon.setVisible(false);
    
    // Nascondo anche boss e player se sono visibili
    if(this._boss) this._boss.setVisible(false);
    if(this._player) this._player.setVisible(false);

    const bg = this.add.rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height, 0x000000, 0.85).setInteractive();
    
    this._how2PlayContainer = this.add.container(0, 0);
    this._how2PlayContainer.add(bg);

    const keysData = [
        { key: "sopra", desc: "Jump", x: -200, y: -150, anim: "player_jump" },
        { key: "sotto", desc: "Crouch", x: -200, y: -50, anim: "player_idle" },
        { key: "sinistra", desc: "Move Left", x: -200, y: 50, anim: "player_walk", flip: true },
        { key: "destra", desc: "Move Right", x: -200, y: 150, anim: "player_walk" },
        { key: "X", desc: "Attack", x: 200, y: -50, anim: "player_attack2" }, // Anim è placeholder qui
        { key: "L", desc: "Dash", x: 200, y: 50, anim: "player_jump" },
        { key: "P", desc: "Pause", x: 200, y: 150, icon: 2 }
    ];

    keysData.forEach((k) => {
        const keySprite = this.add.sprite(this.scale.width/2 + k.x, this.scale.height/2 + k.y, k.key).setScale(2.5);
        const descText = this.add.text(keySprite.x + 60, keySprite.y, k.desc, { fontFamily: "MaleVolentz", fontSize: "24px" }).setOrigin(0, 0.5);
        
        this._how2PlayContainer.add([keySprite, descText]);

        if (k.anim) {
            const p = this.add.sprite(keySprite.x - 80, keySprite.y, "pg_lvl1").setScale(1.5);
            if(k.flip) p.setFlipX(true);
            this._how2PlayContainer.add(p);

            // --- NUOVO: GESTIONE CATENA ATTACCHI ---
            if (k.key === "X") {
                this.playAttackChain(p, 0);
            } else {
                p.play(k.anim);
            }
        }
    });

    const btnBack = this.createButton(this.scale.width/2, this.scale.height - 80, "BACK", 40, () => {
        this._soundBack.play();
        this._how2PlayContainer.destroy();
        this._mainMenuContainer.setVisible(true);
        this._icon.setVisible(true);
        // Mostro di nuovo boss e player
        if(this._boss) this._boss.setVisible(true);
        if(this._player) this._player.setVisible(true);
    });
    this._how2PlayContainer.add(btnBack);
  }

  // Helper per loopare i 3 attacchi
  playAttackChain(sprite: Phaser.GameObjects.Sprite, index: number) {
      if(!sprite.scene) return; // Se la scena è distrutta, esci
      
      const attacks = ["player_attack1", "player_attack2", "player_attack3"];
      sprite.play(attacks[index]);
      
      sprite.once('animationcomplete', () => {
          const nextIndex = (index + 1) % 3;
          this.playAttackChain(sprite, nextIndex);
      });
  }

  // --- SOTTOMENU: CREDITS ---

  openCredits() {
    this._mainMenuContainer.setVisible(false);
    
    this._creditsContainer = this.add.container(0, 0);
    const bg = this.add.rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height, 0x000000, 0.9).setInteractive();
    
    const textContent = `TEAM MANAGER\nVito Daniele Di Michele\n\nCODING\nFrancesco Iannarella\nAndrea Pandolfi\nVito Daniele Di Michele\n\nGRAFICA\nFrancesco Mazzeo\nMarco Polisciano\nMario Morelli\n\nSUPERVISORI\nFabio Naponiello\nSimone Fasulo`;
    
    const creditsText = this.add.text(this.scale.width/2, this.scale.height + 100, textContent, {
        fontFamily: "MaleVolentz", fontSize: "30px", align: "center"
    }).setOrigin(0.5, 0);

    this._creditsContainer.add([bg, creditsText]);

    this.tweens.add({
        targets: creditsText,
        y: -600,
        duration: 15000,
        ease: 'Linear',
        onComplete: () => {
            this.closeCredits();
        }
    });

    bg.on('pointerdown', () => this.closeCredits());
  }

  closeCredits() {
      if (this._creditsContainer) {
        this._soundBack.play();
        this._creditsContainer.destroy();
        this._mainMenuContainer.setVisible(true);
      }
  }

  // --- ANIMAZIONI ---
  
  createAnimations() {
    // Player UI Anims
    if (!this.anims.exists('player_idle')) {
        this.anims.create({ key: "player_idle", frames: this.anims.generateFrameNumbers("pg_lvl1", { start: 0, end: 7 }), frameRate: 4, repeat: -1 });
        this.anims.create({ key: "player_walk", frames: this.anims.generateFrameNumbers("pg_lvl1", { start: 57, end: 63 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: "player_jump", frames: this.anims.generateFrameNumbers("pg_lvl1", { start: 48, end: 49 }), frameRate: 3, repeat: -1 });
        
        // Creo tutti e 3 gli attacchi per la catena
        this.anims.create({ key: "player_attack1", frames: this.anims.generateFrameNumbers("pg_lvl1", { start: 8, end: 11 }), frameRate: 10, repeat: 0 });
        this.anims.create({ key: "player_attack2", frames: this.anims.generateFrameNumbers("pg_lvl1", { start: 16, end: 19 }), frameRate: 10, repeat: 0 });
        this.anims.create({ key: "player_attack3", frames: this.anims.generateFrameNumbers("pg_lvl1", { start: 24, end: 27 }), frameRate: 10, repeat: 0 });
    }

    // Cinematic Anims
    if (!this.anims.exists('BossP1-intro-attack')) {
        this.anims.create({
            key: "BossP1-intro-attack",
            frames: this.anims.generateFrameNumbers("FinalBossP1", { frames: [34, 35, 36, 66, 37, 38, 39, 66, 40, 41, 42, 66, 43, 44, 45] }),
            frameRate: 7,
            repeat: 0
        });
    }

    if (!this.anims.exists('player_intro_attack')) {
        this.anims.create({
            key: "player_intro_attack",
            frames: this.anims.generateFrameNumbers("pg_lvl1", { frames: [8, 9, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27] }),
            frameRate: 5.7,
            repeat: 0
        });
    }
  }
}