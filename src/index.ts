//importiamo la libreria phaser
import "phaser";
//importiamo le nostre scene
import Boot from "./scenes/Boot";
import Hud from "./scenes/Hud";
import Preloader from "./scenes/Preloader";
import GamePlay from "./scenes/GamePlay";
import GameOver from "./scenes/GameOver";
import Intro from "./scenes/Intro";
import Village from "./scenes/Village";
import Forest from "./scenes/Forest";
import PausedScene from "./scenes/Paused";
import Level1 from "./scenes/Level1";
import Arcade from "./scenes/Arcade";

//importiamo GameData che contiene i valori globali del gioco
import { GameData } from "./GameData";

//il listener per l'evento load della pagina
//questo evento viene lanciato quando la pagina è stata caricata
//e tutti gli elementi della pagina sono disponibili
window.addEventListener("load", () => {

  // Questo codice disabilita i warning e gli errori del browser per
  // tenere la console pulita per la demo.
  // (Commenta queste righe se devi fare debugging!)
  console.warn = () => {};
  console.error = () => {};

 const headerStyle = [
    'background: linear-gradient(to right, #b92b27, #1565c0)',
    'color: white',
    'padding: 10px 20px',
    'font-size: 18px',
    'font-weight: bold',
    'border-radius: 5px',
    'text-shadow: 1px 1px 2px black',
    'margin-bottom: 5px' // Spazio sotto il titolo
].join(';');

// Stile CORPO
const bodyStyle = [
    'color: #a8ff78',
    'font-size: 14px',
    'line-height: 1.8',
    'font-family: monospace',
    'font-weight: bold'
].join(';');

// Stile COPYRIGHT
const legalStyle = [
    'color: #ff9966',
    'font-size: 13px',
    'line-height: 1.6',
    'font-family: monospace'
].join(';');


// STAMPA DEI MESSAGGI
console.log('%c 🛡️ CHAOS HUNTER - DEMO 2025 🛡️', headerStyle);
console.log(
    '%c' +
    'Developed by IIS Mattei Eboli\n' +
    '------------------------------------------------\n' +
    '• Coding:   Vito Daniele Di Michele, Francesco Iannarella, Andrea Pandolfi, Mario Morelli\n' +
    '• 2D Art:   Francesco Mazzeo, Marco Polisciano\n' +
    '• Supervisione: Prof. Fabio Naponiello & Simone Fasulo\n' +
    '• Partecipazione: Phaser Game Jam 2025',
    bodyStyle
);
console.log(
    '%c ==========================================================\n' +
    'CHAOS HUNTER - CREDITS & LICENSES\n' +
    '--- COPYRIGHT ---\n' +
    'Questo videogioco è un\'opera originale realizzata dagli studenti\n' +
    'dell\'Istituto Tecnico Superiore IIS Mattei Eboli.\n' +
    '\n' +
    'Il codice sorgente e i modelli 2D originali sono © 2025 degli\n' +
    'autori sopra citati. Tutti i diritti riservati.\n' +
    '\n' +
    'È vietata la riproduzione, distribuzione o utilizzo non autorizzato\n' +
    'di qualsiasi parte di questo videogioco senza il permesso degli autori.\n' +
    '\n' +
    'Per ogni uso commerciale o pubblico o per comunicazioni, contattare:\n' +
    'dmvitodaniele06@gmail.com', 
    legalStyle
);

  //creiamo un oggetto di configurazione per il gioco
  //questo oggetto viene passato al costruttore di Phaser.Game
  // e contiene i parametri di configurazione del gioco
  // come il tipo di rendering, le dimensioni del canvas, le scene, ecc.
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    backgroundColor: GameData.globals.bgColor,
    parent: "my-game",
    scale: {
      mode: Phaser.Scale.FIT,
      width: GameData.globals.gameWidth,
      height: GameData.globals.gameHeight,
    },

    scene: [
      Boot,
      Hud,
      Preloader,
      Intro,
      GamePlay,
      GameOver,
      Village,
      Forest,
      PausedScene,
      Level1,
      Arcade
    ],
    physics: {
      default: "arcade",
      arcade: {
        debug: GameData.globals.debug,
        }
    },

    input: {
      activePointers: 2,
      keyboard: true,
    },
    render: {
      pixelArt: false,
      antialias: true,
    },
  };

  //inizializziamo il gioco passando la configurazione
  const game = new Phaser.Game(config);

});
