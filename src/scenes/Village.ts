import { Collision } from "matter";
import Phaser from "phaser";

export default class Village extends Phaser.Scene {
  private _bg3: Phaser.GameObjects.TileSprite;
  private _muteBtn: Phaser.GameObjects.Sprite;
  
  // NPC
  private _blacksmith: Phaser.GameObjects.Sprite;
  private _barmaid: Phaser.GameObjects.Sprite; 
  private _villager02: Phaser.GameObjects.Sprite; 

  // UI Testi
  private _textBox: Phaser.GameObjects.Text; // Prompt "Premi spazio"
  private _textBoxBlacksmith: Phaser.GameObjects.Text;
  private _textBoxBarmaid: Phaser.GameObjects.Text; 
  private _textBoxVillager02: Phaser.GameObjects.Text; 
  private _textBoxSharko: Phaser.GameObjects.Text;
  
  private _keySpace: Phaser.Input.Keyboard.Key;
  
  // DIALOGHI FABBRO
  private _text: Array<string> = [
    /*0*/ "",
    /*1*/ "<Mihail>: 'Andre, come stai?\n\nPremi spazio per proseguire...",
    /*2*/ "<Andre>: 'Mihail, amico mio, non ho buone notizie. C'è stato un attacco alla foresta qui vicino. Tuo figlio è passato di qui poco fa insieme agli altri soldati, erano diretti lì'.\n\nPremi spazio per proseguire...",
    /*3*/ "<Mihail>: 'Andre... devo raggiungerlo. Non posso permettere che gli accada nulla.'\n\nPremi spazio per proseguire...",
    /*4*/ "<Andre>: 'Aspetta, Mihail! La foresta è diventata pericolosa. Scheletri e goblin l'hanno infestata, e quella creatura che li guida...fa venire i brividi solo a parlarne.'\n\nPremi spazio per proseguire...",
    /*5*/ "<Mihail>: 'Allora devo muovermi, non posso lasciarlo morire.'\n\nPremi spazio per il prossimo livello...",
    /*6*/ "",
    /*7*/ "<Mihail>: 'Andre... Laurentius... Sono arrivato troppo tardi.'\n\nPremi spazio per proseguire...",
    /*8*/ "<Andre>: 'No... Dimmi che non è...'\n\nPremi spazio per proseguire...",
    /*9*/ "<Mihail>: 'Si, Andre. E' morto. E la cosa peggiore è che non ho potuto fare nulla per evitarlo...'\n\nPremi spazio per proseguire...",
    /*10*/ "<Mihail>: 'Mi divora dentro. Devo vendicarmi.'\n\nPremi spazio per proseguire...",
    /*11*/ "<Andre>: 'Mi dispiace, vecchio amico... So quanto fosse importante per te.'\n\nPremi spazio per proseguire...",
    /*12*/ "<Andre>: 'Ma ricorda: ogni eroe può cadere, ma la sua leggenda non si spegne mai.'\n\nPremi spazio per proseguire...",
    /*13*/ "<Andre>: 'E tu non sei solo in questa battaglia.'\n\nPremi spazio per proseguire...",
    /*14*/ "<Mihail>: 'Grazie Andre, il tuo supporto mi dona forza. Forza, per la caccia che sta per iniziare.'\n\nPremi spazio per proseguire",
    /*15*/ "<Andre>: 'Non farti ammazzare...'\n\nPremi Spazio per il prossimo livello",
    /*16*/ "",
    /*17*/ "<Andre>: 'Per la barba di sharko... Sei ancora vivo?!'\n\nPremi spazio per proseguire",
    /*18*/ "<Mihail>: 'Si, e le notizie non sono buone...",
    /*19*/ "",
  ];

  // DIALOGHI BARMAID
  private _textBarmaid: Array<string> = [
    "<Barmaid>: 'Mihail... prendi questo boccale, offro io. Mentre eri via e' successo qualcosa di terribile... Vai da Andre, deve parlarti.'\n\nPremi spazio per proseguire...",
    "<Barmaid>: 'C'è un silenzio spettrale oggi alla locanda... Non ho parole, Mihail. Era un ragazzo d'oro. Onoreremo la sua memoria, te lo prometto.'",
    "<Barmaid>: 'Sei tornato! L'aura intorno a te... fa tremare i muri e gelare il sangue. Vai e poni fine a questo incubo per noi.'"
  ];

  // DIALOGHI VILLAGER 02
  private _textVillager02: Array<string> = [
    "<Cittadino>: 'Ehi tu! Dicono che la foresta sia maledetta oggi. Io resterei qui al sicuro se fossi in te, si sentono urla strazianti.'",
    "<Cittadino>: 'Ho saputo di Laurentius... Se nemmeno il figlio di Mihail ce l'ha fatta, che speranza abbiamo noi poveracci? Siamo spacciati.'",
    "<Cittadino>: 'Per gli dei! Quello sguardo... sembri la Morte incarnata... Stammi lontano'"
  ];

  private _sharkoText: string =
    '"In onore del Re Sharko, eccezionale governatore e valoroso guerriero. Ricordato per aver sconfitto il caos primordiale.\n\nPremi spazio per chiudere."';

  private _blacksmithTextCount: number = 0;
  private _actualTime: number = 0;
  private _textControll: boolean = false; 

  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private _player: Phaser.Physics.Arcade.Sprite;
  private _playerBody: Phaser.Physics.Arcade.Body;
  private _player_velocity: number = 120;
  private _player_velocity_stair: number = 50;

  private _blacksmithBody: Phaser.Physics.Arcade.Body;
  private _barmaidBody: Phaser.Physics.Arcade.Body;
  private _villager02Body: Phaser.Physics.Arcade.Body;

  private _stairsZone: Phaser.GameObjects.Zone;

  constructor() {
    super({
      key: "Village",
    });
  }
  createMuteButton() {
    // 1. Logica Frame: 
    // Se è muto (true) -> Frame 0
    // Se c'è audio (false) -> Frame 1
    const currentFrame = this.sound.mute ? 0 : 1; 
    
    this._muteBtn = this.add.sprite(this.scale.width - 160, 40, 'icon', currentFrame)
      .setScrollFactor(0) 
      .setInteractive({ useHandCursor: true })
      .setScale(0.6)
      .setDepth(1000);
  
    this._muteBtn.on('pointerdown', () => {
      // 2. Invertiamo lo stato dell'audio
      this.sound.mute = !this.sound.mute;
      
      // 3. Aggiorniamo l'icona in base al NUOVO stato
      const newFrame = this.sound.mute ? 1 : 0;
      this._muteBtn.setFrame(newFrame);
    });
  }

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
            this._blacksmithTextCount = 0;
            this.scene.stop("Hud");
          }
          if (this.scene.get("GamePlay").scene.isActive()) {
            this.scene.stop("GamePlay");
          }
          this.scene.start("Intro"); 
        });

    this._keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this._textControll = false;
    
    // SFONDO NERO GLOBALE
    this.add.rectangle(0, 0, 2200, this.scale.height + 200, 0x000000).setOrigin(0).setDepth(-100);

    // Background Villaggio
    this._bg3 = this.add.tileSprite(0, 0, 2200, 800, "villageBackground").setOrigin(0, 0);

    const ground = this.add.rectangle(1100, 790, 2200, 20, 0x000000, 0);
    this.physics.add.existing(ground, true);
    // Player
    this._player = this.physics.add.sprite(100, 660, "pg_lvl1-fix").setScale(2).setSize(40, 55).setOffset(57, 66);
    this._playerBody = this._player.body as Phaser.Physics.Arcade.Body;
    this._player.setCollideWorldBounds(true).setGravity(0, 5000).setDepth(10);
    this.physics.add.collider(this._player, ground);
    // Blacksmith
    this._blacksmith = this.physics.add.sprite(1800, 590, "blacksmith").setScale(1.5).setSize(66, 64);
    this._blacksmithBody = this._blacksmith.body as Phaser.Physics.Arcade.Body;
    this._blacksmithBody.setImmovable(true);

    // BARMAID (Aggiornato: X=980, Scale=3.2)
    this._barmaid = this.physics.add.sprite(980, 710, "barmaid").setScale(3.2);
    this._barmaidBody = this._barmaid.body as Phaser.Physics.Arcade.Body;
    this._barmaidBody.setImmovable(true);
    this._barmaidBody.setAllowGravity(false); 

    // VILLAGER 02 (Aggiornato: X=450, Scale=3.2)
    this._villager02 = this.physics.add.sprite(450, 710, "villager_02").setScale(3.2); 
    this._villager02Body = this._villager02.body as Phaser.Physics.Arcade.Body;
    this._villager02Body.setImmovable(true);
    this._villager02Body.setAllowGravity(false); 

    // Stairs Zone per salire dal fabbro
    this._stairsZone = this.add.zone(1545, 734, 320, 190);
    // Aggiungo un corpo fisico invisibile dopo le scale
    const topFloor = this.add.rectangle(1970, 647, 500, 20, 0x00ff00, 0); 
    this.physics.add.existing(topFloor, true);
    const topFloorBody = topFloor.body as Phaser.Physics.Arcade.Body;
    topFloorBody.checkCollision.left = false; //disabilito le collisioni a sinistra 
    topFloorBody.checkCollision.down = false; //disabilito le collisioni al di sotto
    this.physics.add.collider(this._player, topFloor);
    this.physics.world.enable(this._stairsZone);
    (this._stairsZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    (this._stairsZone.body as Phaser.Physics.Arcade.Body).setImmovable(true);

    // Input & World
    this._cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.setBounds(0, -40, 2100, this.scale.height);

    // La camera si muove insieme al giocatore
    let mainCamera = this.cameras.main;
    mainCamera.setBounds(0, 0, 2100, 800);
    mainCamera.startFollow(this._player).setFollowOffset(0, 0);

    this.sound.stopAll(); 

    if (!this.sound.get("village_theme") || !this.sound.get("village_theme").isPlaying) this.sound.play("village_theme", { loop: true, volume: 0.4 });
    this.createMuteButton();

    // --- SETUP TESTI (Nuovo Stile Grigio/Trasparente) ---
    // 'rgba(50, 50, 50, 0.8)' per un grigio scuro semitrasparente
    const boxStyle = {
        fontSize: "20px", 
        color: "#ffffff", 
        align: "center", 
        wordWrap: { width: 400 },
        backgroundColor: 'rgba(50, 50, 50, 0.8)',
        padding: { x: 10, y: 10 }
    };
    
    // 1. Prompt "Premi Spazio"
    this._textBox = this.add.text(0, 0, "Premi spazio per parlare", {
        fontSize: "20px", color: "#ffffff", align: "center", wordWrap: { width: 400 },
        stroke: "#000000", strokeThickness: 3
      }).setOrigin(0.5, 0.5).setVisible(false).setDepth(100);

    // 2. Dialogo Fabbro
    this._textBoxBlacksmith = this.add.text(1800, 700, this._text[0], boxStyle)
        .setOrigin(0.5, 0.5).setVisible(false).setDepth(100);

    // 3. Dialogo Barmaid
    this._textBoxBarmaid = this.add.text(980, 550, "", boxStyle)
        .setOrigin(0.5, 0.5).setVisible(false).setDepth(100);

    // 4. Dialogo Villager 02
    this._textBoxVillager02 = this.add.text(450, 550, "", boxStyle)
        .setOrigin(0.5, 0.5).setVisible(false).setDepth(100);

    // 5. Cartello Sharko
    this._textBoxSharko = this.add.text(650, 450, this._sharkoText, boxStyle)
        .setOrigin(0.5).setDepth(10).setVisible(false);

    // Animazioni
    this.anims.create({
      key: "blacksmith_idle",
      frames: this.anims.generateFrameNumbers("blacksmith", { start: 0, end: 6 }),
      frameRate: 6, repeat: -1,
    });

    this.anims.create({
      key: "barmaid_idle",
      frames: this.anims.generateFrameNumbers("barmaid", { start: 0, end: 4 }),
      frameRate: 6, repeat: -1,
    });

    this.anims.create({
      key: "villager02_idle",
      frames: this.anims.generateFrameNumbers("villager_02", { start: 0, end: 5 }), 
      frameRate: 6, repeat: -1,
    });

    const fadeRect = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
        .setOrigin(0)
        .setDepth(9999)
        .setScrollFactor(0);

    this.tweens.add({
        targets: fadeRect,
        alpha: 0,
        duration: 2000,
        ease: 'Power1',
        onComplete: () => {
            fadeRect.destroy();
        }
    });
  }

  update(time: number, delta: number): void {
    // Animazioni NPC
    this._blacksmith.anims.play("blacksmith_idle", true);
    this._barmaid.anims.play("barmaid_idle", true);
    this._villager02.anims.play("villager02_idle", true);

    // Logica Scale
    const isOnStairs = this.physics.overlap(this._player, this._stairsZone);
    if (isOnStairs) (this._player.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    else (this._player.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);

    // Movimento Player
    if (this._cursors.left.isDown) {
      this._player.setVelocityX(-this._player_velocity);
      this._player.setFlipX(true);
      this._player.anims.play("player_walk", true);
      if (isOnStairs) this._player.setVelocityY(this._player_velocity_stair);
    } else if (this._cursors.right.isDown) {
      this._player.setVelocityX(this._player_velocity);
      this._player.setFlipX(false);
      this._player.anims.play("player_walk", true);
      if (isOnStairs) this._player.setVelocityY(-this._player_velocity_stair);
    } else {
      this._player.anims.play("player_idle", true);
      if (isOnStairs) this._player.setVelocity(0, 0);
      else this._player.setVelocityX(0);
    }

    // --- INTERAZIONI ---

    const playerX = this._player.x;
    let showingPrompt = false; // Flag per capire se sono vicino a QUALCUNO

    // 1. INTERAZIONE FABBRO
    if (playerX > this._blacksmith.x - 80 && playerX < this._blacksmith.x + 80) {
        showingPrompt = true; // Sono nel range!
        
        // Se non sto parlando, mostro "Premi spazio"
        if (!this._textBoxBlacksmith.visible) {
            this._textBox.setVisible(true);
            this._textBox.setPosition(this._blacksmith.x, this._blacksmith.y - 100);
        } else {
            this._textBox.setVisible(false); // Nascondo prompt se parlo
        }

        if (this._keySpace.isDown) {
            this._textBoxBlacksmith.setVisible(true);
            
            if (this._actualTime + 500 < time) {
                this._blacksmithTextCount++;
                if (this._blacksmithTextCount == 6 || this._blacksmithTextCount == 16 || this._blacksmithTextCount == 19) {
                  this.sound.stopAll();
                  this.scene.stop(this);
                  const gameplay = this.scene.get("GamePlay") as any;
                  if (gameplay) gameplay.nextLevel();
                } else {
                  if(this._text[this._blacksmithTextCount]) {
                      this._textBoxBlacksmith.text = this._text[this._blacksmithTextCount];
                  }
                }
                this._actualTime = time;
            }
        }
    } 
    // 2. INTERAZIONE BARMAID
    else if (playerX > this._barmaid.x - 80 && playerX < this._barmaid.x + 80) {
        showingPrompt = true; // Sono nel range!

        // Nascondo gli altri box per pulizia
        this._textBoxBlacksmith.setVisible(false);
        this._textBoxSharko.setVisible(false);
        this._textBoxVillager02.setVisible(false);

        if (!this._textBoxBarmaid.visible) {
            this._textBox.setVisible(true);
            this._textBox.setPosition(this._barmaid.x, this._barmaid.y - 100);
        } else {
            this._textBox.setVisible(false);
        }

        if (Phaser.Input.Keyboard.JustDown(this._keySpace)) {
            this._textBoxBarmaid.setVisible(!this._textBoxBarmaid.visible);
            
            if (this._textBoxBarmaid.visible) {
                let barmaidIndex = 0;
                if (this._blacksmithTextCount >= 5 && this._blacksmithTextCount < 15) barmaidIndex = 1;
                else if (this._blacksmithTextCount >= 15) barmaidIndex = 2;
                console.log(barmaidIndex);
                this._textBoxBarmaid.setText(this._textBarmaid[barmaidIndex]);
            }
        }
    }
    // 3. INTERAZIONE VILLAGER 02
    else if (playerX > this._villager02.x - 80 && playerX < this._villager02.x + 80) {
        showingPrompt = true; // Sono nel range!

        this._textBoxBlacksmith.setVisible(false);
        this._textBoxSharko.setVisible(false);
        this._textBoxBarmaid.setVisible(false);

        if (!this._textBoxVillager02.visible) {
            this._textBox.setVisible(true);
            this._textBox.setPosition(this._villager02.x, this._villager02.y - 100);
        } else {
            this._textBox.setVisible(false);
        }

        if (Phaser.Input.Keyboard.JustDown(this._keySpace)) {
            this._textBoxVillager02.setVisible(!this._textBoxVillager02.visible);
            if (this._textBoxVillager02.visible) {
                let villagerIndex = 0;
                if (this._blacksmithTextCount >= 5 && this._blacksmithTextCount < 15) villagerIndex = 1;
                else if (this._blacksmithTextCount >= 15) villagerIndex = 2;
                
                this._textBoxVillager02.setText(this._textVillager02[villagerIndex]);
            }
        }
    }
    // 4. INTERAZIONE SHARKO
    else if (playerX > 524 && playerX < 780) {
        showingPrompt = true; // Sono nel range!

        if (!this._textBoxSharko.visible) {
            this._textBox.setVisible(true);
            this._textBox.setPosition(650, 420);
        } else {
            this._textBox.setVisible(false);
        }

        if (Phaser.Input.Keyboard.JustDown(this._keySpace)) {
            this._textBoxSharko.setVisible(!this._textBoxSharko.visible);
        }
    }

    // --- CHIUSURA DIALOGHI SE TI ALLONTANI ---
    if (!showingPrompt) {
        this._textBox.setVisible(false);
        
        // Se mi allontano, chiudo tutti i dialoghi aperti
        this._textBoxBarmaid.setVisible(false);
        this._textBoxVillager02.setVisible(false);
        this._textBoxBlacksmith.setVisible(false);
        this._textBoxSharko.setVisible(false);
    }
  }
}