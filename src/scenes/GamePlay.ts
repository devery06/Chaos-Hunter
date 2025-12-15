import Phaser from 'phaser';

export default class GamePlay extends Phaser.Scene {
    private currentLevel: number = 1;

    constructor() {
        super({ key: "GamePlay" });
    }

    create() {
        // Appena GamePlay parte, lancia il primo livello
        this.loadLevel(this.currentLevel);
    }

    // Questa funzione viene chiamata dalle altre scene (Village, Level1, ecc.)
    public nextLevel() {
        this.currentLevel++;
        this.loadLevel(this.currentLevel);
    }

    private loadLevel(level: number) {
        console.log("Caricamento livello: " + level);
        
        // Ferma le scene precedenti se necessario
        this.scene.stop("Village");
        this.scene.stop("Forest");
        this.scene.stop("Level1");
        
        switch(level) {
            case 1: 
                this.scene.start("Village"); // Primo ingresso nel villaggio
            break;
            case 2:
                this.scene.start("Forest"); // Scopre che il figlio è morto
            break;
            case 3: 
            this.scene.start("Village"); // Parla con il fabbro e parte nella foresta
            break;
            case 4:
                this.scene.start("Level1"); // Va nella foresta ed uccide alcuni figli del chaos
                this.scene.launch("Hud");
                this.scene.bringToTop("Hud");
            break;
            case 5:
                this.scene.start("Village"); // Ritorno al villaggio
            break;
            case 6: 
                this.scene.start("Intro");
                this.currentLevel = 0; // Reset
                this.scene.stop("Hud");
                this.scene.stop(this);
            break;
        }
    }

    update(time: number, delta: number): void {
        // Non serve logica qui dentro per gestire i cambi scena
    }
}