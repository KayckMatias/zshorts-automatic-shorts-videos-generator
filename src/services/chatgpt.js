const openai = require("openai");

class ChatGpt {
  constructor() {
    this.client = new openai({
      api_key: process.env.OPENAI_API_KEY,
    });
  }

  async createNewStory() {
    const chatCompletion = await this.client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: process.env.PAYLOAD_CHATGPT + ' ATENÇÃO: o relato só pode ter no MÁXIMO 1250 caractéres, e precisa estar em linha única, sem quebra de linha. preciso que voce me retorne como se fosse um json válido, pois vou utilizar o JSON.parse(), contendo: title (titulo para o vídeo no youtube sobre a história), tags (keywords virais para o youtube, no minimo 5), description (Breve descrição sobre a história) and story para um video no youtube, faça esses dados chamativos.'
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return JSON.parse(chatCompletion.choices[0].message.content);
  }
}

module.exports = ChatGpt;
