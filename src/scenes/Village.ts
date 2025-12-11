import { Collision } from "matter";
import Phaser from "phaser";

export default class Village extends Phaser.Scene {
  private _bg3: Phaser.GameObjects.TileSprite;
  private _blacksmith: Phaser.GameObjects.Sprite;
  private _textBox: Phaser.GameObjects.Text;
  private _textBoxBlacksmith: Phaser.GameObjects.Text;
  private _keySpace: Phaser.Input.Keyboard.Key;
  private _text: Array<string> = [
/*1*/    "<Mihail>: 'Andre, come stai?'\n\nPremi spazio per proseguire...",
/*2*/    "<Andre>: 'Mihail, amico mio, non ho buone notizie. C'è stato un attacco alla foresta qui vicino. Figlio è passato di qui poco fa insieme agli altri soldati, erano diretti lì'.\n\nPremi spazio per proseguire...",
/*3*/    "<Mihail>: 'Andre... devo raggiungerlo. Non posso permettere che gli accada nulla.'\n\nPremi spazio per proseguire...",
/*4*/    "<Andre>: 'Aspetta, Mihail! La foresta è diventata pericolosa. Scheletri e goblin l'hanno infestata, e quella creatura che li guida...fa venire i brividi solo a parlarne.'\n\nPremi spazio per proseguire...",
/*5*/    "<Mihail>: 'Allora devo muovermi, non posso lasciarlo morire.'\n\nPremi spazio per proseguire...", 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*6*/    "<Mihail>: 'Andre... Laurentius... Sono arrivato troppo tardi.'\n\nPremi spazio per proseguire...",
/*7*/    "<Andre>: 'No... Dimmi che non è...'\n\nPremi spazio per proseguire...",
/*8*/    "<Mihail>: 'Si, Andre. E' morto. E la cosa peggiore è che non ho potuto fare nulla per evitarlo...'\n\nPremi spazio per proseguire...",
/*9*/    "<Mihail>: 'Mi divora dentro. Devo vendicarmi.'\n\nPremi spazio per proseguire...",
/*10*/   "<Andre>: 'Mi dispiace, vecchio amico... So quanto fosse importante per te.'\n\nPremi spazio per proseguire...",
/*11*/   "<Andre>: 'Ma ricorda: ogni eroe può cadere, ma la sua leggenda non si spegne mai.'\n\nPremi spazio per proseguire...",
/*12*/   "<Andre>: 'E tu non sei solo in questa battaglia.'\n\nPremi spazio per proseguire...", 
/*13*/   "<Mihail>: 'Grazie Andre, il tuo supporto mi dona forza. Forza, per la caccia che sta per iniziare.'\n\nPremi spazio per proseguire", 
/*14*/   "<Andre>: 'Non farti ammazzare...'\n\nPremi Spazio per proseguire",
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*15*/   "<Andre>: 'Per la barba di sharko... Sei ancora vivo?!'\n\nPremi spazio per proseguire",
/*15*/   "<Mihail>: 'Andre, sono tornato"];


  private _countText: number = 0;
  private _actualTime: number = 0;
  private _textControll: boolean = false;
  private _jumpControll: boolean = false;

  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private _player: Phaser.Physics.Arcade.Sprite;
  private _playerBody: Phaser.Physics.Arcade.Body;

  //private _blacksmith: Phaser.Physics.Arcade.Sprite;
  private _blacksmithBody: Phaser.Physics.Arcade.Body;

  constructor() {
    super({
      key: "Village",
    });
  }

  create() {
    this._keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //Mettiamo il backgorund che occupa tutto lo schermo
    this._bg3 = this.add.tileSprite(0, 0, 2200, 800, "villageBackground")
      .setOrigin(0, 0);

    //Mettiamo il player
    this._player = this.physics.add.sprite(100, 664, "pg_lvl1-fix")
    .setScale(2).setSize(40, 55).setOffset(57, 66);
    this._playerBody = this._player.body as Phaser.Physics.Arcade.Body;
    this._player.setCollideWorldBounds(true).setGravity(0, 300);

    //Mettiamo il blacksmith
    
    this._blacksmith = this.physics.add
      .sprite(1800, 590, "blacksmith")
      .setScale(1.5).setSize(66, 64);
    this._blacksmithBody = this._blacksmith.body as Phaser.Physics.Arcade.Body;
    this._blacksmithBody.setImmovable(true);
    
    //platform
    this.physics.world.setBounds(0, -50, this.scale.width, this.scale.height);
    //cursors keys
    this._cursors = this.input.keyboard.createCursorKeys();
    
    let mainCamera = this.cameras.main;
    mainCamera.setBounds(0, 0, 1280, 800);
    mainCamera.startFollow(this._player)
    .setFollowOffset(0, 0);    
    
    this._textBox = this.add
    .text(this.game.canvas.width / 2, this._player.y , "Premi spazio per parlare", {
      fontSize: "20px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: 400 },
    })
      .setOrigin(0.5, 0.5);

    this._textBoxBlacksmith = this.add
      .text(this.game.canvas.width / 2, this._player.y , this._text, {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 400 },
      })
      .setOrigin(0.5, 0.5);
    this._textBoxBlacksmith.setVisible(false);

    //Animazioni
    this.anims.create({
      key: 'blacksmith_idle',
      frames: this.anims.generateFrameNumbers('blacksmith', {start: 0, end: 6}),
      frameRate: 6,
      repeat: -1,
      yoyo: false
    });
  }


  update(time: number, delta: number): void {
    this._blacksmith.anims.play('blacksmith_idle', true);
    if (this._player.x == 100 && this._player.y > 548) this._player.setY(664);
    if (this._cursors.left.isDown) {
      this._player.setVelocityX(-120);
      this._player.setFlipX(true);
      this._player.anims.play("player_walk", true);

      if(this._player.x < 910 && this._player.y < 664) this._player.setVelocityY(80);
      else this._player.setVelocityY(0);

      if (this._bg3.tilePositionX >= 2) {
        this._bg3.tilePositionX -= 2;
        this._blacksmith.setPosition(this._blacksmith.x + 2, this._blacksmith.y);
      }
    } else if (this._cursors.right.isDown) {
      this._player.setVelocityX(120);
      this._player.setFlipX(false);
      this._player.anims.play("player_walk", true);

      if(this._player.x > 730 && this._player.y > 548) {this._player.setVelocityY(-80); this._player.setGravityY(0);}
      else this._player.setVelocityY(0);

      if (this._bg3.tilePositionX <= 918) {
        this._bg3.tilePositionX += 2;
        this._blacksmith.setPosition(this._blacksmith.x - 2, this._blacksmith.y);
      }
    } else {
      this._player.setVelocity(0, 0);
      this._player.anims.play("player_idle", true);
    }

    /*if (this._cursors.up.isDown && this._player.y == 684) {
      this._player.setVelocityY(-100);
      this._player.anims.play("player_jump", true);
    } */
    
    if (this._player.x > this._blacksmith.x - 80 && this._player.x < this._blacksmith.x + 80 && this._textControll == false) {
      this._textBox.setVisible(true);
    } else {
      this._textBox.setVisible(false);
    } 
    
    if (this._player.x > this._blacksmith.x - 80 && this._player.x < this._blacksmith.x + 80 && this._keySpace.isDown && this._countText < 5) {
      this._textBoxBlacksmith.text = this._text[this._countText];
      this._textBoxBlacksmith.setVisible(true);
      if (this._keySpace.isDown && this._actualTime + 500 < time) {
        this._countText++;
        this._textBoxBlacksmith.setVisible(false);
        this._textControll = true;
        this._actualTime = 0;
      }
    } else if (this._countText > 4) {
      this._textBoxBlacksmith.setVisible(false);
    }
    if (this._actualTime == 0) {
      this._actualTime = time;
    }
    if(this._countText == 5) {
      this.scene.stop(this);  // Ferma la scena attuale
      const gameplay = this.scene.get("GamePlay") as any;
      gameplay.nextLevel(); 
    }
  }
}