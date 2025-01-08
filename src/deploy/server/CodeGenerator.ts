import { HttpError } from "wasp/server";
import OpenAI from 'openai';

class CodeGenerator {
    private strategyCode: string;
    private AI: OpenAI;

    constructor(code: string) {
        this.strategyCode = code;

        console.log('in constructor')

        if (!process.env.OPENAI_API_KEY) {
            throw new HttpError(500, 'Missing OpenAI API Key.');
        } else {
            this.AI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        }
    }

    public async generate(): Promise<string> {
        try {
            const fullPrompt = CodeGenerator.prompt(this.strategyCode);
                        const completion = await this.AI.chat.completions.create(fullPrompt);

            // Ensure completion data exists
            if (!completion || !completion.choices || completion.choices.length === 0) {
                throw new HttpError(500, 'Bad response from AI.');
            }

            // Extract and validate the generated Python code
            const generatedCode = completion.choices[0].message?.content?.trim();
            if (!generatedCode) {
                throw new HttpError(500, 'AI response is empty.');
            }

            this.validateAPIResult(generatedCode);

            return generatedCode;
        } catch (error) {
            console.error('Error generating code:', error);
            throw new HttpError(500, 'An error occurred during code generation.');
        }
    }

    private validateAPIResult(code: string): void {
        // Perform any static analysis, regex checks, or validation
        if (!code.includes('alpaca_trade_api')) {
            throw new HttpError(500, 'Generated code is missing required imports for Alpaca.');
        }

        // Additional validations can be added here
    }

    private static prompt(code: string): OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming {
        return {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert Python programmer specializing in trading algorithms. 
                    Your task is to transform Python trading strategies for live trading with Alpaca's API.`,
                },
                {
                    role: 'user',
                    content: `I have written a trading strategy in Python using the pandas library. 
                    It generates buy/sell signals: 1 means buy, -1 means short, and 0.5 means half buy. 
                    Here is the strategy code:\n${code}`,
                },
                {
                    role: 'user',
                    content: `Generate Python code for live paper trading with Alpaca's API. 
                    Only return Python code, without any additional text or explanations.`,
                },
            ],
            temperature: 1,
        };
    }
}

export default CodeGenerator;
