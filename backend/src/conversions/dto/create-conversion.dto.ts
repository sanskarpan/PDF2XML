import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateConversionDto {
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  fileUrl: string;
}