const openai = require("openai");

class ChatGpt {
  constructor() {
    this.client = new openai({
      api_key: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Create a new story using GPT core.
   *
   * @returns {Promise<{ title: string, tags: string[], description: string, story: string }>}
   */
  async createNewStory() {
    const chatCompletion = await this.client.chat.completions.create({
      messages: [
        {
          role: "user",
          content:
            process.env.PAYLOAD_CHATGPT +
              " ATTENTION: the report can only have a MAXIMUM of 1250 characters, and must be on a single line, without line breaks. I need you to return it to me as if it were a valid json, as I will use JSON.parse(), containing: title (title for the YouTube video about the story), tags (viral keywords for YouTube, at least 5), description (Brief description about the story) and story for a YouTube video, make this data eye-catching. IN LANGUAGE:" +
              process.env?.LANGUAGE_CHATGPT ?? "en",
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return JSON.parse(chatCompletion.choices[0].message.content);
  }
}

module.exports = ChatGpt;
