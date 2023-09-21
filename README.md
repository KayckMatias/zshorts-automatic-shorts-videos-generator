# zshorts
A automatic shorts videos generator for youtube, tiktok and more...

## Requirements
- [x] FFmpeg
- [x] node
- [x] npm
- [x] build-essential packages (only if you are going to use subtitles, required by nodejs-whisper)

## Installation
- To install run in terminal:
```shell
npm i 
```
- Copy .env.example to .env
- Enjoy :D

## Configuration
First, <b>you need to populate the "```/static/videos```" folder with videos</b> that will be used as backgrounds for the generated shorts.
[(video example)](https://www.youtube.com/watch?v=Qu1am4A4Rqs)

This system works with two modes: ```manual story``` and ```auto-generated story from GPT```

<h4>Manual Story:</h4> 

Set ```STORY_BY_GPT``` to ```false``` in .env file

Copy "```/static/manual_story.json.default```" to "```/static/manual_story.json```" and populate

<h4>Auto-Generated Story from GPT:</h4> 

Turn ```true``` the ```STORY_BY_GPT``` and set your ```OPENAI_API_KEY``` in .env

You can customize the payload sended to ChatGPT generate the story in field ```PAYLOAD_CHATGPT``` on .env

You can change language in .env on ```LANGUAGE_CHATGPT``` variable.
<h4>Attention for "auto-generated story from GPT" mode</h4> 

```PAYLOAD_CHATGPT``` is a customizable payload, it is concatenated with another payload to generate the story in a standard way, if you want to change it, customize it in the file: "```/src/services/chatgpt.js```" however, it can cause problems in the system, be careful.

<h4>Attention for subtitle</h4> 

We are using whisper to generate automatic subtitles, [read more about the models (available and requirements) here](https://github.com/openai/whisper#available-models-and-languages)

## Usage
To use it is very simple, just after making the configuration run in your terminal:
```shell
npm run generate
```

<h4>Remember</h4>
If you are using ```manual story``` mode, you need populate the file "```/static/manual_story.json```" with the data you want for your story.

## Future Update:
- [x] Add automatic subtitle in video based in audio generated
- [ ] Add random categories and video filter based in category choiced (example, horror story: darkness filter to video)
- [ ] ~~Add a automatic upload to youtube~~ (canceled because YouTube blocks the video due to "suspicion of spam")

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information

<p align="center">Made with &hearts; by Kayck Matias</p>
