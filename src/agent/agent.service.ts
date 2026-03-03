import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AgentService {

  async getRecommendation(interest: string, skill: string, goal: string) {

    const prompt = `
You are a professional learning recommendation AI agent.

Output STRICTLY valid JSON.

Do not include:
- Markdown
- Explanation text
- Code fences
- Backticks
- Narration

Return response in this format:

{
 "recommended_path":"",
 "reason":"",
 "next_steps":[],
 "confidence_score":0
}

User Data:
Interest: ${interest}
Skill Level: ${skill}
Goal: ${goal}
`;

    try {

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',

          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],

          temperature: 0.7,

          response_format: {
            type: "json_object"
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;

      return this.safeParseJSON(content);

    } catch (error) {
      console.error('Agent Service Error:', error);
      throw new InternalServerErrorException('Recommendation agent failed');
    }
  }

  /**
   * Safe JSON parser for LLM output
   */
  private safeParseJSON(text: string) {

    try {
      return JSON.parse(text);
    } catch {

      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleaned);
    }
  }
}