import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document/document.service';
import { AIService } from './ai/ai.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly aiService: AIService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const extractedText = await this.documentService.extractText(file);

    const summary = await this.aiService.analyzeDocument(extractedText);

    return { aiMessage: summary };
  }
}
