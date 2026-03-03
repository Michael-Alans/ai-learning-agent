import { Controller, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('recommend')
  async recommend(@Body() body: any) {
    const { interest, skill, goal } = body;

    return this.agentService.getRecommendation(interest, skill, goal);
  }
}