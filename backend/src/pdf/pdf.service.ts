import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import * as https from 'https';
import * as http from 'http';

@Injectable()
export class PdfService {
  async extractText(pdfUrl: string): Promise<string> {
    try {
      // Download PDF from URL
      const pdfBuffer = await this.downloadFile(pdfUrl);
      
      // Extract text from PDF
      const data = await pdfParse(pdfBuffer);
      
      return data.text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private async downloadFile(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      
      client.get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          if (response.headers.location) {
            return this.downloadFile(response.headers.location)
              .then(resolve)
              .catch(reject);
          } else {
            return reject(new Error('Redirect location is undefined'));
          }
        }
        
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to download file: ${response.statusCode}`));
        }
        
        const chunks: Buffer[] = [];
        
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      }).on('error', reject);
    });
  }
}