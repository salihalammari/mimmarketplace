import { IsString, IsEmail, IsOptional, IsObject, IsBoolean, IsArray } from 'class-validator';

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
  @IsString()
  selling_page?: string;

  @IsOptional()
  @IsString()
  secondary_selling_page?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  products_category?: string;

  @IsOptional()
  @IsString()
  other_products?: string;

  @IsOptional()
  @IsBoolean()
  valid_product?: boolean;

  @IsOptional()
  @IsString()
  products_type?: string;

  @IsOptional()
  @IsString()
  time_selling?: string;

  @IsOptional()
  @IsString()
  feedbacks?: string;

  @IsOptional()
  @IsString()
  return_policies?: string;

  @IsOptional()
  @IsString()
  fake_orders?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  badge_use?: string[];

  @IsOptional()
  @IsString()
  delivery_duration?: string;

  @IsOptional()
  @IsString()
  delivery_zone?: string;

  @IsOptional()
  @IsString()
  whatsapp_number?: string;

  @IsOptional()
  @IsString()
  instagram_handle?: string;

  @IsOptional()
  @IsString()
  facebook_handle?: string;

  @IsOptional()
  @IsString()
  tiktok_handle?: string;

  @IsOptional()
  @IsObject()
  submitted_fields?: Record<string, any>;
}

