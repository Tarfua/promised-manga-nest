import { Module } from '@nestjs/common';
import { MangaController } from './manga.controller';
import { MangaService } from './manga.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Manga, MangaSchema } from '../schemas/manga.schema';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
    TokenModule,
  ],
  controllers: [MangaController],
  providers: [MangaService],
})
export class MangaModule {}
