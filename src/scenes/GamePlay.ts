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
                this.scene.start("Village");
                // GamePlay rimane attiva in background
            break;
            case 2:
                this.scene.start("Forest");
            break;
            case 3:
                this.scene.start("Level1");
                this.scene.launch("Hud");
                this.scene.bringToTop("Hud");
            break;
            case 4:
                this.scene.start("Village"); // Ritorno al villaggio
            break;
            case 5: 
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