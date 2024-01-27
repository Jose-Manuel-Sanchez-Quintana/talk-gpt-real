import { Controller, Post, Body } from "@nestjs/common";
import { ChatService } from "./gpt.service";

@Controller("chat")
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('talk')
    async talkToGPT(@Body('content') content: string){
        return this.chatService.chatWithGPT(content);
    }
}