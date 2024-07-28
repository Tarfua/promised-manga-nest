import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MangaService } from './manga.service';
import { CreateMangaDto } from './dto/create-manga.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @Get(':slug')
  getManga(@Param('slug') slug: string) {
    return this.mangaService.getMangaBySlug(slug);
  }

  @Get(':slug/details')
  getMangaDetails(@Param('slug') slug: string) {
    return this.mangaService.getMangaDetails(slug);
  }

  @Get()
  getMangas() {
    return this.mangaService.getMangas();
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createManga(@Body() manga: CreateMangaDto) {
    return this.mangaService.createManga(manga);
  }
}
