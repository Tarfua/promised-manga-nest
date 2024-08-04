import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
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

  @Put(':slug/cover')
  @UseGuards(AuthGuard)
  async updateCover(
    @Param('slug') slug: string,
    @Body() body: { coverUrl: string },
  ) {
    return this.mangaService.updateCover(slug, body.coverUrl);
  }

  @Put(':slug/rating')
  @UseGuards(AuthGuard)
  async updateRating(
    @Param('slug') slug: string,
    @Body() body: { rating: number },
    @Req() req: Request,
  ) {
    const user = req['user'];

    return this.mangaService.updateRating(slug, user.id, body.rating);
  }
}
