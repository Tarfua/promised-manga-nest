import { Module } from '@nestjs/common';
import { MangaController } from './manga.controller';
import { MangaService } from './manga.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Manga, MangaSchema } from '../schemas/manga.schema';
import { TokenModule } from '../token/token.module';
import { MangaRating, MangaRatingSchema } from '../schemas/manga-rating.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
    MongooseModule.forFeature([
      { name: MangaRating.name, schema: MangaRatingSchema },
    ]),
    TokenModule,
  ],
  controllers: [MangaController],
  providers: [MangaService],
})
export class MangaModule {}
