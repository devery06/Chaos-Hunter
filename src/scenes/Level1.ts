import Phaser from "phaser";
import Hud from "./Hud";

export default class Level1 extends Phaser.Scene {
  private _hud: Hud;

  private _bg1: Phaser.GameObjects.TileSprite;
  private _bg2: Phaser.GameObjects.TileSprite;
  private _bg3: Phaser.GameObjects.TileSprite;
  private _bg4: Phaser.GameObjects.TileSprite;
  private _bg5: Phaser.GameObjects.TileSprite;
  private _bg6: Phaser.GameObjects.TileSprite;
  private _bg7: Phaser.GameObjects.TileSprite;

  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _pauseKey: Phaser.Input.Keyboard.Key;

  private _player: Phaser.Physics.Arcade.Sprite;
  private _player_body: Phaser.Physics.Arcade.Body;
  private _player_velocity: number = 160;
  private _player_attack: number = 0;
  private _player_damage: number = 6;
  private _player_range: number = 180;
  private _player_kills: number = 0;
  private _player_invicibility_duration: number = 1; 
  private _player_hit: boolean = false;
  private _player_invicibility: boolean = false;
  private _isAttacking: boolean = false;

  private _mob_skeleton: Array<Phaser.Physics.Arcade.Sprite>;
  private _mob_skeleton_body: Array<Phaser.Physics.Arcade.Body>;
  private _mob_skeleton_damage: number = 20;
  private _mob_skeleton_health: number = 20;
  private _mob_skeleton_speed: number = 40;
  private _mob_skeleton_attack_cooldown: number = 2000;
  private _mob_skeleton_maxSpawns = 2;
  private _mob_skeleton_min: number = 3;
  private _mob_skeleton_max: number = 6;

  private _mob_goblin: Array<Phaser.Physics.Arcade.Sprite>;
  private _mob_goblin_body: Array<Phaser.Physics.Arcade.Body>;
  private _mob_goblin_damage: number = 30;
  private _mob_goblin_health: number = 15;
  private _mob_goblin_speed: number = 75;
  private _mob_goblin_attack_cooldown: number = 5000;
  private _mob_goblin_maxSpawns = 2;
  private _mob_goblin_min: number = 2;
  private _mob_goblin_max: number = 4;

  private _mob_minotaur: Phaser.Physics.Arcade.Sprite;
  private _mob_minotaur_body: Phaser.Physics.Arcade.Body;
  private _mob_minotaur_health: number = 30;
  private _mob_minotaur_damage: number = 35;
  private _mob_minotaur_speed: number = 40;
  private _mob_minotaur_attack_cooldown: number = 2500;
  private _mob_minotaur_range = 120;
  private _mob_minotaur_dead: boolean = false;
  private _bossfight: boolean = false;

  private _keyX: Phaser.Input.Keyboard.Key;
  private _platform: Phaser.Physics.Arcade.StaticBody;
  private _lastActionTime: number = 0;
  private _healt: number = 100;
  private _actualTime: number;
  private _gameOver: boolean = false;
  private _text1: Phaser.GameObjects.Text;
  private _camera_angle: number = 0;

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

  bossFightStart(): void {
    this._mob_minotaur = this.physics.add
      .sprite(1700, this.game.canvas.height - 200, "mob_minotaur_walk")
      .setScale(3);
    this._mob_minotaur_body = this._mob_minotaur
      .body as Phaser.Physics.Arcade.Body;
    this._mob_minotaur_body.setSize(60, 85);
    this._mob_minotaur.setCollideWorldBounds(true).setGravity(0, 100);
    this._bossfight = true;
  }

  checkHit(
    _mob: Array<Phaser.Physics.Arcade.Sprite> | Phaser.Physics.Arcade.Sprite,
    name: string
  ): void {
    if (!Array.isArray(_mob)) {
      if (
        (this._player.flipX == true &&
          this._player.x - _mob.x < this._player_range &&
          this._player.x - _mob.x > -this._player_range) ||
        (this._player.flipX == false &&
          _mob.x - this._player.x < this._player_range &&
          _mob.x - this._player.x > -this._player_range)
      ) {
        if (!this._mob_minotaur.getData("dead")) {
          this._mob_minotaur.setVelocityX(0);
          this._mob_minotaur_health -= this._player_damage; 
          if (this._mob_minotaur_health <= 0) {
            this._mob_minotaur_health = 0;
            this._mob_minotaur.anims.stop();
            this._mob_minotaur.anims.play("mob_minotaur_death", true); 
            this._mob_minotaur.setData("dead", true);
            
            if(!this._mob_minotaur_dead){ 
              this._mob_minotaur_dead = true; 
              
              this.time.delayedCall(5000, () => {
                const gameplay = this.scene.get("GamePlay") as any;
                this.scene.stop(this); 
                if (gameplay && typeof (gameplay as any).nextLevel === "function") {
                  (gameplay as any).nextLevel();
                } else {
                  console.warn("GamePlay scene not ready or nextLevel() missing");
                  this.scene.launch("GamePlay");
                }
              });
            }
          } else {
            this._mob_minotaur.anims.play("mob_minotaur_hit", true); 
          }
        }
      }
    } else {
      _mob.forEach((mob) => {
        if (
          (this._player.flipX == true &&
            this._player.x - mob.x < this._player_range &&
            this._player.x - mob.x > -this._player_range) ||
          (this._player.flipX == false &&
            mob.x - this._player.x < this._player_range &&
            mob.x - this._player.x > -this._player_range)
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
              console.log(this._player_kills);
            } else {
              mob.anims.play("mob_" + name + "_hit", true); 
            }
          }
        }
      });
    }
  }

  enemiesMovement(
    _mob: Array<Phaser.Physics.Arcade.Sprite> | Phaser.Physics.Arcade.Sprite,
    name: string
  ): void {
    if (!Array.isArray(_mob)) {
      this._mob_minotaur_body = _mob.body as Phaser.Physics.Arcade.Body;

      if (!_mob.getData("isAttacking") && !_mob.getData("dead")) {
        if (this._player.x - _mob.x > this._mob_minotaur_range) {
          _mob.anims.play("mob_" + name + "_walk", true);
          _mob.setFlipX(false);
          _mob.setVelocityX(this._mob_minotaur_speed);
          this._mob_minotaur_body.setOffset(25, 45);
        } else if (
          this._player.x - this._mob_minotaur.x <
          -this._mob_minotaur_range
        ) {
          _mob.anims.play("mob_minotaur_walk", true);
          _mob.setFlipX(true);
          _mob.setVelocityX(-this._mob_minotaur_speed);
          this._mob_minotaur_body.setOffset(45, 45);
        } else {
          _mob.setVelocityX(0);
          if (_mob.getData("attackCooldown")) {
            _mob.anims.play("mob_" + name + "_idle", true);
            if (_mob.flipX) this._mob_minotaur_body.setOffset(45, 45);
            else this._mob_minotaur_body.setOffset(35, 45);
          } else {
            _mob.setData("attackCooldown", true);
            _mob.setData("isAttacking", true);
            _mob.anims.play("mob_" + name + "_attack", true);
            if (_mob.flipX) this._mob_minotaur_body.setOffset(65, 55);
            else this._mob_minotaur_body.setOffset(35, 55);
            _mob.once(
              "animationcomplete",
              (anim: Phaser.Animations.Animation) => {
                if (anim.key == "mob_" + name + "_attack") {
                  this.updateHealthBar(this._mob_minotaur_damage);
                  this.time.delayedCall(200, () => {
                    _mob.setData("isAttacking", false);
                  });
                  this.time.delayedCall(
                    this._mob_minotaur_attack_cooldown,
                    () => {
                      _mob.setData("attackCooldown", false);
                    }
                  );
                }
              }
            );
          }
        }
      }
    } else {
      _mob.forEach((mob, index) => {
        if (
          !mob.getData("isAttacking") &&
          !mob.getData("dead") &&
          !mob.getData("isFalling")
        ) {
          if (this._player.x - mob.x > 80) {
            mob.anims.play("mob_" + name + "_walk", true); 
            mob.setFlipX(false); 
            mob.setVelocityX(mob.getData("speed")); 
          } else if (this._player.x - mob.x < -80) {
            mob.anims.play("mob_" + name + "_walk", true); 
            mob.setFlipX(true); 
            mob.setVelocityX(-mob.getData("speed")); 
          } else {
            mob.setVelocityX(0); 
            if (mob.getData("attackCooldown")) {
              mob.anims.play("mob_" + name + "_idle", true); 
            } else {
              if (Math.abs(this._player.x - mob.x) < 80) {
                mob.setData("isAttacking", true); 
                mob.anims.play("mob_" + name + "_attack", true); 
                mob.once(
                  "animationcomplete",
                  (anim: Phaser.Animations.Animation) => {
                    if (anim.key == "mob_" + name + "_attack") {
                      mob.setData("attackCooldown", true); 
                      if (
                        (mob.flipX == false &&
                          this._player.x - mob.x < 80 &&
                          this._player.x - mob.x > 20) ||
                        (mob.flipX == true &&
                          this._player.x - mob.x > -80 &&
                          this._player.x - mob.x < -20)
                      )
                        this.updateHealthBar(mob.getData("damage")); 
                      this.time.delayedCall(200, () => {
                        mob.setData("isAttacking", false);
                      });
                      this.time.delayedCall(mob.getData("cooldow"), () => {
                        mob.setData("attackCooldown", false);
                        if(name == 'goblin') this._musicGoblinHit.play();
                        else this._musicSkeletonHit.play();
                      });
                    }
                  }
                );
              }
            }
          }
        } else if (mob.getData("isFalling")) {
          if (mob.y == 597.5) {
            mob.setData("isFalling", false);
          }
        }
      });
    }
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

  executeAttack(): void {
    if (this._isAttacking) return; 
    if (!this._isAttacking) {
      this._isAttacking = true; 
      this._player.setVelocityX(0); 
      switch (this._player_attack) {
        case 0:
          this._player.anims.play("player_attack1", true);
          break;
        case 1:
          this._player.anims.play("player_attack2", true);
          break;
        case 2:
          this._player.anims.play("player_attack3", true);
          break;
      }
      this._player_attack = (this._player_attack + 1) % 3; 
      this.time.delayedCall(500, () => {
        this._isAttacking = false;
      });
      if (this._bossfight) this.checkHit(this._mob_minotaur, "");
      else {
        this.checkHit(this._mob_goblin, "goblin");
        this.checkHit(this._mob_skeleton, "skeleton");
      }
    }
  }

  updateHealthBar(amount: any): void {
    if (this._player_invicibility) return; 
    this.events.emit("update_health", -amount); 
    if (!this._gameOver) this.hit(); 
  }

  hit(): void {
    this._player_hit = true; 
    this._player_invicibility = true; 
    this._player.setVelocityX(0); 
    this._player.anims.stop(); 
    this._player.anims.play("player_hit", true); 
    this._player.once(
      "animationcomplete",
      (anim: Phaser.Animations.Animation) => {
        this._player_hit = false; 
        this.time.delayedCall(this._player_invicibility_duration * 1000, () => {
          this._player_invicibility = false; 
        });
      }
    );
  }

  death(): void {
    if (!this._gameOver) {
      this._gameOver = true; 
      this._player.anims.stop(); 
      this._player.play("player_death", true); 
      console.log('death');
    }
    this._player.destroy(); 
    this.anims.remove("_mob_skeleton_idle");
    this.anims.remove("_mob_skeleton_walk");
    this.anims.remove("_mob_skeleton_attack");
    this.anims.remove("_mob_skeleton_hit");
    this.anims.remove("_mob_skeleton_death");
    this.anims.remove("_mob_goblin_idle");
    this.anims.remove("_mob_goblin_walk");
    this.anims.remove("_mob_goblin_attack1");
    this.anims.remove("_mob_goblin_attack1");
    this.anims.remove("_mob_goblin_hit");
    this.anims.remove("_mob_goblin_death");
    this.anims.remove("_mob_minotaur_idle");
    this.anims.remove("_mob_minotaur_walk");
    this.anims.remove("_mob_minotaur_attack");
    this.anims.remove("_mob_minotaur_hit");
    this.anims.remove("_mob_minotaur_death");

    this.time.delayedCall(2000, () => {
      this.scene.stop(this); 
      this.scene.stop("Hud"); 
      this.sound.stopAll();
      this.scene.start("GameOver"); 
    });
  }

  checkBossFight(): void {
    if (
      this._player_kills == (this._mob_goblin_maxSpawns + this._mob_skeleton_maxSpawns) &&
      !this._bossfight
    )
      this.bossFightStart();
  }

  playerMovements(): void {
    if (!this._player_hit && !this._isAttacking) {
      if (this._cursors.left.isDown) {
        this._player.setVelocityX(-this._player_velocity);
        this._player.anims.play("player_walk", true);
        this._player.setFlipX(true);
      } else if (this._cursors.right.isDown) {
        this._player.setVelocityX(this._player_velocity);
        this._player.anims.play("player_walk", true);
        this._player.setFlipX(false);
      } else {
        this._player.setVelocityX(0);
        this._player.anims.play("player_idle", true);
      }
    }
  }

  update(time: number, delta: number): void {
    if (!this._gameOver) {
      if (Phaser.Input.Keyboard.JustDown(this._keyX)) this.executeAttack(); 
      this.playerMovements();
      if (this._bossfight) this.enemiesMovement(this._mob_minotaur, "minotaur");
      else {
        this.enemiesMovement(this._mob_goblin, "goblin");
        this.enemiesMovement(this._mob_skeleton, "skeleton");
        this.enemyHealthBar(this._mob_goblin);
        this.enemyHealthBar(this._mob_skeleton);
        this.checkBossFight();
      }
    }
  }

  create() {
    this._gameOver = false;
    this._bossfight = false;
    this._player_kills = 0;
    this._hud = this.scene.get("Hud") as Hud;
    this._hud.events.off("death", this.death, this);
    this._hud.events.on("death", this.death, this);
    this._keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    this._mob_skeleton = [];
    this._mob_skeleton_body = [];
    this._mob_goblin = [];
    this._mob_goblin_body = [];

    this._bg1 = this.add
      .tileSprite(0, 0, 1280, 800, "lvl1_forest")
      .setOrigin(0, 0);
    this.physics.world.setBounds(0, -150, this.scale.width, this.scale.height);
    
    this._musicGoblinAttack = this.sound.add("goblin_attack", { loop: false, volume: 0.5 });
    this._musicGoblinHit = this.sound.add("goblin_hit", { loop: false, volume: 0.5 });
    this._musicGoblinDeath = this.sound.add("goblin_death", { loop: false, volume: 0.5 });
    this._musicGoblinWalk = this.sound.add("goblin_walk", { loop: false, volume: 0.5 });

    this._musicSkeletonDeath = this.sound.add("skeleton_death", { loop: false, volume: 0.5 });
    this._musicSkeletonHit = this.sound.add("skeleton_hit", { loop: false, volume: 0.5});
    this._musicSkeletonWalk = this.sound.add("skeleton_walk", { loop: false, volume: 0.5 });

    this.musicPlayer = this.sound.add("footstepDirt2", { loop: true, volume: 0.5, rate: .3 });
    this.musicSwoosh = this.sound.add("metalSwoosh1", { loop: false, volume: 0.7 });

    this._pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    this._pauseKey.on('down', () => {
      this.scene.pause(this);
      this.scene.launch('Paused'); 
    });

    this._player = this.physics.add
      .sprite(100, this.game.canvas.height - 100, "pg_lvl1")
      .setScale(3)
      .setSize(40, 55)
      .setOffset(57, 66)
      .setDepth(100);
    this._player_body = this._player.body as Phaser.Physics.Arcade.Body;

    this.time.addEvent({
      delay: 12 * 1000,
      repeat: -1,
      callback: () => {
        if(this._gameOver) return;
        let text: Phaser.GameObjects.Text;
        let x = Phaser.Math.Between(0, 1);
        if (x == 0) {
          text = this.add.text(
            this.game.canvas.width / 2,
            this.game.canvas.height - 200,
            "CAOS SPECULARE"
          ).setAngle(180).setFontSize(32);
          this._camera_angle += 180;
          this.cameras.main.setAngle(this._camera_angle);
          this.time.delayedCall(3000, () => {
            this._camera_angle = 0;
            this.cameras.main.setAngle(this._camera_angle);
            text.destroy();
          });
        } 
        else {
          text = this.add.text(
            this.game.canvas.width / 2,
            this.game.canvas.height - 200,
            "CAOS INVERSO"
          ).setFontSize(32);
          this._player_velocity = -this._player_velocity;
          this.time.delayedCall(3000, () => {
            this._player_velocity = -this._player_velocity;
            text.destroy();
          });
        }
      },
    });

    if (this._mob_skeleton_maxSpawns > 0) {
      this.time.addEvent({
        repeat: this._mob_skeleton_maxSpawns -1, 
        delay:
          Phaser.Math.Between(this._mob_skeleton_min, this._mob_skeleton_max) *
          1000,
        callback: () => {
          const skeleton = this.physics.add
            .sprite(
              Phaser.Math.Between(0, 1) * (this.game.canvas.width - 60) + 30, 
              this.game.canvas.height - 70, 
              "skeleton"
            )
            .setScale(3);
  
          const skeletonBody = skeleton.body as Phaser.Physics.Arcade.Body;
          skeletonBody.setSize(40, 35);
          skeleton.setCollideWorldBounds(true).setGravity(0, 100);
  
          (skeleton as any).health = this._mob_skeleton_health; 
  
          const healthBar = this.add.graphics();
          healthBar.fillStyle(0xff0000); 
          healthBar.fillRect(skeleton.x - 20, skeleton.y - 40, 40, 5); 
          (skeleton as any).healthBar = healthBar;
  
          this._mob_skeleton.push(skeleton);
          this._mob_skeleton_body.push(skeletonBody);
          skeleton.setData("cooldown", this._mob_skeleton_attack_cooldown);
          skeleton.setData("damage", this._mob_skeleton_damage);
          skeleton.setData("speed", this._mob_skeleton_speed);
        },
      });
    }

    if (this._mob_goblin_maxSpawns > 0) {
      this.time.addEvent({
        repeat: this._mob_goblin_maxSpawns - 1, 
        delay:
          Phaser.Math.Between(this._mob_goblin_min, this._mob_goblin_max) * 1000,
        callback: () => {
          const goblin = this.physics.add
            .sprite(
              Phaser.Math.Between(0, 1) * (this.game.canvas.width - 60) + 30, 
              this.game.canvas.height - 70, 
              "goblin_walk"
            )
            .setScale(3)
            .setOffset(0, 40);
  
          const goblinBody = goblin.body as Phaser.Physics.Arcade.Body;
          goblinBody.setSize(40, 35);
          goblin.setCollideWorldBounds(true).setGravity(0, 100);
  
          (goblin as any).health = this._mob_goblin_health; 
  
          const healthBar = this.add.graphics();
          healthBar.fillStyle(0xff0000); 
          healthBar.fillRect(goblin.x - 20, goblin.y - 40, 40, 5); 
          (goblin as any).healthBar = healthBar;
  
          this._mob_goblin.push(goblin);
          this._mob_goblin_body.push(goblinBody);
          goblin.setData("cooldown", this._mob_goblin_attack_cooldown);
          goblin.setData("damage", this._mob_goblin_damage);
          goblin.setData("speed", this._mob_goblin_speed);
        },
      });
    }

    this.events.emit("level1_ready");
    this._player.setCollideWorldBounds(true).setGravity(0, 100);
    this._cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "mob_goblin_idle",
      frames: this.anims.generateFrameNumbers("goblin_idle", {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_goblin_walk",
      frames: this.anims.generateFrameNumbers("goblin_walk", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_goblin_attack",
      frames: this.anims.generateFrameNumbers("goblin_attack1", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: 0,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_goblin_attack2",
      frames: this.anims.generateFrameNumbers("goblin_attack2", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: 0,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_goblin_hit",
      frames: this.anims.generateFrameNumbers("goblin_hit", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: 0,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_goblin_death",
      frames: this.anims.generateFrameNumbers("goblin_death", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: 0,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_skeleton_idle",
      frames: this.anims.generateFrameNumbers("skeleton", {
        start: 39,
        end: 42,
      }),
      frameRate: 4,
      repeat: -1,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_skeleton_walk",
      frames: this.anims.generateFrameNumbers("skeleton", {
        start: 26,
        end: 37,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_skeleton_attack",
      frames: this.anims.generateFrameNumbers("skeleton", {
        start: 0,
        end: 12,
      }),
      frameRate: 10,
      repeat: 0,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_skeleton_hit",
      frames: this.anims.generateFrameNumbers("skeleton", {
        start: 52,
        end: 54,
      }),
      frameRate: 10,
      repeat: 0,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_skeleton_death",
      frames: this.anims.generateFrameNumbers("skeleton", {
        start: 13,
        end: 25,
      }),
      frameRate: 8,
      repeat: 0,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_minotaur_idle",
      frames: this.anims.generateFrameNumbers("boss_lvl1-fix", {
        start: 0,
        end: 9,
      }),
      frameRate: 6,
      repeat: 0,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_minotaur_walk",
      frames: this.anims.generateFrameNumbers("boss_lvl1-fix", {
        start: 14,
        end: 23,
      }),
      frameRate: 6,
      repeat: -1,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_minotaur_attack",
      frames: this.anims.generateFrameNumbers("boss_lvl1", {
        start: 24,
        end: 28,
      }),
      frameRate: 8,
      repeat: 0,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_minotaur_hit",
      frames: this.anims.generateFrameNumbers("boss_lvl1", {
        start: 36,
        end: 38,
      }),
      frameRate: 6,
      repeat: 0,
      yoyo: false,
    });

    this.anims.create({
      key: "mob_minotaur_death",
      frames: this.anims.generateFrameNumbers("boss_lvl1", {
        start: 48,
        end: 52,
      }),
      frameRate: 6,
      repeat: 0,
      yoyo: false,
    });
  }
}