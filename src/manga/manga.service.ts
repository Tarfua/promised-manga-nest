import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Manga } from '../schemas/manga.schema';
import { Model, Types } from 'mongoose';
import { CreateMangaDto } from './dto/create-manga.dto';
import slugify from 'slugify';
import { MangaRating } from '../schemas/manga-rating.schema';

@Injectable()
export class MangaService {
  constructor(
    @InjectModel(Manga.name)
    private readonly mangaModel: Model<Manga>,

    @InjectModel(MangaRating.name)
    private readonly mangaRatingModel: Model<MangaRating>,
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

  async updateCover(slug: string, coverUrl: string) {
    const updatedManga = await this.mangaModel.findOneAndUpdate(
      { slug },
      { cover: coverUrl },
      { new: true },
    );

    if (!updatedManga) {
      throw new NotFoundException('Манґу не знайдено');
    }

    return updatedManga;
  }

  async updateRating(slug: string, userId: Types.ObjectId, newRating: number) {
    const manga = await this.mangaModel.findOne({ slug });
    if (!manga) {
      throw new NotFoundException('Манґу не знайдено');
    }

    const mangaRating = await this.mangaRatingModel.findOne({
      mangaId: manga._id,
      userId,
    });

    if (!mangaRating) {
      // Користувач ще не ставив оцінку, додаємо нову оцінку
      const newMangaRating = new this.mangaRatingModel({
        mangaId: manga._id,
        userId,
        rating: newRating,
      });
      await newMangaRating.save();

      manga.averageRating =
        (manga.averageRating * manga.ratingCount + newRating) /
        (manga.ratingCount + 1);
      manga.ratingCount++;
    } else {
      // Користувач вже поставив оцінку, оновлюємо її
      const oldRating = mangaRating.rating;
      mangaRating.rating = newRating;
      await mangaRating.save();

      manga.averageRating =
        (manga.averageRating * manga.ratingCount - oldRating + newRating) /
        manga.ratingCount;
    }

    await manga.save();

    return manga;
  }
}
