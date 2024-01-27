import { Controller, Post, Body, Res } from '@nestjs/common';
import { TextToSpeechService } from './text-to-speech.service';
import { Response } from 'express';
import { ChatService } from './gpt.service';

@Controller('text-to-speech')
export class TextToSpeechController {
    constructor(
        private readonly textToSpeechService: TextToSpeechService,
        private readonly chatService: ChatService,
    ) { }

    @Post('synthesize')
    async synthesize(@Body('text') text: string, @Res() res: Response) {
        try {
            const gptResponse = await this.chatService.chatWithGPT(text);

            const request = {
                input: { text: gptResponse },
                voice: {
                    languageCode: 'en-US',
                    name: 'en-US-Wavenet-F',
                    ssmlGender: 'FEMALE',
                },
                audioConfig: { audioEncoding: 'MP3' },
            };

            const audioContent = await this.textToSpeechService.synthesizeSpeech(request);
            res.setHeader('Content-Type', 'audio/mpeg');
            res.end(audioContent);
        } catch (e) {
            console.log("Error in GPT", e);
            res.status(500).send('An error ocurred while synthesizing speech.');
        }
    }
}