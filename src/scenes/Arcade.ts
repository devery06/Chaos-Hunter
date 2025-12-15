import Phaser from "phaser";

export default class Arcade extends Phaser.Scene {
  // Background
  private _bg1: Phaser.GameObjects.TileSprite;

  // Player & Physics
  private _player: Phaser.Physics.Arcade.Sprite;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _pauseKey: Phaser.Input.Keyboard.Key;
  private _keyX: Phaser.Input.Keyboard.Key;
  private _keyDash: Phaser.Input.Keyboard.Key;

  // Stats Player
  private _player_velocity: number = 160;
  private _player_damage: number = 25;
  private _player_range: number = 90; // Range ridotto

  // Stati Player
  private _player_hit: boolean = false;
  private _player_invicibility: boolean = false;
  private _isAttacking: boolean = false;
  private _isDashing: boolean = false;
  private _canDash: boolean = true;
  private _player_attack_index: number = 0;

  // Arcade Stats
  private _score: number = 0;
  private _scoreText: Phaser.GameObjects.Text;
  private _spawnDelay: number = 2500;
  private _minSpawnDelay: number = 600;
  private _health: number = 100;
  private _maxHealth: number = 100;

  // Enemies Containers
  private _enemies: Phaser.Physics.Arcade.Group;

  // Sounds & Music
  private _themeMusic: Phaser.Sound.BaseSound;

  //buttons
  private _muteBtn: Phaser.GameObjects.Sprite;
  private _menuBtn: Phaser.GameObjects.Text;

  private _musicGoblinAttack: Phaser.Sound.BaseSound;
  private _musicGoblinHit: Phaser.Sound.BaseSound;
  private _musicGoblinDeath: Phaser.Sound.BaseSound;
  private _musicGoblinWalk: Phaser.Sound.BaseSound;

  private _musicSkeletonDeath: Phaser.Sound.BaseSound;
  private _musicSkeletonHit: Phaser.Sound.BaseSound;
  private _musicSkeletonWalk: Phaser.Sound.BaseSound;

  private musicPlayer: Phaser.Sound.BaseSound;
  private musicSwoosh: Phaser.Sound.BaseSound;

  // UI Arcade
  private _healthBar: Phaser.GameObjects.Graphics;
  private _healthBackground: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "Arcade",
    });
  }

  createMuteButton() {
    const startFrame = this.sound.mute ? 0 : 1;

    this._muteBtn = this.add
      .sprite(
        this.scale.width - (this._menuBtn.width + this._scoreText.width + 100),
        40,
        "icon",
        startFrame
      )
      .setScrollFactor(0)
      .setDepth(20000)
      .setScale(0.6)
      .setInteractive({ useHandCursor: true });

    this._muteBtn.on("pointerdown", () => {
      this.sound.mute = !this.sound.mute;
      const newFrame = this.sound.mute ? 1 : 0;
      this._muteBtn.setFrame(newFrame);
    });
  }

  UpdateUI() {
    this._menuBtn.x = this.scale.width - (this._scoreText.width + 110);
    this._muteBtn.x =
      this.scale.width - (this._menuBtn.width + this._scoreText.width + 100);
  }

  loadAudios() {
    this._musicGoblinAttack = this.sound.add("goblin_attack", {
      loop: false,
      volume: 0.5,
    });
    this._musicGoblinHit = this.sound.add("goblin_hit", {
      loop: false,
      volume: 0.5,
    });
    this._musicGoblinDeath = this.sound.add("goblin_death", {
      loop: false,
      volume: 0.5,
    });
    this._musicGoblinWalk = this.sound.add("goblin_walk", {
      loop: false,
      volume: 0.5,
    });

    this._musicSkeletonDeath = this.sound.add("skeleton_death", {
      loop: false,
      volume: 0.5,
    });
    this._musicSkeletonHit = this.sound.add("skeleton_hit", {
      loop: false,
      volume: 0.5,
    });
    this._musicSkeletonWalk = this.sound.add("skeleton_walk", {
      loop: false,
      volume: 0.5,
    });

    this.musicPlayer = this.sound.add("footstepDirt2", {
      loop: true,
      volume: 0.5,
      rate: 0.3,
    });
    this.musicSwoosh = this.sound.add("metalSwoosh1", {
      loop: false,
      volume: 0.7,
    });
  }

  create() {
    this.loadAudios();
    this.sound.stopAll();
    this._themeMusic = this.sound.add("battle_theme", {
      loop: true,
      volume: 0.2,
    });
    this._themeMusic.play();

    // 1. Reset Variabili Arcade
    this._score = 0;
    this._spawnDelay = 2500;
    this._health = 100;
    this._player_hit = false;
    this._player_invicibility = false;
    this._isAttacking = false;
    this._isDashing = false;
    this._canDash = true;

    // 2. Setup World & Input
    this.cameras.main.setBackgroundColor("#000000");
    this.physics.world.setBounds(0, -150, 1280, 800);

    this._cursors = this.input.keyboard.createCursorKeys();
    this._keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this._keyDash = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
    this._pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.P
    );

    this._pauseKey.on("down", () => {
      this.scene.pause();
      this.scene.launch("Paused");
    });

    // 3. Background
    this._bg1 = this.add
      .tileSprite(0, 0, 1280, 800, "lvl1_forest")
      .setOrigin(0, 0);

    // 4. Player Setup
    this._player = this.physics.add
      .sprite(100, 660, "pg_lvl1")
      .setScale(3)
      // Hitbox Player stretta
      .setSize(25, 50)
      .setOffset(65, 78)
      .setDepth(10);

    this._player.setCollideWorldBounds(true).setGravity(0, 100);

    // 5. Enemy Group
    this._enemies = this.physics.add.group({
      runChildUpdate: true,
    });

    // 6. UI Arcade
    this._healthBackground = this.add
      .image(406, 245, "healthSword")
      .setOrigin(0.5)
      .setDepth(100)
      .setScale(0.8);

    this._healthBar = this.add.graphics().setDepth(101);
    this.drawHealthBar();

    this._scoreText = this.add
      .text(1250, 40, "SCORE: 0", {
        fontFamily: "MaleVolentz",
        fontSize: "36px",
        color: "#ffffff",
      })
      .setOrigin(1, 0.5)
      .setDepth(100)
      .setStroke("#000000", 4);

    // MENU BUTTON
    this._menuBtn = this.add
      .text(this.scale.width - (this._scoreText.width + 110), 40, "MENU", {
        fontFamily: "MaleVolentz",
        fontSize: "36px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setStroke("#000000", 4)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this._menuBtn.setColor("#ff0000");
      })
      .on("pointerout", () => {
        this._menuBtn.setColor("#ffffff");
      })
      .on("pointerdown", () => {
        this.sound.stopAll();
        this.scene.stop();
        if (this.scene.get("Hud").scene.isActive()) {
          this.scene.stop("Hud");
        }
        this.scene.start("Intro"); // Torna al menu
      });

    this.createMuteButton();
    // 7. Sounds
    this._musicGoblinHit = this.sound.add("goblin_hit", { volume: 0.5 });
    this._musicSkeletonHit = this.sound.add("skeleton_hit", { volume: 0.5 });

    // 8. Animazioni
    this.createAnimations();

    // 9. Start Spawner
    this.spawnLoop();

    // 10. Rigenerazione Passiva
    this.time.addEvent({
      delay: 1500,
      callback: () => {
        if (this._health > 0 && this._health < this._maxHealth) {
          this._health += 2;
          if (this._health > this._maxHealth) this._health = this._maxHealth;
          this.drawHealthBar();
        }
      },
      loop: true,
    });
  }

  update(time: number, delta: number) {
    if (this._health <= 0) return;

    // Player Logic
    this.playerMovements();

    // Attacco (X)
    if (Phaser.Input.Keyboard.JustDown(this._keyX)) {
      this.executeAttack();
    }

    // Dash (SHIFT)
    if (Phaser.Input.Keyboard.JustDown(this._keyDash)) {
      this.executeDash();
    }

    // Enemy AI Logic
    this._enemies.children.each((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      if (enemy.active) {
        this.enemyAI(enemy);
      }
      return true;
    });

    // Aggiornamento Barre Vita Nemici
    this.updateEnemyHealthBars();
  }

  // --- DASH SYSTEM ---

  executeDash() {
    if (
      !this._canDash ||
      this._isAttacking ||
      this._player_hit ||
      this._isDashing
    )
      return;

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

    this.time.delayedCall(1000, () => {
      this._canDash = true;
    });
  }

  // --- SPAWN SYSTEM ---

  spawnLoop() {
    this.time.delayedCall(this._spawnDelay, () => {
      if (this._health > 0) {
        this.spawnEnemy();
        this.spawnLoop();
      }
    });
  }

  spawnEnemy() {
    let spawnType = Phaser.Math.Between(0, 1);

    if (this._score >= 0) {
      if (Phaser.Math.Between(0, 100) < 10) { // 10% chance Minotauro
        spawnType = 2;
      }
    }

    const side = Phaser.Math.Between(0, 1);
    let xPos = side === 0 ? -100 : 1380;

    let key = "goblin_walk";
    let name = "goblin";
    let hp = 50;
    let damage = 20;
    let points = 100;
    let speed = 80;
    let yPos = 600;

    if (spawnType === 0) {
      key = "goblin_walk";
      name = "goblin";
      hp = 50;
      damage = 20;
      points = 100;
      speed = 80;
    } else if (spawnType === 1) {
      key = "skeleton";
      name = "skeleton";
      hp = 75;
      damage = 30;
      points = 125;
      speed = 50;
    } else {
      // MINOTAURO
      key = "boss_lvl1-fix";
      name = "minotaur";
      hp = 150;
      damage = 40;
      points = 500;
      speed = 45;
      yPos = 450;
    }

    const enemy = this.physics.add.sprite(xPos, yPos, key).setScale(3);

    // --- HITBOX OTTIMIZZATE (Strette) ---
    if (name === "minotaur") {
      enemy.setSize(30, 45).setOffset(50, 80);
    } else if (name === "goblin") {
      enemy.setSize(16, 25).setOffset(14, 60);
    } else {
      enemy.setSize(18, 40).setOffset(23, 45);
    }
    
    enemy.setCollideWorldBounds(true).setGravity(0, 100);

    enemy.setData("name", name);
    enemy.setData("hp", hp);
    enemy.setData("maxHp", hp);
    enemy.setData("speed", speed);
    enemy.setData("damage", damage);
    enemy.setData("points", points);

    enemy.setData("isAttacking", false);
    enemy.setData("isHit", false);
    enemy.setData("invincible", false);
    enemy.setData("dead", false);

    const hpBar = this.add.graphics();
    hpBar.setDepth(15);
    (enemy as any).hpBar = hpBar;

    this._enemies.add(enemy);
  }

  // --- HEALTH BAR NEMICI ---

  updateEnemyHealthBars() {
    this._enemies.children.each((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      const hpBar = (enemy as any).hpBar as Phaser.GameObjects.Graphics;

      if (enemy.active && hpBar) {
        const currentHp = enemy.getData("hp");
        const maxHp = enemy.getData("maxHp");
        const name = enemy.getData("name");

        hpBar.clear();

        let width = 40;
        let height = 5;
        let yOffset = -50;

        if (name === "minotaur") {
          width = 80;
          height = 8;
          yOffset = -80;
        }

        const x = enemy.x - width / 2;
        const y = enemy.y + yOffset;

        hpBar.fillStyle(0x000000, 0.6);
        hpBar.fillRect(x, y, width, height);

        if (currentHp > 0) {
          const hpPercent = currentHp / maxHp;
          hpBar.fillStyle(0xff0000, 1);
          hpBar.fillRect(x, y, width * hpPercent, height);
        }
      }
      return true;
    });
  }

  // --- AI & COMBAT ---

  enemyAI(enemy: Phaser.Physics.Arcade.Sprite) {
    if (
      enemy.getData("dead") ||
      enemy.getData("isAttacking") ||
      enemy.getData("isHit")
    )
      return;

    const dist = this._player.x - enemy.x;
    const name = enemy.getData("name");
    const speed = enemy.getData("speed");

    const attackRange = name === "minotaur" ? 90 : 60;

    if (Math.abs(dist) > attackRange) {
      enemy.setVelocityX(dist > 0 ? speed : -speed);
      enemy.setFlipX(dist < 0);
      enemy.anims.play(`mob_${name}_walk`, true);
    } else {
      enemy.setVelocityX(0);
      this.enemyAttack(enemy);
    }
  }

  enemyAttack(enemy: Phaser.Physics.Arcade.Sprite) {
    if (enemy.getData("isAttacking") || enemy.getData("isHit")) return;

    const name = enemy.getData("name");
    enemy.setData("isAttacking", true);
    enemy.anims.play(`mob_${name}_attack`, true);
    if (name === "goblin" && this._musicGoblinAttack) {
      this._musicGoblinAttack.play();
    }

    enemy.once("animationcomplete", () => {
      if (enemy.active && !enemy.getData("dead")) {
        const dist = Math.abs(this._player.x - enemy.x);
        const hitRange = name === "minotaur" ? 120 : 90;

        if (dist < 50 || dist < hitRange) {
          this.handlePlayerHit(enemy);
        }
      }

      // --- LOGICA IDLE DOPO ATTACCO ---
      // Invece di liberarlo subito, facciamo partire l'Idle e un timer
      if(enemy.active && !enemy.getData("dead")) {
          enemy.anims.play(`mob_${name}_idle`, true);
      }

      // Tempo in cui sta fermo dopo aver attaccato (Cooldown)
      const cooldown = name === "minotaur" ? 2000 : 800; // 2 secondi per il boss

      this.time.delayedCall(cooldown, () => {
        if (enemy.active) enemy.setData("isAttacking", false);
      });
    });
  }

  handlePlayerHit(enemy: Phaser.Physics.Arcade.Sprite) {
    if (
      this._player_invicibility ||
      this._player_hit ||
      this._isDashing ||
      this._health <= 0 ||
      enemy.getData("dead")
    )
      return;
    if (this.musicPlayer && this.musicPlayer.isPlaying) this.musicPlayer.stop();
    this._isAttacking = false;

    const dmg = enemy.getData("damage");
    this._health -= dmg;
    this.drawHealthBar();

    this._player_hit = true;
    this._player_invicibility = true;

    this._player.setVelocityX(0);
    this._player.anims.stop();
    this._player.anims.play("player_hit", true);

    this.cameras.main.shake(100, 0.01);

    this.tweens.add({
      targets: this._player,
      alpha: 0.5,
      yoyo: true,
      repeat: 8,
      duration: 100,
    });

    if (this._health <= 0) {
      this._health = 0;
      this.death();
    } else {
      this.time.delayedCall(500, () => {
        this._player_hit = false;
      });

      this.time.delayedCall(2000, () => {
        this._player_invicibility = false;
        this._player.setAlpha(1);
      });
    }
  }

  executeAttack() {
    if (
      this._isAttacking ||
      this._player_hit ||
      this._isDashing ||
      this._health <= 0
    )
      return;

    this._isAttacking = true;
    this._player.setVelocityX(0);
    if (this.musicSwoosh) this.musicSwoosh.play();

    const attacks = ["player_attack1", "player_attack2", "player_attack3"];
    this._player.anims.play(attacks[this._player_attack_index], true);
    this._player_attack_index = (this._player_attack_index + 1) % 3;

    this.time.delayedCall(200, () => {
      if (this._player_hit || !this._isAttacking) return;

      const range = this._player_range;
      const hitBox = this._player.flipX
        ? new Phaser.Geom.Rectangle(this._player.x - range, this._player.y - 60, range, 120)
        : new Phaser.Geom.Rectangle(this._player.x, this._player.y - 60, range, 120);

      this._enemies.children.each((child) => {
        const enemy = child as Phaser.Physics.Arcade.Sprite;

        if (enemy.active && !enemy.getData("dead")) {
          const isOverlapping = Phaser.Geom.Intersects.RectangleToRectangle(hitBox, enemy.getBounds());
          
          const dist = enemy.x - this._player.x;
          // Controllo direzionale (FIX)
          const isInFront = (this._player.flipX && dist < 10) || (!this._player.flipX && dist > -10);

          if (isOverlapping && isInFront) {
            this.hitEnemy(enemy);
          }
        }
        return true;
      });

      this.time.delayedCall(400, () => {
        this._isAttacking = false;
      });
    });
  }

  hitEnemy(enemy: Phaser.Physics.Arcade.Sprite) {
    if (enemy.getData("dead") || enemy.getData("invincible")) return;

    let hp = enemy.getData("hp");
    hp -= this._player_damage;
    enemy.setData("hp", hp);

    const name = enemy.getData("name");

    enemy.setData("isHit", true);
    enemy.setData("invincible", true);

    // FIX: Non bloccare l'attacco del Minotauro se viene colpito
    if (name !== "minotaur") {
      enemy.setData("isAttacking", false);
    }

    if (hp <= 0) {
      enemy.setData("dead", true);
      enemy.setVelocity(0, 0);
      enemy.body.enable = false;
      enemy.anims.play(`mob_${name}_death`, true);

      if (name === "goblin") this._musicGoblinDeath.play();
      else if (name === "skeleton") this._musicSkeletonDeath.play();

      const hpBar = (enemy as any).hpBar as Phaser.GameObjects.Graphics;
      if (hpBar) hpBar.destroy();

      const points = enemy.getData("points");
      this._score += points;
      this._scoreText.setText("SCORE: " + this._score);
      this.UpdateUI();

      if (this._spawnDelay > this._minSpawnDelay) {
        this._spawnDelay -= 50;
      }

      enemy.once("animationcomplete", () => {
        enemy.destroy();
      });
    } else {
      if (name === "minotaur") {
        // Solo lampeggio per minotauro
        this.tweens.add({
          targets: enemy,
          alpha: 0.5,
          yoyo: true,
          repeat: 1,
          duration: 100,
          onComplete: () => {
            enemy.setAlpha(1);
          },
        });
      } else {
        // Animazione hit per gli altri
        enemy.anims.play(`mob_${name}_hit`, true);
        const knockback = 80;
        enemy.setVelocityX(this._player.flipX ? -knockback : knockback);
      }

      if (name === "goblin") this._musicGoblinHit.play();
      else if (name === "skeleton") this._musicSkeletonHit.play();

      const recoveryTime = name === "minotaur" ? 800 : 500;

      this.time.delayedCall(recoveryTime, () => {
        if (enemy.active && !enemy.getData("dead")) {
          enemy.setData("isHit", false);
          enemy.setData("invincible", false);
        }
      });
    }
  }

  playerMovements() {
    if (this._player_hit || this._isAttacking || this._isDashing) {
      if (this.musicPlayer && this.musicPlayer.isPlaying)
        this.musicPlayer.stop();
      return;
    }

    if (this._cursors.left.isDown) {
      this._player.setVelocityX(-this._player_velocity);
      this._player.setFlipX(true);
      this._player.anims.play("player_walk", true);

      if (this.musicPlayer && !this.musicPlayer.isPlaying)
        this.musicPlayer.play();
    } else if (this._cursors.right.isDown) {
      this._player.setVelocityX(this._player_velocity);
      this._player.setFlipX(false);
      this._player.anims.play("player_walk", true);

      if (this.musicPlayer && !this.musicPlayer.isPlaying)
        this.musicPlayer.play();
    } else {
      this._player.setVelocityX(0);
      this._player.anims.play("player_idle", true);

      if (this.musicPlayer && this.musicPlayer.isPlaying)
        this.musicPlayer.stop();
    }
  }

  drawHealthBar() {
    this._healthBar.clear();
    const maxBarWidth = 166;
    const percentage = this._health / this._maxHealth;
    const currentBarWidth = maxBarWidth * percentage;
    this._healthBar.fillStyle(0xbac6d4);
    this._healthBar.fillRect(65, 53, currentBarWidth, 18);
  }

  death() {
    this._player.setVelocity(0, 0);
    this._player.anims.play("player_death", true);
    this.physics.pause();
    this.input.keyboard.enabled = false;

    this.add
      .text(this.scale.width / 2, this.scale.height / 2, "GAME OVER", {
        fontFamily: "MaleVolentz",
        fontSize: "100px",
        color: "#ff0000",
      })
      .setOrigin(0.5)
      .setStroke("#000000", 10)
      .setDepth(100);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 100,
        "Final Score: " + this._score,
        {
          fontSize: "40px",
          color: "#ffffff",
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    this.time.delayedCall(4000, () => {
      this.input.keyboard.enabled = true;
      this.scene.start("Intro");
    });
  }

  createAnimations() {
    // PLAYER
    if (!this.anims.exists("player_walk")) {
      this.anims.create({
        key: "player_idle",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 0,
          end: 7,
        }),
        frameRate: 4,
        repeat: -1,
      });
      this.anims.create({
        key: "player_walk",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 57,
          end: 63,
        }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: "player_attack1",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 8,
          end: 11,
        }),
        frameRate: 10,
        repeat: 0,
      });
      this.anims.create({
        key: "player_attack2",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 16,
          end: 19,
        }),
        frameRate: 10,
        repeat: 0,
      });
      this.anims.create({
        key: "player_attack3",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 24,
          end: 27,
        }),
        frameRate: 10,
        repeat: 0,
      });
      this.anims.create({
        key: "player_hit",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 64,
          end: 67,
        }),
        frameRate: 10,
        repeat: 0,
      });
      this.anims.create({
        key: "player_death",
        frames: this.anims.generateFrameNumbers("pg_lvl1", {
          start: 32,
          end: 37,
        }),
        frameRate: 6,
        repeat: 0,
      });
    }

    // GOBLIN
    if (!this.anims.exists("mob_goblin_walk")) {
      this.anims.create({
        key: "mob_goblin_walk",
        frames: this.anims.generateFrameNumbers("goblin_walk", {
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "mob_goblin_attack",
        frames: this.anims.generateFrameNumbers("goblin_attack1", {
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: 0,
      });
      this.anims.create({
        key: "mob_goblin_hit",
        frames: this.anims.generateFrameNumbers("goblin_hit", {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
        repeat: 0,
      });
      this.anims.create({
        key: "mob_goblin_death",
        frames: this.anims.generateFrameNumbers("goblin_death", {
          start: 0,
          end: 3,
        }),
        frameRate: 8,
        repeat: 0,
      });
    }

    // SKELETON
    if (!this.anims.exists("mob_skeleton_walk")) {
      this.anims.create({
        key: "mob_skeleton_walk",
        frames: this.anims.generateFrameNumbers("skeleton", {
          start: 26,
          end: 37,
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "mob_skeleton_attack",
        frames: this.anims.generateFrameNumbers("skeleton", {
          start: 0,
          end: 12,
        }),
        frameRate: 10,
        repeat: 0,
      });
      this.anims.create({
        key: "mob_skeleton_hit",
        frames: this.anims.generateFrameNumbers("skeleton", {
          start: 52,
          end: 54,
        }),
        frameRate: 10,
        repeat: 0,
      });
      this.anims.create({
        key: "mob_skeleton_death",
        frames: this.anims.generateFrameNumbers("skeleton", {
          start: 13,
          end: 25,
        }),
        frameRate: 8,
        repeat: 0,
      });
    }

    // MINOTAUR
    if (!this.anims.exists("mob_minotaur_walk")) {
      this.anims.create({
        key: "mob_minotaur_idle",
        frames: this.anims.generateFrameNumbers("boss_lvl1-fix", {
          start: 0,
          end: 9,
        }),
        frameRate: 6,
        repeat: -1,
      });
      this.anims.create({
        key: "mob_minotaur_walk",
        frames: this.anims.generateFrameNumbers("boss_lvl1-fix", {
          start: 14,
          end: 23,
        }),
        frameRate: 6,
        repeat: -1,
      });
      this.anims.create({
        key: "mob_minotaur_attack",
        frames: this.anims.generateFrameNumbers("boss_lvl1", {
          start: 24,
          end: 28,
        }),
        frameRate: 8,
        repeat: 0,
      });
      this.anims.create({
        key: "mob_minotaur_hit",
        frames: this.anims.generateFrameNumbers("boss_lvl1", {
          start: 36,
          end: 38,
        }),
        frameRate: 6,
        repeat: 0,
      });
      this.anims.create({
        key: "mob_minotaur_death",
        frames: this.anims.generateFrameNumbers("boss_lvl1", {
          start: 48,
          end: 52,
        }),
        frameRate: 6,
        repeat: 0,
      });
    }
  }
}