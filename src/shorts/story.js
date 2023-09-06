const gTTS = require("gtts");
const path = require("path");

const Logger = require("../utils/logger");
const { randomUUID } = require("crypto");
const { PathResolve } = require("../utils/resolve");

const { overrideWithAcceleratedNarration } = require("../services/ffmpeg");

class Story {
  storyId;
  story;

  constructor() {
    this.storyId = randomUUID();
  }

  makeStory() {
    //AFTER MAKE A FUNCTION TO COLLECT HISTORY FROM CHAT GPT
    // this.story = `Em uma noite escura e tempestuosa, eu me encontrava sozinho em uma floresta densa e misteriosa. As árvores se erguiam imponentes ao meu redor, suas sombras se contorcendo como criaturas vivas, enquanto os rugidos do vento ecoavam sinistramente pelos corredores naturais da floresta. Eu sabia que estava em território desconhecido, mas havia algo que me impelia a continuar avançando.
    //     O som da chuva batendo nas folhas das árvores era ensurdecedor, mas eu continuava minha jornada, guiado apenas pela frágil luz da minha lanterna. Gotas de água fria escorriam pelo meu rosto, mas eu não podia parar. Algo me dizia que precisava seguir em frente.
    //     Foi então que comecei a perceber algo estranho. Sons inexplicáveis começaram a ecoar pela floresta. Sussurros indistintos, risadas macabras e ruídos que pareciam vir de todas as direções ao mesmo tempo. Minha pele arrepiou, e uma sensação de pavor tomou conta de mim. Mas ainda assim, eu persisti.
    //     À medida que avançava, as sombras pareciam se mover, ganhando vida própria. Passos invisíveis me seguindo, galhos se retorcendo como mãos a me alcançar, e olhos brilhantes que piscavam fugazmente na escuridão. Eu não sabia mais se estava sozinho naquela floresta sombria.
    //     Então, em um clarão repentino de relâmpago, eu o vi. Um vulto alto e esguio, com olhos que brilhavam como brasas ardentes. Ele se movia rapidamente entre as árvores, nunca me deixando vê-lo claramente. Era uma presença indescritivelmente aterrorizante, algo que não pertencia a este mundo.
    //     A coragem estava prestes a me abandonar quando, de repente, uma voz ecoou em minha mente. Era suave e acolhedora, como uma canção de ninar em meio ao caos. A voz me disse para não ter medo, que a floresta estava viva e que eu estava sendo testado.
    //     Com as palavras da voz me guiando, continuei minha jornada. As sombras recuaram, os sons sinistros se dissiparam e, finalmente, emergi da floresta sombria, ileso, mas profundamente transformado.
    //     A lição que aprendi naquela noite assombrosa foi que, às vezes, para encontrar a luz, é preciso enfrentar as trevas mais profundas. A floresta misteriosa me desafiou a superar o medo e a incerteza, e ao fazê-lo, descobri uma força dentro de mim que eu nunca soube que existia. Desde então, nunca mais olhei para as sombras com o mesmo temor, pois sei que, mesmo nos lugares mais sombrios, a esperança e a coragem podem brilhar intensamente.`;

    this.story = "teste";
    return this;
  }

  async buildStoryNarration() {
    const gtts = new gTTS(this.story, "pt-br");

    Logger.debug(`Narration from history "${this.storyId}" generated`);

    try {
      await this.#saveNarration(gtts);
      
      await overrideWithAcceleratedNarration(this.storyId);
    } catch (e) {
      Logger.error(e);
    }

    return this;
  }

  #saveNarration(narration) {
    const pathToSave = path.join(PathResolve.narrations, `${this.storyId}.mp3`);
    const storyId = this.storyId;

    return new Promise((resolve, reject) => {
      narration.save(pathToSave, function (err, result) {
        if (err) {
          reject(err);
        }
        Logger.debug(
          `Narration "${storyId}" saved in ${PathResolve.narrations}`
        );
        resolve(true);
      });
    });
  }
}

module.exports = Story;
