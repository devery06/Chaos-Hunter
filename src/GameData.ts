export let GameData: gameData = {
  globals: {
    gameWidth: 1280,
    gameHeight: 800,
    bgColor: "#f8f8ff",
    debug: true
  },

  preloader: {
    bgColor: "f8f8ff",
    image: "logoC",
    imageX: 1280 / 2,
    imageY: 800 / 2,
    loadingText: "loading...",
    loadingTextFont: "Bytesized",
    loadingTextComplete: "click to start!!",
    loadingTextY: 800,
    loadingBarColor: 0xff0000,
    loadingBarY: 730,
  },

  spritesheets: [

    //PLAYER 
    { name: "pg_lvl1", path: "assets/images/player/pg_lvl1-fix.png", width: 156, height: 156, frames: 72 },
    { name: "pg_lvl2", path: "assets/images/player/pg_lvl2.png", width: 148, height: 80, frames: 72 },
    { name: "pg_lvl3", path: "assets/images/player/pg_lvl3.png", width: 145, height: 75, frames: 72 },
    //ENEMY LVL 1
    //skeleton
    { name: "skeleton", path: "assets/images/lv1_forest/mob_skeleton/skeleton.png", width: 64, height: 64, frames: 65 },

    //goblin
    { name: "goblin_attack1", path: "assets/images/lv1_forest/mob_goblin/goblin_attack1.png", width: 150, height: 150, frames: 8 },
    { name: "goblin_attack2", path: "assets/images/lv1_forest/mob_goblin/goblin_attack2.png", width: 150, height: 150, frames: 8 },
    { name: "goblin_death", path: "assets/images/lv1_forest/mob_goblin/goblin_death.png", width: 150, height: 150, frames: 4 },
    { name: "goblin_hit", path: "assets/images/lv1_forest/mob_goblin/goblin_hit.png", width: 150, height: 150, frames: 4 },
    { name: "goblin_idle", path: "assets/images/lv1_forest/mob_goblin/goblin_idle.png", width: 150, height: 150, frames: 4 },
    { name: "goblin_walk", path: "assets/images/lv1_forest/mob_goblin/goblin_run.png", width: 150, height: 150, frames: 8 },
    
    //boss 1
    { name: "boss_lvl1-fix", path: "assets/images/lv1_forest/mob_boss/boss_lvl1-fix.png", width: 128, height: 136, frames: 65 },
    { name: "boss_lvl1", path: "assets/images/lv1_forest/mob_boss/boss_lvl1.png", width: 156, height: 156, frames: 65 },


    //ENEMY LVL 2
    //monster
    { name: "monster_attack1", path: "assets/images/lv2_foresta/lvl2_foresta/mob_monster/monster_attack1.png", width: 96, height: 96, frames: 6 },
    { name: "monster_attack2", path: "assets/images/lv2_foresta/lvl2_foresta/mob_monster/monster_attack2.png", width: 96, height: 96, frames: 6 },
    { name: "monster_attack3", path: "assets/images/lv2_foresta/lvl2_foresta/mob_monster/monster_attack3.png", width: 96, height: 96, frames: 6 },
    { name: "monster_death", path: "assets/images/lv2_foresta/lvl2_foresta/mob_monster/monster_death.png", width: 96, height: 96, frames: 6 },
    { name: "monster_hit", path: "assets/images/lv2_foresta/lvl2_foresta/mob_monster/monster_hit.png", width: 96, height: 96, frames: 4 },
    { name: "monster_idle", path: "assets/images/lv2_foresta/lvl2_foresta/mob_monster/monster_idle.png", width: 96, height: 96, frames: 4 },
    { name: "monster_walk", path: "assets/images/lv2_foresta/lvl2_foresta/mob_monster/monster_walk.png", width: 96, height: 96, frames: 6 },

    //gorgon
    { name: "gorgon_attack1", path: "assets/images/lv2_foresta/lvl2_foresta/mob_gorgon/gorgon_attack1.png", width: 128, height: 128, frames: 16 },
    { name: "gorgon_attack2", path: "assets/images/lv2_foresta/lvl2_foresta/mob_gorgon/gorgon_attack2.png", width: 128, height: 128, frames: 7 },
    { name: "gorgon_attack3", path: "assets/images/lv2_foresta/lvl2_foresta/mob_gorgon/gorgon_attack3.png", width: 128, height: 128, frames: 10 },
    { name: "gorgon_death", path: "assets/images/lv2_foresta/lvl2_foresta/mob_gorgon/gorgon_death.png", width: 128, height: 128, frames: 3 },
    { name: "gorgon_hit", path: "assets/images/lv2_foresta/lvl2_foresta/mob_gorgon/gorgon_hit.png", width: 128, height: 128, frames: 3 },
    { name: "gorgon_idle", path: "assets/images/lv2_foresta/lvl2_foresta/mob_gorgon/gorgon_idle.png", width: 128, height: 128, frames: 7 },
    { name: "gorgon_run", path: "assets/images/lv2_foresta/lvl2_foresta/mob_gorgon/gorgon_run.png", width: 128, height: 128, frames: 7 },
    { name: "gorgon_walk", path: "assets/images/lv2_foresta/lvl2_foresta/mob_gorgon/gorgon_walk.png", width: 128, height: 128, frames: 13 },

    //boss 2
    { name: "Caos_Archer", path: "assets/images/lv2_foresta/lvl2_foresta/mob_boss/Caos_Archer.png", width: 228, height: 128, frames: 374 }, 

    //ENEMY LVL 3
    //wizard
    { name: "wizard_attack1", path: "assets/images/lv3_castello/lvl3_castello/mob_wizard/wizard_attack1.png", width: 231, height: 190, frames: 8 },
    { name: "wizard_attack2", path: "assets/images/lv3_castello/lvl3_castello/mob_wizard/wizard_attack2.png", width: 231, height: 190, frames: 8 },
    { name: "wizard_death", path: "assets/images/lv3_castello/lvl3_castello/mob_wizard/wizard_death.png", width: 264, height: 190, frames: 7 },
    { name: "wizard_fall", path: "assets/images/lv3_castello/lvl3_castello/mob_wizard/wizard_fall.png", width: 924, height: 190, frames: 2 },
    { name: "wizard_jump", path: "assets/images/lv3_castello/lvl3_castello/mob_wizard/wizard_jump.png", width: 924, height: 190, frames: 2 },
    { name: "wizard_hit", path: "assets/images/lv3_castello/lvl3_castello/mob_wizard/wizard_hit.png", width: 462, height: 190, frames: 4 },
    { name: "wizard_idle", path: "assets/images/lv3_castello/lvl3_castello/mob_wizard/wizard_idle.png", width: 308, height: 190, frames: 6 },
    { name: "wizard_run", path: "assets/images/lv3_castello/lvl3_castello/mob_wizard/wizard_run.png", width: 231, height: 190, frames: 8 },

    //vampire
    { name: "vampire", path: "assets/images/lv3_castello/lvl3_castello/mob_vampire/vampire.png", width: 57, height: 128, frames: 72 },

    //Final_boss_P1 
    { name: "FinalBossP1", path: "assets/images/lv3_castello/lvl3_castello/mob_boss/FinalBossP1.png", width: 160, height: 128, frames: 119 },
    
    //Final_boss_P2
    { name: "FinalBossP2", path: "assets/images/lv3_castello/lvl3_castello/mob_boss/FinalBossP2.png", width: 228, height: 160, frames: 110 },

    //NPC
    { name: "barkeep", path: "assets/images/npc/barkeep.png", width: 34, height: 34, frames: 5 },
    { name: "barmaid", path: "assets/images/npc/barmaid.png", width: 34, height: 34, frames: 5 },
    { name: "fabbro", path: "assets/images/npc/fabbro.png", width: 34, height: 34, frames: 5 },
    { name: "villager_01", path: "assets/images/npc/villager_01.png", width: 34, height: 34, frames: 5 },
    { name: "villager_02", path: "assets/images/npc/villager_02.png", width: 34, height: 34, frames: 5 },
    { name: "blacksmith", path: "assets/images/npc/blacksmith.png", width: 96, height: 96, frames: 7 },

    //Keyboard icons
    { name: "destra", path: "assets/images/keyboard/destra.png", width: 14, height: 14, frames: 1 },
    { name: "sinistra", path: "assets/images/keyboard/sinistra.png", width: 14, height: 14, frames: 1 },
    { name: "sopra", path: "assets/images/keyboard/sopra.png", width: 16, height: 15, frames: 1 },
    { name: "sotto", path: "assets/images/keyboard/sotto.png", width: 14, height: 14, frames: 1 },
    { name: "X", path: "assets/images/keyboard/X.png", width: 14, height: 15, frames: 1 },
    { name: "L", path: "assets/images/keyboard/L.png", width: 14, height: 15, frames: 1 },
    { name: "P", path: "assets/images/keyboard/P.png", width: 14, height: 14, frames: 1 },
    { name: "spazio", path: "assets/images/keyboard/spazio.png", width: 50, height: 14, frames: 1 },
    { name: "icon", path: "assets/images/menu/icone.png", width: 64, height: 64, frames: 6 },



  ],
  images: [

    
    //logo e bg
    { name: "logoC", path: "assets/images/logo/logoC.jpeg" },
    { name: "bgC", path: "assets/images/menu/bgC.png" },
    { name: "villageBackground", path: "assets/images/village/villageBackground.png" },

    //textBox
    /*
    { name: "text1", path: "assets/images/textbox/text1.png" },
    { name: "text2", path: "assets/images/textbox/text2.png" },
    { name: "text3", path: "assets/images/textbox/text3.png" },
    { name: "text4", path: "assets/images/textbox/text4.png" },
     */

    //The Dawn
    { name: "1", path: "assets/images/The_Dawn/Layers/1.png" },
    { name: "2", path: "assets/images/The_Dawn/Layers/2.png" },
    { name: "3", path: "assets/images/The_Dawn/Layers/3.png" },
    { name: "4", path: "assets/images/The_Dawn/Layers/4.png" },
    { name: "5", path: "assets/images/The_Dawn/Layers/5.png" },
    { name: "6", path: "assets/images/The_Dawn/Layers/6.png" },
    { name: "7", path: "assets/images/The_Dawn/Layers/7.png" },
    { name: "8", path: "assets/images/The_Dawn/Layers/8.png" },

    //boss e player intro
    { name: "FinalBoss_intro", path: "assets/images/menu/FinalBoss_intro.png" },
    { name: "pg_intro", path: "assets/images/menu/pg_intro.png" },

    { name: "forest_background", path: "assets/images/lvl_forest/background.jpeg" },
    { name: "theDawn", path: "assets/images/The_Dawn/Reference-Image.png" },
    { name: "lvl1_forest", path: "assets/images/lv1_forest/backgronud/forest.png" },
    { name: "healthSword", path: "assets/images/hud/SpadaVita.png" },

  ],
  
  atlas: [{ key: "assets", imagepath: "assets/images/breakout.png", jsonpath: "assets/images/breakout.json"} ],
  
  sounds: [
    //menu
    {
      name: "themeMenu",
      paths: ["assets/sounds/menu/music menu.mp3"],
      },
      {
      name: "confirm",
      paths: ["assets/sounds/menu/sfx/confirm.wav"],
      },
      {
      name: "unequip",
      paths: ["assets/sounds/menu/sfx/unequip.wav"],
      },
      {
      name: "forest figlio",
      paths: ["assets/sounds/menu/music forest figlio.mp3"],
      },
      {
      name: "villaggio",
      paths: ["assets/sounds/menu/music villaggio.mp3"],
      },
      {
      name: "goblin_attack",
      paths: ["assets/sounds/menu/goblin_attack.mp3"],
      },
      {
            name: "goblin_death",
            paths: ["assets/sounds/menu/goblin_death.mp3"],
            },
            {
              name: "goblin_hit",
              paths: ["assets/sounds/menu/goblin_hit.mp3"],
              },
              {
                name: "goblin_walk",
                paths: ["assets/sounds/menu/goblin_walk.mp3"],
                },
                {
                  name: "skeleton_death",
                  paths: ["assets/sounds/menu/skeleton_death.mp3"],
                  },
                  {
                    name: "skeleton_hit",
                    paths: ["assets/sounds/menu/skeleton_hit.mp3"],
                    },
                    {
                      name: "skeleton_walk",
                      paths: ["assets/sounds/menu/skeleton_walk.mp3"],
                      },
    //GameOver
    {
    name: "game_over",
    paths: ["assets/sounds/gameOver/game_over.wav"],
    },
    {
    name: "get_up",
    paths: ["assets/sounds/gameOver/get_up.wav"],
    },
    {
    name: "come_back",
    paths: ["assets/sounds/gameOver/come_back.wav"],
    },

    //audio character
    {
      name: "footstep",
      paths: ["assets/sounds/personaggi/mainCharacter/footstep.wav"],
      },
      {
      name: "hurt",
      paths: ["assets/sounds/personaggi/mainCharacter/hurt.wav"],
      },
      {
      name: "footstepDirt2",
      paths: ["assets/sounds/Audio/footstepDirt2.wav"],
      },
      {
      name: "metalSwoosh1",
      paths: ["assets/sounds/Audio/metalSwoosh1.wav"],
      },
    
  ],

  videos: [

    // { name: "video", path: "/assets/video/video.mp4" },

  ],
  
  audios: [
    
    {
    name: "sfx",
    jsonpath: "assets/sounds/sfx/sfx.json",
    paths: ["assets/sounds/sfx/sfx.ogg", "assets/sounds/sfx/sfx.m4a"],
    instance: {instance: 10}
    }
    
  ],

  scripts: [],
  fonts: [{key:"ralewayRegular", path:"assets/fonts/raleway.regular.ttf",type:"truetype"},
    {key:"MaleVolentz", path:"assets/fonts/Malevolentz.regular.ttf",type:"truetype"}
  ],
  webfonts: [ { key: 'Nosifer' }, { key: 'Roboto' }, { key: 'Press+Start+2P' }, { key: 'Rubik+Doodle+Shadow' }, { key: 'Rubik+Glitch' },
              { key: 'Bytesized' }
  ],
  
  bitmapfonts: [],
};
