import { IsString, IsEmail, IsOptional, IsObject } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  seller_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  category: string;

  @IsString()
  language: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsObject()
  submitted_fields?: Record<string, any>;
}

