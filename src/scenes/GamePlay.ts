import Village from "./Village";

export default class GamePlay extends Phaser.Scene {
    private currentLevel: number = 1;
    private maxLevel: number = 5;
    create(){

    }

    nextLevel(){
        if (!this.scene.isActive("GamePlay")) {
            this.scene.launch("GamePlay");
        }

        const gameplayScene = this.scene.get("GamePlay");

        if (gameplayScene && typeof (gameplayScene as any).nextLevel === "function") {
            (gameplayScene as any).nextLevel();
        } else {
            console.error("❌ GamePlay.nextLevel non è accessibile: la scena non è correttamente istanziata");
            console.log("Tipo:", typeof gameplayScene);
            console.log("Oggetto:", gameplayScene);
        }
    }

    update(time: number, delta: number): void {
        console.log(this.currentLevel);
        switch(this.currentLevel) {
            case 1: 
                this.scene.stop(this);
                this.scene.start("Village");
            break;
            case 2:
                this.scene.stop(this);
                this.scene.start("Forest");
            break;
            case 3:
                this.scene.stop(this);
                this.scene.start("Level1");
            break;
            case 4:
                this.scene.stop(this);
                this.scene.start("Village");
            break;
            case 5: 
                this.scene.stop(this);
                this.scene.start("Intro");
                this.currentLevel = 0;
            break;
        }
    }
}