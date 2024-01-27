import { Injectable } from "@nestjs/common";
import OpenAI from 'openai';


@Injectable()
export class ChatService {
    private openai: OpenAI;
    private conversationHistory: {
        role: type RoleType = "function" | "user" | "system" | "assistant";
        content: string;
    }[] = [];
    contructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPEANAI_API_KEY,
        });
    }

    async chatWithGPT(content: string) {
        this.conversationHistory.push({
            role: "user",
            content: "",
        });
        const chatCompletition = await this.openai.chat.completions.create({
            messages: [
                {role: "system", content: "you are a helpful assistant"},
                ...this.conversationHistory
            ],
            model: "gpt-3.5-turbo",
        });

        this.conversationHistory.push({
            role: "assistant",
            content: chatCompletition.choices[0].message.content,
        });

        return chatCompletition.choices[0].message.content;
    }
}