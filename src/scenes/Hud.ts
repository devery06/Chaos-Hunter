import Level1 from "./Level1";

export default class Hud extends Phaser.Scene {
  private maxHealth: number = 100;
  private currentHealth: number = 100;
  private _healthBackground: Phaser.GameObjects.Image;
  private _healthBar: Phaser.GameObjects.Graphics;
  private _level1: Level1;
  private _textBox: Phaser.GameObjects.Container;
  private _textBoxTrigger: boolean;
  private _text1: Phaser.GameObjects.Text;

  
  constructor() {
    super({
      key: "Hud",
    });
  }
  
  updateHealthBar(amount: any): void {
    // Cancella la barra precedente
    this._healthBar.clear();
    this.currentHealth += amount;
    if (this.currentHealth < 0) {
      this.currentHealth = 0;
      
      this.events.emit("death");
    } else if (this.currentHealth > this.maxHealth) this.currentHealth = this.maxHealth;
    // Calcola la lunghezza della barra della vita in base alla salute attuale
    const barWidth = 208; // Larghezza massima della barra
    const barHeight = 21; // Altezza della barra
    const healthWidth = (this.currentHealth / this.maxHealth) * barWidth;

    // Disegna la barra della vita sopra l'immagine
    this._healthBar.fillStyle(0xbac6d4); // Colore rosso per la vita
    this._healthBar.fillRect(
      123, // Posizione X
      30, // Posizione Y
      healthWidth, // Larghezza in base alla salute
      barHeight // Altezza
    );
  }

  create() {
    //Barra della vita
    this.currentHealth = 100;
    this._healthBackground = this.add.image(550, 270, "healthSword");
    this._healthBackground.setOrigin(0.5, 0.5); // Centra l'immagine
      // Crea la barra della vita come grafica
    this._healthBar = this.add.graphics();
    const gameplayScene = this.scene.get("GamePlay");
    if (gameplayScene) {
      gameplayScene.events.on("update_health", this.updateHealthBar, this);
    }

    //Recupero passivo punti vita
    this.time.addEvent({
      delay: 5000, // 5000ms = 5 secondi
      callback: this.updateHealthBar, //chiama la funzione updateHealthBar
      callbackScope: this,
      args: [2], //parametri
      loop: true // Ripeti l'evento all'infinito
    });

    //Textbox
    this.registry.set("textBoxTrigger", false);
    this._textBoxTrigger = this.registry.get("textBoxTrigger");
    this.updateHealthBar(0);

    // Textbox
    const textBoxBackground = this.add.image(0, 0, "textBoxBackground").setOrigin(0.5, 0.5);
    const textBoxText = this.add.text(0, 0, "Questo è un messaggio!", {
      fontSize: "16px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: 200 },
    }).setOrigin(0.5, 0.5);
    this._textBox = this.add.container(550, 270, [textBoxBackground, textBoxText]);
    this._textBox.setVisible(false);
  }

  onLevel1Ready() {
    // Ora che Level1 è pronto, posso prendere il riferimento e collegarmi agli eventi
    this._level1 = this.scene.get("Level1") as Level1;

    if (this._level1) {
      // Disconnetto vecchi listener (sicurezza)
      this._level1.events.off("update_health", this.updateHealthBar, this);

      // Connetto al nuovo listener di aggiornamento salute
      this._level1.events.on("update_health", this.updateHealthBar, this);
    }
  }

  update(time: number, delta: number): void {
    this._textBox.setVisible(this._textBoxTrigger);
  }

}