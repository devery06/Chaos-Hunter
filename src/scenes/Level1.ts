import Phaser from "phaser";
import Hud from "./Hud";

export default class Level1 extends Phaser.Scene {
  private _hud: Hud;

  // Background e robe grafiche
  private _bg1: Phaser.GameObjects.TileSprite;
  private _muteBtn: Phaser.GameObjects.Sprite;

  // Input
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _pauseKey: Phaser.Input.Keyboard.Key;
  private _keyX: Phaser.Input.Keyboard.Key;
  private _keyDash: Phaser.Input.Keyboard.Key;

  // Player Stats e Variabili
  private _player: Phaser.Physics.Arcade.Sprite;
  private _player_body: Phaser.Physics.Arcade.Body;
  
  private _player_velocity: number = 160;
  private _default_velocity: number = 160; 
  private _player_attack: number = 0;
  private _player_damage: number = 6;
  private _player_range: number = 180;
  private _player_kills: number = 0;
  
  // Stati Player
  private _player_hit: boolean = false;
  private _player_invicibility: boolean = false;
  private _isAttacking: boolean = false;
  private _isDashing: boolean = false; 
  private _canDash: boolean = true;    

  // Array per i nemici
  private _mob_skeleton: Array<Phaser.Physics.Arcade.Sprite> = [];
  private _mob_skeleton_body: Array<Phaser.Physics.Arcade.Body> = [];
  private _mob_skeleton_damage: number = 20;
  private _mob_skeleton_health: number = 20;
  private _mob_skeleton_speed: number = 40;
  private _mob_skeleton_attack_cooldown: number = 2000;
  private _mob_skeleton_maxSpawns = 4;
  private _mob_skeleton_min: number = 2;
  private _mob_skeleton_max: number = 5;

  private _mob_goblin: Array<Phaser.Physics.Arcade.Sprite> = [];
  private _mob_goblin_body: Array<Phaser.Physics.Arcade.Body> = [];
  private _mob_goblin_damage: number = 30;
  private _mob_goblin_health: number = 15;
  private _mob_goblin_speed: number = 75;
  private _mob_goblin_attack_cooldown: number = 5000;
  private _mob_goblin_maxSpawns = 4;
  private _mob_goblin_min: number = 2;
  private _mob_goblin_max: number = 4;

  // Boss Minotauro
  private _mob_minotaur: Phaser.Physics.Arcade.Sprite;
  private _mob_minotaur_body: Phaser.Physics.Arcade.Body;
  private _mob_minotaur_health: number = 50;
  private _mob_minotaur_damage: number = 35;
  private _mob_minotaur_speed: number = 40;
  private _mob_minotaur_attack_cooldown: number = 1200;
  private _mob_minotaur_range = 160; 
  private _mob_minotaur_dead: boolean = false;
  private _bossfight: boolean = false;
  private _levelFinished: boolean = false;

  // Variabili di stato gioco
  private _gameOver: boolean = false;
  private _camera_angle: number = 0; 

  // Suoni e Musica
  private _musicGoblinAttack: Phaser.Sound.BaseSound;
  private _musicGoblinHit: Phaser.Sound.BaseSound;
  private _musicGoblinDeath: Phaser.Sound.BaseSound;
  private _musicGoblinWalk: Phaser.Sound.BaseSound;

  private _musicSkeletonDeath: Phaser.Sound.BaseSound;
  private _musicSkeletonHit: Phaser.Sound.BaseSound;
  private _musicSkeletonWalk: Phaser.Sound.BaseSound;

  private musicPlayer: Phaser.Sound.BaseSound; 
  private musicSwoosh: Phaser.Sound.BaseSound; 

  constructor() {
    super({
      key: "Level1",
    });
  }

  createMuteButton() {
    const currentFrame = this.sound.mute ? 0 : 1; 
    
    this._muteBtn = this.add.sprite(this.scale.width - 160, 40, 'icon', currentFrame)
      .setScrollFactor(0) 
      .setInteractive({ useHandCursor: true })
      .setScale(0.6)
      .setDepth(1000);
  
    this._muteBtn.on('pointerdown', () => {
      this.sound.mute = !this.sound.mute;
      const newFrame = this.sound.mute ? 1 : 0;
      this._muteBtn.setFrame(newFrame);
    });
  }

  createMenuButton() {
    const menuBtn = this.add.text(this.scale.width - 80, 40, "MENU", {
        fontFamily: "MaleVolentz", fontSize: "30px", color: "#ffffff",
      }).setOrigin(0.5).setDepth(1000).setStroke("#000000", 4).setScrollFactor(0).setInteractive({ useHandCursor: true })
      .on("pointerover", () => { menuBtn.setColor("#ff0000"); })
      .on("pointerout", () => { menuBtn.setColor("#ffffff"); })
      .on("pointerdown", () => {
        this.sound.stopAll();
        this.scene.stop(); 
        if (this.scene.get("Hud").scene.isActive()) this.scene.stop("Hud");
        if (this.scene.get("GamePlay").scene.isActive()) this.scene.stop("GamePlay");
        this.scene.start("Intro"); 
      });
  }

  showGameOverUI() {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "GAME OVER", {
        fontFamily: "MaleVolentz",
        fontSize: "100px",
        color: "#ff0000",
      })
      .setOrigin(0.5)
      .setStroke("#000000", 10)
      .setDepth(200);

    this.time.delayedCall(4000, () => {
      this.input.keyboard.enabled = true;
      this.sound.stopAll();
      this.scene.start("Intro");
    });
  }

  create() {
    // --- MUSICA BATTLE ---
    this.sound.stopAll();
    this.sound.play("battle_theme", { loop: true, volume: 0.3 });

    // 1. Inizializza Input
    this._cursors = this.input.keyboard.createCursorKeys();
    this._keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this._keyDash = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT); 
    this._pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    
    this._pauseKey.on('down', () => {
      this.sound.stopAll(); 
      this.scene.pause(this);
      this.scene.launch('Paused'); 
    });

    this.createMenuButton();
    this.sound.stopAll();
    if (!this.sound.get("battle_theme") || !this.sound.get("battle_theme").isPlaying) this.sound.play("battle_theme", { loop: true, volume: 0.3 });
    this.createMuteButton();

    // 2. RESET VARIABILI
    this._gameOver = false;
    this._bossfight = false;
    this._levelFinished = false; 
    this._isDashing = false;
    this._canDash = true;
    this._isAttacking = false; 
    this._player_hit = false;  
    this._player_invicibility = false;
    this._player_kills = 0;
    this._mob_minotaur_dead = false;

    this._mob_skeleton = [];
    this._mob_skeleton_body = [];
    this._mob_goblin = [];
    this._mob_goblin_body = [];

    // 3. HUD Connection
    this._hud = this.scene.get("Hud") as Hud;
    if(this._hud) {
        this._hud.events.off("death", this.death, this);
        this._hud.events.on("death", this.death, this);
        this.events.off("update_health", this._hud.updateHealthBar, this._hud);
        this.events.on("update_health", this._hud.updateHealthBar, this._hud);
    }

    // 4. World Setup
    this._bg1 = this.add.tileSprite(0, 0, 1280, 800, "lvl1_forest").setOrigin(0, 0);
    this.physics.world.setBounds(0, -150, this.scale.width, this.scale.height);

    this.loadAudios();

    this._player = this.physics.add
      .sprite(100, this.game.canvas.height - 100, "pg_lvl1")
      .setScale(3)
      .setSize(40, 55)
      .setOffset(57, 66)
      .setDepth(100);
    this._player_body = this._player.body as Phaser.Physics.Arcade.Body;
    this._player.setCollideWorldBounds(true).setGravity(0, 100);

    // Chaos Event
    this.time.addEvent({
      delay: 12000,
      repeat: -1,
      callback: () => { this.manageChaosEvent(); }
    });

    this.startSpawners();
    this.createAnimations();

    this.events.emit("level1_ready");
  }

  update(time: number, delta: number): void {
    if (!this._gameOver) {
      if (Phaser.Input.Keyboard.JustDown(this._keyX)) this.executeAttack(); 
      if (Phaser.Input.Keyboard.JustDown(this._keyDash)) this.executeDash();
      
      this.playerMovements();
      
      if (this._bossfight && this._mob_minotaur) {
          this.enemiesMovement(this._mob_minotaur, "minotaur");
          this.updateBossHealthBar(); // <--- AGGIUNTO: Aggiorna la barra vita del boss
      } 
      
      this.enemiesMovement(this._mob_goblin, "goblin");
      this.enemiesMovement(this._mob_skeleton, "skeleton");
      this.enemyHealthBar(this._mob_goblin);
      this.enemyHealthBar(this._mob_skeleton);
        
      if (!this._bossfight) this.checkBossFight();
      this.checkLevelCompletion();
    }
  }

  // --- LOGIC METHODS ---

  updateBossHealthBar() {
      if (!this._mob_minotaur || !this._mob_minotaur.active) return;
      
      const hpBar = (this._mob_minotaur as any).hpBar as Phaser.GameObjects.Graphics;
      if (hpBar) {
          hpBar.clear();
          const maxHp = 50; 
          const curHp = this._mob_minotaur_health;
          
          if (curHp <= 0) {
              hpBar.destroy();
              return;
          }

          const width = 80;
          const height = 8;
          const x = this._mob_minotaur.x - width / 2;
          const y = this._mob_minotaur.y - 80;

          // Sfondo nero
          hpBar.fillStyle(0x000000, 0.6);
          hpBar.fillRect(x, y, width, height);
          
          // Barra Rossa
          const hpPercent = Phaser.Math.Clamp(curHp / maxHp, 0, 1);
          hpBar.fillStyle(0xff0000);
          hpBar.fillRect(x, y, width * hpPercent, height);
      }
  }

  checkLevelCompletion() {
      if (this._levelFinished || !this._bossfight) return;
      if (this._mob_minotaur_dead) {
          let activeEnemies = 0;
          this._mob_goblin.forEach(g => { if (g.active && !g.getData("dead")) activeEnemies++; });
          this._mob_skeleton.forEach(s => { if (s.active && !s.getData("dead")) activeEnemies++; });
          if (activeEnemies === 0) {
              this._levelFinished = true;
              console.log("VITTORIA!");
              this.time.delayedCall(4000, () => {
                    this.sound.stopAll();
                    const gameplay = this.scene.get("GamePlay") as any;
                    this.scene.stop(this); 
                    if (gameplay && typeof gameplay.nextLevel === "function") gameplay.nextLevel();
                    else this.scene.launch("GamePlay");
                });
          }
      }
  }
  
  executeDash() {
    if (!this._canDash || this._isAttacking || this._player_hit || this._isDashing) return;
    this._isDashing = true;
    this._canDash = false;
    this._player_invicibility = true; 
    
    const direction = this._player.flipX ? -1 : 1;
    this._player.setVelocityX(500 * direction); 
    this._player.anims.play("player_walk", true);
    this._player.setAlpha(0.6); 
    
    this.time.delayedCall(300, () => {
        this._isDashing = false;
        this._player.setVelocityX(0); 
        this._player_invicibility = false; 
        this._player.setAlpha(1); 
    });
    this.time.delayedCall(1000, () => { this._canDash = true; });
  }
  
  manageChaosEvent() {
    if(this._gameOver || this._mob_minotaur_dead) return;
    
    let chaosType = Phaser.Math.Between(0, 2); 
    let textMessage = "";
    switch(chaosType) {
        case 0:
            textMessage = "CAOS SPECULARE";
            this._camera_angle += 180;
            this.cameras.main.setAngle(this._camera_angle);
            this.time.delayedCall(5000, () => {
                this._camera_angle = 0;
                this.cameras.main.setAngle(this._camera_angle);
            });
            break;
        case 1:
            textMessage = "CAOS INVERSO";
            this._player_velocity = -this._default_velocity;
            this.time.delayedCall(5000, () => {
                this._player_velocity = this._default_velocity;
            });
            break;
        case 2:
            textMessage = "PIOGGIA DI NEMICI";
            this.spawnFallingEnemies();
            break;
    }
    const chaosText = this.add.text(
        this.game.canvas.width / 2, 200, textMessage
    ).setOrigin(0.5).setFontSize(40).setColor("#ff0000").setStroke("#000000", 6).setFontFamily("MaleVolentz");
    if (chaosType == 0) chaosText.setAngle(180); 
    this.time.delayedCall(3000, () => { chaosText.destroy(); });
  }

  spawnFallingEnemies() {
      for(let i=0; i<3; i++) {
        const type = Phaser.Math.Between(0, 1); 
        const xPos = Phaser.Math.Between(100, 1180); 
        const yPos = -100; 
        if (type === 0) this.spawnSingleGoblin(xPos, yPos, true);
        else this.spawnSingleSkeleton(xPos, yPos, true);
      }
  }

  startSpawners() {
      if (this._mob_skeleton_maxSpawns > 0) {
        this.time.addEvent({
            repeat: this._mob_skeleton_maxSpawns -1, 
            delay: Phaser.Math.Between(this._mob_skeleton_min, this._mob_skeleton_max) * 1000,
            callback: () => {
                const xPos = Phaser.Math.Between(0, 1) * (this.game.canvas.width - 60) + 30;
                this.spawnSingleSkeleton(xPos, this.game.canvas.height - 70, false);
            },
        });
      }
      if (this._mob_goblin_maxSpawns > 0) {
        this.time.addEvent({
            repeat: this._mob_goblin_maxSpawns - 1, 
            delay: Phaser.Math.Between(this._mob_goblin_min, this._mob_goblin_max) * 1000,
            callback: () => {
                const xPos = Phaser.Math.Between(0, 1) * (this.game.canvas.width - 60) + 30;
                this.spawnSingleGoblin(xPos, this.game.canvas.height - 70, false);
            },
        });
      }
  }

  spawnSingleSkeleton(x: number, y: number, isFalling: boolean) {
      const skeleton = this.physics.add.sprite(x, y, "skeleton").setScale(3);
      const skeletonBody = skeleton.body as Phaser.Physics.Arcade.Body;
      skeletonBody.setSize(40, 35);
      skeleton.setCollideWorldBounds(true).setGravity(0, 100);
      (skeleton as any).health = this._mob_skeleton_health;
      const healthBar = this.add.graphics();
      healthBar.fillStyle(0xff0000); 
      healthBar.fillRect(skeleton.x - 20, skeleton.y - 40, 40, 5); 
      (skeleton as any).healthBar = healthBar;
      skeleton.setData("cooldown", this._mob_skeleton_attack_cooldown);
      skeleton.setData("damage", this._mob_skeleton_damage);
      skeleton.setData("speed", this._mob_skeleton_speed);
      skeleton.setData("isFalling", isFalling); 
      this._mob_skeleton.push(skeleton);
      this._mob_skeleton_body.push(skeletonBody);
  }

  spawnSingleGoblin(x: number, y: number, isFalling: boolean) {
      const goblin = this.physics.add.sprite(x, y, "goblin_walk").setScale(3).setOffset(0, 40);
      const goblinBody = goblin.body as Phaser.Physics.Arcade.Body;
      goblinBody.setSize(40, 35);
      goblin.setCollideWorldBounds(true).setGravity(0, 100);
      (goblin as any).health = this._mob_goblin_health;
      const healthBar = this.add.graphics();
      healthBar.fillStyle(0xff0000); 
      healthBar.fillRect(goblin.x - 20, goblin.y - 40, 40, 5); 
      (goblin as any).healthBar = healthBar;
      goblin.setData("cooldown", this._mob_goblin_attack_cooldown);
      goblin.setData("damage", this._mob_goblin_damage);
      goblin.setData("speed", this._mob_goblin_speed);
      goblin.setData("isFalling", isFalling); 
      this._mob_goblin.push(goblin);
      this._mob_goblin_body.push(goblinBody);
  }

  enemiesMovement(_mob: Array<Phaser.Physics.Arcade.Sprite> | Phaser.Physics.Arcade.Sprite, name: string): void {
    if (!Array.isArray(_mob)) {
       this.handleMinotaurAI(_mob, name);
    } else {
      _mob.forEach((mob, index) => {
        if (!mob.active || !mob.body) return;
        if (mob.getData("isFalling")) {
             if (mob.body.blocked.down || mob.y > 550) { 
                 mob.setData("isFalling", false); 
                 mob.setVelocityX(0); 
             }
             return; 
        }
        if (!mob.getData("isAttacking") && !mob.getData("dead")) {
          const dist = this._player.x - mob.x;
          if (dist > 100) {
            mob.anims.play("mob_" + name + "_walk", true); 
            mob.setFlipX(false); 
            mob.setVelocityX(mob.getData("speed")); 
          } else if (dist < -100) {
            mob.anims.play("mob_" + name + "_walk", true); 
            mob.setFlipX(true); 
            mob.setVelocityX(-mob.getData("speed")); 
          } else {
            mob.setVelocityX(0); 
            if (mob.getData("attackCooldown")) {
              mob.anims.play("mob_" + name + "_idle", true); 
            } else {
              this.handleEnemyAttack(mob, name);
            }
          }
        }
      });
    }
  }

  handleEnemyAttack(mob: Phaser.Physics.Arcade.Sprite, name: string) {
      if(mob.getData("isAttacking")) return;
      
      if (Math.abs(this._player.x - mob.x) < 100) {
        mob.setVelocityX(0); 
        mob.setData("isAttacking", true); 
        mob.anims.play("mob_" + name + "_attack", true); 

        if (name === "goblin" && this._musicGoblinAttack) {
             this._musicGoblinAttack.play();
        }
        
        this.time.delayedCall(1500, () => { if(mob.active) mob.setData("isAttacking", false); });
        
        mob.once("animationcomplete", (anim: Phaser.Animations.Animation) => {
            if (anim.key == "mob_" + name + "_attack") {
                mob.setData("attackCooldown", true); 
                const dist = this._player.x - mob.x;
                const hitRight = !mob.flipX && dist > 0 && dist < 110;
                const hitLeft = mob.flipX && dist < 0 && dist > -110;
                
                if (hitRight || hitLeft) {
                    this.updateHealthBar(mob.getData("damage")); 
                    
                    if(name == 'goblin') this._musicGoblinHit.play();
                    else this._musicSkeletonHit.play();
                }
                
                this.time.delayedCall(200, () => { if(mob.active) mob.setData("isAttacking", false); });
                this.time.delayedCall(mob.getData("cooldown") || 2000, () => {
                    if(mob.active) {
                        mob.setData("attackCooldown", false);
                    }
                });
            }
        });
      }
  }

  handleMinotaurAI(_mob: Phaser.Physics.Arcade.Sprite, name: string) {
      this._mob_minotaur_body = _mob.body as Phaser.Physics.Arcade.Body;

      if (_mob.getData("isInvincible")) {
          _mob.setVelocityX(0);
          return;
      }
      
      if (!_mob.getData("isAttacking") && !_mob.getData("dead")) {
        // ... Movimento (rimane uguale) ...
        if (this._player.x - _mob.x > this._mob_minotaur_range) {
          _mob.anims.play("mob_" + name + "_walk", true);
          _mob.setFlipX(false);
          _mob.setVelocityX(this._mob_minotaur_speed);
          this._mob_minotaur_body.setOffset(25, 45);
        } else if (this._player.x - this._mob_minotaur.x < -this._mob_minotaur_range) {
          _mob.anims.play("mob_minotaur_walk", true);
          _mob.setFlipX(true);
          _mob.setVelocityX(-this._mob_minotaur_speed);
          this._mob_minotaur_body.setOffset(45, 45);
        } else {
          _mob.setVelocityX(0);
          if (_mob.getData("attackCooldown")) {
            _mob.anims.play("mob_" + name + "_idle", true);
            // ... offset idle ...
          } else {
            // INIZIO ATTACCO
            _mob.setData("attackCooldown", true);
            _mob.setData("isAttacking", true);
            _mob.anims.play("mob_" + name + "_attack", true);
            
            // Offset Hitbox durante attacco
            if (_mob.flipX) this._mob_minotaur_body.setOffset(65, 55);
            else this._mob_minotaur_body.setOffset(35, 55);

            // FIX DELAY: Resetta cooldown indipendentemente dall'animazione
            this.time.delayedCall(this._mob_minotaur_attack_cooldown, () => { 
                if(_mob.active) _mob.setData("attackCooldown", false); 
            });
            
            _mob.once("animationcomplete", (anim: Phaser.Animations.Animation) => {
                if (anim.key == "mob_" + name + "_attack") {
                  
                  // --- FIX HITBOX VICINA ---
                  const dist = this._player.x - _mob.x;
                  
                  // Calcoliamo la distanza assoluta (senza segno)
                  const absDist = Math.abs(dist);
                  
                  // Rendi il controllo più permissivo:
                  // 1. Se sei VICINISSIMO (absDist < 50), ti colpisce SEMPRE (anche se glitchi dentro).
                  // 2. Altrimenti controlla la direzione come prima.
                  const isCloseEnough = absDist < 50; 
                  const isFacingTarget = (_mob.flipX && dist < 0) || (!_mob.flipX && dist > 0);
                  const isInRange = absDist < this._mob_minotaur_range + 20; 
                  
                  if ((isCloseEnough || isFacingTarget) && isInRange) {
                    this.updateHealthBar(this._mob_minotaur_damage);
                  }
                  
                  // Reset flag attacco
                  this.time.delayedCall(200, () => { if(_mob.active) _mob.setData("isAttacking", false); });
                }
            });
          }
        }
      }
  }

  checkHit(_mob: Array<Phaser.Physics.Arcade.Sprite> | Phaser.Physics.Arcade.Sprite, name: string): void {
    if (!Array.isArray(_mob)) {
      // --- BOSS HIT LOGIC ---
      if(this._mob_minotaur.getData("isInvincible")) return;

      const distX = Math.abs(this._player.x - _mob.x);
      const distY = Math.abs(this._player.y - _mob.y);
      const verticalHit = distY < 100; 

      if (
        ((this._player.flipX == true && this._player.x - _mob.x < this._player_range && this._player.x - _mob.x > -this._player_range) ||
        (this._player.flipX == false && _mob.x - this._player.x < this._player_range && _mob.x - this._player.x > -this._player_range))
        && verticalHit
      ) {
        if (!this._mob_minotaur.getData("dead")) {
          this._mob_minotaur.setVelocityX(0);
          this._mob_minotaur_health -= this._player_damage; 
          
          if (this._mob_minotaur_health <= 0) {
            this._mob_minotaur_health = 0;
            this._mob_minotaur.anims.stop();
            this._mob_minotaur.anims.play("mob_minotaur_death", true); 
            if (!this._mob_minotaur_dead) {
                this._mob_minotaur_dead = true; 
                this._mob_minotaur.setData("dead", true);
                if(this._musicSkeletonDeath) this._musicSkeletonDeath.play();
                // Distruggi barra vita
                const hpBar = (this._mob_minotaur as any).hpBar as Phaser.GameObjects.Graphics;
                if(hpBar) hpBar.destroy();
            }
          } else {
            this._mob_minotaur.setData("isAttacking", false);
            this._mob_minotaur.anims.stop();
            //this._mob_minotaur.anims.play("mob_minotaur_hit", true); 
            this._mob_minotaur.setData("isInvincible", true);
            
            this.tweens.add({
                targets: this._mob_minotaur,
                alpha: 0.5,
                yoyo: true,
                repeat: 3,
                duration: 100,
                onComplete: () => {
                    this._mob_minotaur.setAlpha(1);
                }
            });

            this.time.delayedCall(1000, () => {
                if(this._mob_minotaur.active) {
                    this._mob_minotaur.setData("isInvincible", false);
                }
            });
          }
        }
      }
    } else {
      _mob.forEach((mob) => {
        const distY = Math.abs(this._player.y - mob.y);
        const verticalHit = distY < 100;

        if (
          ((this._player.flipX == true && this._player.x - mob.x < this._player_range && this._player.x - mob.x > -this._player_range) ||
          (this._player.flipX == false && mob.x - this._player.x < this._player_range && mob.x - this._player.x > -this._player_range))
          && verticalHit
        ) {
          mob.setVelocityX(0);
          if (!mob.getData("dead")) {
            (mob as any).health -= this._player_damage; 
            if ((mob as any).health <= 0) {
              (mob as any).health = 0;
              mob.anims.stop(); 
              mob.anims.play("mob_" + name + "_death", true); 
              mob.setData("dead", true);
              this._player_kills++;

              if (name === "goblin" && this._musicGoblinDeath) this._musicGoblinDeath.play();
              else if (name === "skeleton" && this._musicSkeletonDeath) this._musicSkeletonDeath.play();

            } else {
              mob.anims.play("mob_" + name + "_hit", true); 
            }
          }
        }
      });
    }
  }

  bossFightStart(): void {
    this._mob_minotaur = this.physics.add.sprite(1700, this.game.canvas.height - 200, "mob_minotaur_walk").setScale(3);
    this._mob_minotaur_body = this._mob_minotaur.body as Phaser.Physics.Arcade.Body;
    this._mob_minotaur_body.setSize(60, 85);
    this._mob_minotaur.setCollideWorldBounds(true).setGravity(0, 100);
    this._bossfight = true;
    this._mob_minotaur.setData("isInvincible", false);
    this._mob_minotaur.setData("attackCooldown", false); 
    this._mob_minotaur.setData("isAttacking", false); 

    // CREO LA BARRA VITA
    const hpBar = this.add.graphics();
    hpBar.setDepth(15);
    (this._mob_minotaur as any).hpBar = hpBar;
  }

  checkBossFight(): void {
    if (this._player_kills >= (this._mob_goblin_maxSpawns + this._mob_skeleton_maxSpawns) && !this._bossfight)
      this.bossFightStart();
  }

  enemyHealthBar(_mob: Array<Phaser.Physics.Arcade.Sprite>): void {
    _mob.forEach((mob) => {
      const healthBar = (mob as any).healthBar;
      healthBar.clear(); 
      if ((mob as any).health <= 0) return; 
      healthBar.fillStyle(0xff0000); 
      const healthPercentage = (mob as any).health / 15; 
      healthBar.fillRect(mob.x - 20, mob.y - 40, 40 * healthPercentage, 5); 
    });
  }

  playerMovements(): void {
    if (this._player_hit || this._isAttacking || this._isDashing) {
        if(this.musicPlayer && this.musicPlayer.isPlaying) this.musicPlayer.stop();
        return;
    }

    if (this._cursors.left.isDown) {
      this._player.setVelocityX(-this._player_velocity);
      this._player.anims.play("player_walk", true);
      this._player.setFlipX(true);
      
      if (this.musicPlayer && !this.musicPlayer.isPlaying) {
          this.musicPlayer.play();
      }

    } else if (this._cursors.right.isDown) {
      this._player.setVelocityX(this._player_velocity);
      this._player.anims.play("player_walk", true);
      this._player.setFlipX(false);

      if (this.musicPlayer && !this.musicPlayer.isPlaying) {
          this.musicPlayer.play();
      }

    } else {
      this._player.setVelocityX(0);
      this._player.anims.play("player_idle", true);
      
      if(this.musicPlayer && this.musicPlayer.isPlaying) this.musicPlayer.stop();
    }
  }

  executeAttack(): void {
    if (this._isAttacking || this._player_hit || this._isDashing) return; 
    this._isAttacking = true; 
    this._player.setVelocityX(0); 

    if(this.musicSwoosh) this.musicSwoosh.play();

    const attacks = ["player_attack1", "player_attack2", "player_attack3"];
    this._player.anims.play(attacks[this._player_attack], true);
    this._player_attack = (this._player_attack + 1) % 3; 
    this.time.delayedCall(500, () => { this._isAttacking = false; });
    if (this._bossfight) this.checkHit(this._mob_minotaur, "");
    this.checkHit(this._mob_goblin, "goblin");
    this.checkHit(this._mob_skeleton, "skeleton");
  }

  updateHealthBar(amount: any): void {
    if (this._player_invicibility) return;
    this.events.emit("update_health", -amount); 
    if (!this._gameOver) this.hit(); 
  }

  hit(): void {
    this._player_hit = true; 
    if(this.musicPlayer && this.musicPlayer.isPlaying) this.musicPlayer.stop(); 
    this._player.setVelocityX(0); 
    
    if (this.anims.exists("player_hit")) {
        this._player.anims.play("player_hit", true); 
    } else {
        this._player.setTint(0xff0000);
    }

    this.time.delayedCall(500, () => { 
        this._player_hit = false; 
        this._player.clearTint(); 
    });
  }

  death() {
    if (this._player.anims.currentAnim && this._player.anims.currentAnim.key === "player_death") return;

    this._player.setVelocity(0, 0);
    this.input.keyboard.enabled = false;
    
    if (this._player.body) this._player.body.enable = false;
    this._player.anims.play("player_death", true);
    
    this._player.once("animationcomplete", () => {
        this.physics.pause();
        this.showGameOverUI();
    });
  }

  loadAudios() {
    this._musicGoblinAttack = this.sound.add("goblin_attack", { loop: false, volume: 0.5 });
    this._musicGoblinHit = this.sound.add("goblin_hit", { loop: false, volume: 0.5 });
    this._musicGoblinDeath = this.sound.add("goblin_death", { loop: false, volume: 0.5 });
    this._musicGoblinWalk = this.sound.add("goblin_walk", { loop: false, volume: 0.5 });
    this._musicSkeletonDeath = this.sound.add("skeleton_death", { loop: false, volume: 0.5 });
    this._musicSkeletonHit = this.sound.add("skeleton_hit", { loop: false, volume: 0.5});
    this._musicSkeletonWalk = this.sound.add("skeleton_walk", { loop: false, volume: 0.5 });
    this.musicPlayer = this.sound.add("footstepDirt2", { loop: true, volume: 0.5, rate: .3 });
    this.musicSwoosh = this.sound.add("metalSwoosh1", { loop: false, volume: 0.7 });
  }

  createAnimations() {
    this.anims.create({ key: "mob_goblin_idle", frames: this.anims.generateFrameNumbers("goblin_idle", { start: 0, end: 3 }), frameRate: 4, repeat: -1 });
    this.anims.create({ key: "mob_goblin_walk", frames: this.anims.generateFrameNumbers("goblin_walk", { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "mob_goblin_attack", frames: this.anims.generateFrameNumbers("goblin_attack1", { start: 0, end: 7 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: "mob_goblin_hit", frames: this.anims.generateFrameNumbers("goblin_hit", { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: "mob_goblin_death", frames: this.anims.generateFrameNumbers("goblin_death", { start: 0, end: 3 }), frameRate: 8, repeat: 0 });
    this.anims.create({ key: "mob_skeleton_idle", frames: this.anims.generateFrameNumbers("skeleton", { start: 39, end: 42 }), frameRate: 4, repeat: -1 });
    this.anims.create({ key: "mob_skeleton_walk", frames: this.anims.generateFrameNumbers("skeleton", { start: 26, end: 37 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "mob_skeleton_attack", frames: this.anims.generateFrameNumbers("skeleton", { start: 0, end: 12 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: "mob_skeleton_hit", frames: this.anims.generateFrameNumbers("skeleton", { start: 52, end: 54 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: "mob_skeleton_death", frames: this.anims.generateFrameNumbers("skeleton", { start: 13, end: 25 }), frameRate: 8, repeat: 0 });
    this.anims.create({ key: "mob_minotaur_idle", frames: this.anims.generateFrameNumbers("boss_lvl1-fix", { start: 0, end: 9 }), frameRate: 6, repeat: 0 });
    this.anims.create({ key: "mob_minotaur_walk", frames: this.anims.generateFrameNumbers("boss_lvl1-fix", { start: 14, end: 23 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: "mob_minotaur_attack", frames: this.anims.generateFrameNumbers("boss_lvl1", { start: 24, end: 28 }), frameRate: 8, repeat: 0 });
    this.anims.create({ key: "mob_minotaur_hit", frames: this.anims.generateFrameNumbers("boss_lvl1", { start: 36, end: 38 }), frameRate: 6, repeat: 0 });
    this.anims.create({ key: "mob_minotaur_death", frames: this.anims.generateFrameNumbers("boss_lvl1", { start: 48, end: 52 }), frameRate: 6, repeat: 0 });
  }
}