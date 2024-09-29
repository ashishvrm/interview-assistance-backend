import OpenAI from 'openai'; // Correct import for OpenAI package
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI API key here
});

export const getResponseFromGPT = async (prompt: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 100,
  });

  return response.choices[0].message.content;
};
