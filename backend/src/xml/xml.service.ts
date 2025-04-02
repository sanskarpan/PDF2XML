import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

@Injectable()
export class XmlService {
  generateXml(text: string): string {
    try {
      // Split text into paragraphs
      const paragraphs = text
        .split('\n\n')
        .map((p) => p.trim())
        .filter((p) => p);
      
      // Create XML structure
      const xmlObj = {
        document: {
          $: { version: '1.0' },
          section: [
            {
              paragraph: paragraphs.map((p) => ({
                text: p,
              })),
            },
          ],
        },
      };
      
      // Convert object to XML
      const builder = new xml2js.Builder({
        rootName: 'document',
        headless: true,
        renderOpts: { pretty: true, indent: '  ' },
      });
      
      return builder.buildObject(xmlObj);
    } catch (error) {
      console.error('Error generating XML:', error);
      throw new Error('Failed to generate XML');
    }
  }
}