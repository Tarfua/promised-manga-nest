import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Manga } from '../schemas/manga.schema';
import { Model } from 'mongoose';
import { CreateMangaDto } from './dto/create-manga.dto';
import slugify from 'slugify';

@Injectable()
export class MangaService {
  constructor(
    @InjectModel(Manga.name) private readonly mangaModel: Model<Manga>,
  ) {}

  async getMangaBySlug(slug: string) {
    const manga = await this.mangaModel.findOne({ slug });

    if (!manga) {
      throw new NotFoundException('Манґу не знайдено');
    }

    return manga;
  }

  async getMangas() {
    const mangas = await this.mangaModel.find({});

    if (!mangas) {
      throw new NotFoundException('Манґ не знайдено');
    }

    return mangas;
  }

  async getMangaDetails(slug: string) {
    const details = await this.mangaModel.findOne(
      { slug },
      { details: 1, _id: 0 },
    );

    if (!details) {
      throw new NotFoundException('Манґу не знайдено');
    }

    return details;
  }

  async createManga(manga: CreateMangaDto) {
    const slug = slugify(manga.titles.english, { lower: true });

    const existing = await this.mangaModel.findOne({ slug });
    if (existing) {
      throw new ConflictException('Така манґа вже існує');
    }

    const newManga = new this.mangaModel({
      ...manga,
      slug: slug,
    });

    return newManga.save();
  }
}
