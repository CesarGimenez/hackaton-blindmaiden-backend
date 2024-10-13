import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { readFileSync } from 'fs';

@Injectable()
export class DocumentService {
  async extractText(file: Express.Multer.File): Promise<string> {
    const fileType = file.mimetype;

    if (fileType === 'application/pdf') {
      // Procesar PDF
      const buffer = file.buffer;
      const data = await pdfParse(buffer);
      return data.text;
    } else if (
      fileType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // Procesar Word (DOCX)
      const buffer = file.buffer;
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else {
      throw new Error('Formato de archivo no soportado.');
    }
  }
}
