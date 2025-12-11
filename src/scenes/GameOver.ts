import { GameData } from "../GameData";

export default class GameOver extends Phaser.Scene {

  // Game Objects per il game over
  private _gameOver1: Phaser.GameObjects.Text;
  
  // Game Objects per il pulsante di riprova
  private _tryAgain: Phaser.GameObjects.Text;
  
  // Game Objects per il pulsante di ritorno al menu
  private _comeBack: Phaser.GameObjects.Text;

    // Game Objects per il pulsante di ritorno al villaggio
    private _backToVillage: Phaser.GameObjects.Text;
  
  // Game Objects per l'animazione del game over
  private _pgLvl1: Phaser.GameObjects.Sprite;
  
  // music game over
  private _musicGameOver: Phaser.Sound.BaseSound;
  
  // music get up
  private _musicGetUp: Phaser.Sound.BaseSound;
  
  //music come back
  private _musicComeBack: Phaser.Sound.BaseSound;
  private _musicBackVillage: Phaser.Sound.BaseSound;


  constructor() {
    super({
      key: "GameOver",
    });
  }


  create() {

    // setta il background di sfondo a nero
    this.cameras.main.setBackgroundColor('#000000');

    
    //music gameOver; getUp; comeBack
    this._musicGameOver = this.sound.add('game_over', { volume: .6, loop: true} );
    this._musicGetUp = this.sound.add('get_up', { volume: .6, loop: false} );
    this._musicComeBack = this.sound.add('come_back', { volume: .6, loop: false } );
    this._musicBackVillage = this.sound.add('footstep', { volume: .7, loop: true, rate: 0.25 } );
    
    //start music
    this._musicGameOver.play();


    // game over SCRITTA
    this._gameOver1 = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2, "GAME OVER" )
    .setOrigin(.5)
    .setFontSize(90)
    .setFontFamily('MaleVolentz')
    .setColor('#ff0000')
    .setStroke('#000000', 5)
    .setShadow(2, 2, "#333333", 2, true)
    .setDepth(1);
    
    //
    // animazioni game over
    //
    this.tweens.add({
      targets: [this._gameOver1],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 100,
    });
    
    //
    // play again
    //
    this._tryAgain = this.add.text(this.game.renderer.width / 2, this._gameOver1.y + 150, "TRY AGAIN?")
    .setOrigin(.5)
    .setFontSize(60)
    .setFontFamily('MaleVolentz')
    .setColor('#ff0000')
    .setStroke('#000000', 5)
    .setShadow(2, 2, "#333333", 2, true)
    .setDepth(1)
    .setInteractive()
    //
    // interazioni
    .on('pointerover', () => {
      
      this._tryAgain.setColor('#ffffff')
      .setFontSize(70);
      
    })
    .on('pointerout', () => {
      
      this._tryAgain.setColor('#ff0000')
      .setFontSize(60);
    
    })
    .on('pointerdown', () => {
      
      this._blockInput();
      this._tryAgainEffect();
        
    });

    //
    // back To Village
    //
    this._backToVillage = this.add.text(this.game.renderer.width / 2, this._tryAgain.y + 100, "BACK TO THE VILLAGE")
    .setOrigin(.5)
    .setFontSize(25)
    .setFontFamily('MaleVolentz')
    .setColor('#ff0000')
    .setStroke('#000000', 5)
    .setShadow(2, 2, "#333333", 2, true)
    .setDepth(1)
    .setInteractive()
    //
    // interazioni
    .on('pointerover', () => {

      this._backToVillage.setColor('#ffffff')
      .setFontSize(35);
      
    })
    .on('pointerout', () => {

      this._backToVillage.setColor('#ff0000')
      .setFontSize(25);
    
    })
    .on('pointerdown', () => {
      
      this._blockInput();
      this.backToVillage();
        
    });

    //
    // come back
    //
    this._comeBack = this.add.text(this.game.renderer.width / 2, this._backToVillage.y + 30, 'RETURN TO MENU')
    .setOrigin(.5)
    .setFontSize(25)
    .setFontFamily('MaleVolentz')
    .setColor('#ff0000')
    .setStroke('#000000', 5)
    .setShadow(2, 2, "#333333", 2, true)
    .setDepth(1)
    .setInteractive()
    //
    // interazioni
    .on('pointerover', () => {
      
      this._comeBack.setColor('#ffffff')
      .setFontSize(35);

    })
    .on('pointerout', () => {
      
      this._comeBack.setColor('#ff0000')
      .setFontSize(25);
    
    })
    .on('pointerdown', () => {

      this.scene.stop('Hud');
      this._blockInput();
      this._comeBackEffect();
    
    });
    
  }

  //ANIMAZIONI
  //
  // animazione game over
  //
  private _tryAgainEffect(): void {

    this._pgLvl1 = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2, 'pg_lvl1' )
    .setScale(4)
    .setDepth(1)
    .setOrigin(.5, .4)
    .setAlpha(1);

    this.anims.create({
      key: 'wake_up',
      frames: this.anims.generateFrameNumbers('pg_lvl1', { frames: [37, 36, 35, 34, 33, 32, 24, 16, 8 ] }),
      frameRate: 2.85,
      repeat: 0,
    });
    this.anims.play('wake_up', this._pgLvl1);
    
    //music
    this._musicGameOver.stop();
    this._musicGetUp.play();

    this._pgLvl1.on('animationcomplete', () => {
      this._pgLvl1.destroy();
      this._musicGetUp.stop();
      this.scene.stop(this);
      this.scene.start("GamePlay");
      this.scene.start("Hud");
      this.scene.bringToTop("Hud");
    });

  }
  //ANIMAZIONI
  //
  // animazione ritorno al villaggio
  //
private backToVillage(): void {
    
    this._pgLvl1 = this.add.sprite(0, this.game.renderer.height / 2, 'pg_lvl1')
      .setScale(4)
      .setDepth(1)
      .setOrigin(0.5, 0.5)
      .setAlpha(1);

    this.anims.create({
      key: 'return_village',
      frames: this.anims.generateFrameNumbers('pg_lvl1', { start: 56, end: 63 }),
      frameRate: 8,
      repeat: -1,
    });

    this._musicBackVillage.play();
    this._musicGameOver.stop();

    this._pgLvl1.play('return_village');

    this.tweens.add({
      targets: this._pgLvl1,
      x: this.game.renderer.width + this._pgLvl1.width,
      duration: 4000,
      ease: 'Linear',
      onComplete: () => {
        
        this._musicBackVillage.stop();
        this._pgLvl1.destroy();
    
        this.scene.stop(this);
        this.scene.stop('GamePlay');
        this.scene.start('Village');
      
      }
    });

  }

  //
  // animazione di ritorno al menu
  //
  private _comeBackEffect(): void {

    this._musicComeBack.play();
    this._musicGameOver.stop();

    this._pgLvl1 = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2, 'pg_lvl1' )
    .setScale(4)
    .setTintFill(0xff0000)
    .setDepth(1)
    .setOrigin(.5, .4)
    .setAlpha(1);

    this.anims.create({
      key: 'death',
      frames: this.anims.generateFrameNumbers ('pg_lvl1', { start: 32, end: 37 }),
      frameRate: 2.85,
      repeat: 0,
      yoyo: false,
      hideOnComplete: false
    });

    this.tweens.add({
      
      targets: [this._pgLvl1],
      alpha: 0,
      duration: 2000,
      ease: 'easeInOut',
      repeat: 0,
      yoyo: false,
      onStart: () => {
        this._pgLvl1.play('death');
      }

    })

    .on('complete', () => {
      this._pgLvl1.destroy();
      this._musicComeBack.stop();
      this.scene.stop(this);
      this.scene.stop('GamePlay');
      this.scene.start('Intro');
    });

  }

  //
  //block input
  private _blockInput(): void {
    this.input.enabled = false;
    this.time.delayedCall(1500, () => {
      this.input.enabled = true;
    });
  }

  update(time: number, delta: number): void { }

}