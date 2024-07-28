import {
  IsString,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class TitlesDto {
  @IsString()
  @IsNotEmpty()
  ukrainian: string;

  @IsString()
  @IsNotEmpty()
  english: string;

  @IsString()
  @IsNotEmpty()
  original: string;
}

class MangaDetailsDto {
  @IsString()
  @IsNotEmpty()
  mangaType: string;

  @IsString()
  @IsNotEmpty()
  rating: string;

  @IsString()
  @IsNotEmpty()
  year: number;

  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsString()
  @IsNotEmpty()
  status: string;
}

export class CreateMangaDto {
  @IsString()
  @IsOptional()
  cover: string;

  @ValidateNested()
  @Type(() => TitlesDto)
  titles: TitlesDto;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];

  @ValidateNested()
  @Type(() => MangaDetailsDto)
  details: MangaDetailsDto;
}
