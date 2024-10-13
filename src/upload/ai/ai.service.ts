import { Injectable } from '@nestjs/common';

@Injectable()
export class AIService {
  async analyzeDocument(text: string): Promise<string> {
    return text;
  }
}
