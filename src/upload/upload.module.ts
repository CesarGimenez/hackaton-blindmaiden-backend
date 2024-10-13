import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { AIService } from './ai/ai.service';
import { DocumentService } from './document/document.service';

@Module({
  controllers: [UploadController],
  providers: [AIService, DocumentService],
})
export class UploadModule {}
