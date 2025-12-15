import Phaser from "phaser";

export default class Hud extends Phaser.Scene {
  private maxHealth: number = 100;
  private currentHealth: number = 100;
  
  // UI Elements
  private _healthBackground: Phaser.GameObjects.Image;
  private _healthBar: Phaser.GameObjects.Graphics;
  
  // Text Box Elements
  private _textBoxContainer: Phaser.GameObjects.Container;
  private _textBoxText: Phaser.GameObjects.Text;
  private _textBoxBg: Phaser.GameObjects.Image;

  constructor() {
    super({ key: "Hud" });
  }

  create() {
    // 1. Setup Health Bar
    this.currentHealth = 100;
    this._healthBackground = this.add.image(0, -61, "healthSword").setOrigin(0).setScale(0.8);
    // Nota: "healthSword" è l'immagine di sfondo, posizionala dove preferisci. 
    // Qui ho messo coordinate fisse per esempio, adatta ai tuoi assets.
    
    this._healthBar = this.add.graphics();
    this.drawHealthBar();

    // 2. Setup Text Box (Nascosta all'inizio)
    this.createTextBox();

    // 3. Listener Eventi
    this.setupListeners();

    // 4. Recupero Passivo (Opzionale)
    this.time.addEvent({
      delay: 5000,
      callback: () => this.updateHealthBar(2),
      loop: true
    });
  }

  // --- HEALTH SYSTEM ---

  setupListeners() {
    const gameplay = this.scene.get("GamePlay");
    const level1 = this.scene.get("Level1"); // Ascolta anche Level1 direttamente se serve

    // Rimuovo vecchi listener per sicurezza
    this.events.off("shutdown");
    if(gameplay) gameplay.events.off("update_health");
    if(level1) level1.events.off("update_health");

    // Aggiungo listener
    if (gameplay) {
        gameplay.events.on("update_health", this.updateHealthBar, this);
    }
    // IMPORTANTE: Ascoltiamo Level1 perché è lì che viene emesso l'evento ora
    if (level1) {
        level1.events.on("update_health", this.updateHealthBar, this);
        level1.events.on("show_dialog", this.showDialog, this); // Nuova feature
    }

    // Pulizia quando la scena Hud viene chiusa
    this.events.on("shutdown", () => {
        if (gameplay) gameplay.events.off("update_health", this.updateHealthBar, this);
        if (level1) {
            level1.events.off("update_health", this.updateHealthBar, this);
            level1.events.off("show_dialog", this.showDialog, this);
        }
    });
  }

  updateHealthBar(amount: number) {
    this.currentHealth += amount;

    // Clamp values
    if (this.currentHealth > this.maxHealth) this.currentHealth = this.maxHealth;
    if (this.currentHealth <= 0) {
        this.currentHealth = 0;
        this.events.emit("death"); // Comunica a Level1 che siamo morti
    }

    this.drawHealthBar();
  }

  drawHealthBar() {
    this._healthBar.clear();
    
    // Configurazione Barra (Adatta queste coordinate allo sprite 'healthSword')
    const x = 120; // Offset X rispetto allo schermo
    const y = 80;  // Offset Y
    const fullWidth = 166;
    const height = 18;
    
    // Sfondo barra vuota (grigio scuro)
    this._healthBar.fillStyle(0x000000, 0.5);
    this._healthBar.fillRect(x, y, fullWidth, height);

    // Barra vita attuale (Rossa o Verde)
    const percentage = this.currentHealth / this.maxHealth;
    const width = fullWidth * percentage;

    if (width > 0) {
        // Cambia colore se vita bassa
        const color = percentage < 0.3 ? 0xff0000 : 0xbac6d4; 
        this._healthBar.fillStyle(color, 1);
        this._healthBar.fillRect(x, y, width, height);
    }
  }

  // --- TEXT BOX SYSTEM ---

  createTextBox() {
      // Sfondo semitrasparente o immagine
      this._textBoxBg = this.add.image(0, 0, "textBoxBackground"); 
      // Fallback se non hai l'immagine caricata, usa un rettangolo:
      // const bg = this.add.rectangle(0, 0, 400, 100, 0x000000, 0.7);
      
      this._textBoxText = this.add.text(0, 0, "", {
          fontFamily: "MaleVolentz", fontSize: "20px", color: "#ffffff", align: "center",
          wordWrap: { width: 350 }
      }).setOrigin(0.5);

      this._textBoxContainer = this.add.container(this.scale.width / 2, this.scale.height - 100, [this._textBoxBg, this._textBoxText]);
      this._textBoxContainer.setVisible(false);
      this._textBoxContainer.setAlpha(0);
  }

  // Chiamabile da Level1 con: this.events.emit("show_dialog", "Testo", 3000);
  showDialog(text: string, duration: number = 3000) {
      this._textBoxText.setText(text);
      this._textBoxContainer.setVisible(true);
      
      // Fade In
      this.tweens.add({
          targets: this._textBoxContainer,
          alpha: 1,
          duration: 300
      });

      // Auto Hide
      if (duration > 0) {
          this.time.delayedCall(duration, () => {
              this.hideDialog();
          });
      }
  }

  hideDialog() {
      this.tweens.add({
          targets: this._textBoxContainer,
          alpha: 0,
          duration: 300,
          onComplete: () => {
              this._textBoxContainer.setVisible(false);
          }
      });
  }
}