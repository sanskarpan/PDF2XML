import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Conversion } from '@prisma//client';
import { PdfService } from '../pdf//pdf.service';
import { XmlService } from '../xml//xml.service';

@Injectable()
export class ConversionsService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
    private xmlService: XmlService,
  ) {}

  async create(
    userId: string,
    originalName: string,
    fileUrl: string,
  ): Promise<Conversion> {
    return this.prisma.conversion.create({
      data: {
        userId,
        originalName,
        fileUrl,
      },
    });
  }

  async findAll(userId: string): Promise<Conversion[]> {
    return this.prisma.conversion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Conversion | null> {
    return this.prisma.conversion.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async processConversion(id: string): Promise<Conversion> {
    // Update status to processing
    await this.prisma.conversion.update({
      where: { id },
      data: { status: 'processing' },
    });

    try {
      // Get conversion
      const conversion = await this.prisma.conversion.findUnique({
        where: { id },
      });

      if (!conversion) {
        throw new Error('Conversion not found');
      }

      // Extract text from PDF
      const pdfText = await this.pdfService.extractText(conversion.fileUrl);
      
      // Convert text to XML
      const xmlOutput = this.xmlService.generateXml(pdfText);

      // Update conversion with XML output
      return this.prisma.conversion.update({
        where: { id },
        data: {
          xmlOutput,
          status: 'completed',
        },
      });
    } catch (error) {
      // Update status to failed
      return this.prisma.conversion.update({
        where: { id },
        data: { status: 'failed' },
      });
    }
  }
}