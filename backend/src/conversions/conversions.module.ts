import { Module } from '@nestjs/common';
import { ConversionsService } from './conversions.service';
import { ConversionsController } from './conversions.controller';
import { PdfModule } from '../pdf/pdf.module';
import { XmlModule } from '../xml/xml.module';
import { UsersModule } from '../users/users.module'; 
import { ClerkGuard } from '../shared/guards/clerk.guard'; 

@Module({
  imports: [PdfModule, XmlModule, UsersModule], 
  controllers: [ConversionsController],
  providers: [ConversionsService, ClerkGuard],
  exports: [ConversionsService, ClerkGuard], 
})
export class ConversionsModule {}
