import { IsString, IsEmail, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  mainSalesPageLink?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  productsAndBrand?: string;

  @IsOptional()
  @IsArray()
  salesCategories?: string[];

  @IsOptional()
  @IsBoolean()
  imagesBelongToStore?: boolean;

  @IsOptional()
  @IsString()
  productType?: string;

  @IsOptional()
  @IsString()
  sellingDuration?: string;

  @IsOptional()
  @IsString()
  customerFeedback?: string;

  @IsOptional()
  @IsString()
  returnHandling?: string;

  @IsOptional()
  @IsString()
  fakeOrdersExperience?: string;

  @IsOptional()
  @IsString()
  shippingTime?: string;

  @IsOptional()
  @IsString()
  deliveryArea?: string;

  @IsOptional()
  @IsArray()
  badgeUsageLocations?: string[];
}

