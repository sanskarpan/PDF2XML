import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    UseGuards,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { ConversionsService } from './conversions.service';
  import { Conversion } from '@prisma/client';
  import { ClerkGuard } from '../shared/guards/clerk.guard';
  import { GetUser } from '../shared/decorators/user.decorator';
  import { CreateConversionDto } from './dto/create-conversion.dto';
  
  @Controller('conversions')
  @UseGuards(ClerkGuard)
  export class ConversionsController {
    constructor(private readonly conversionsService: ConversionsService) {}
  
    @Post()
    async create(
      @GetUser('id') userId: string,
      @Body() createConversionDto: CreateConversionDto,
    ): Promise<Conversion> {
      const { originalName, fileUrl } = createConversionDto;
      
      // Create conversion record
      const conversion = await this.conversionsService.create(
        userId,
        originalName,
        fileUrl,
      );
      
      // Start processing in background
      this.conversionsService.processConversion(conversion.id).catch((error) => {
        console.error('Error processing conversion:', error);
      });
      
      return conversion;
    }
  
    @Get()
    async findAll(@GetUser('id') userId: string): Promise<Conversion[]> {
      return this.conversionsService.findAll(userId);
    }
  
    @Get(':id')
    async findOne(
      @Param('id') id: string,
      @GetUser('id') userId: string,
    ): Promise<Conversion> {
      const conversion = await this.conversionsService.findOne(id, userId);
      
      if (!conversion) {
        throw new NotFoundException('Conversion not found');
      }
      
      return conversion;
    }
  }