import Phaser from 'phaser';

export default class PausedScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Paused' });
    }

    create() {
        // Add a semi-transparent background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);

        // Add a "Paused" text e button
        const pauseText: Phaser.GameObjects.Text = 
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 150, 'PAUSED')
        .setOrigin(0.5)
        .setTintFill(0xffffff)
        .setFontSize(140)
        .setDepth(4)
        .setFontFamily('MaleVolentz');

        const pausedIcon = this.add
        .sprite(this.scale.width / 2, this.scale.height / 2 + 40, 'icon', 2)
        .setOrigin(0.5)
        .setScale(4)
        .setInteractive()
        .on('pointerover', () => {
            pausedIcon.setTint(0x00aaff); // Change the tint to a blue color when hovered
        })
        .on('pointerout', () => {
            pausedIcon.clearTint();
        })
        .on('pointerdown', () => {

            pausedIcon.setFrame(3);
                this.time.delayedCall(50, () => {
                    this.scene.stop(this); // Stop the paused scene
                    this.scene.resume('GamePlay'); // Resume the gameplay scene
                });

        })

        

        // Resume the game when the button is clicked
        // Add keyboard input for the "P" key
        const pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        // Resume the game when the "P" key is pressed
        pKey.on('down', () => {
            pausedIcon.setFrame(3)
            
            // queste due funzioni le richiamiamo con un ritardo di 500 millisecondi
            this.time.delayedCall(50, () => {
                
                this.scene.stop(this); // Stop the paused scene
                this.scene.resume('GamePlay'); // Resume the gameplay scene
            
            });
            
        
        });
    }
}