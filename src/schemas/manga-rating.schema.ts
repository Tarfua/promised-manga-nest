import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Manga } from './manga.schema';
import { User } from './user.schema';

export type MangaRatingDocument = MangaRating & Document;

@Schema()
export class MangaRating {
  @Prop({ type: Types.ObjectId, ref: Manga.name, required: true })
  mangaId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  rating: number;
}

export const MangaRatingSchema = SchemaFactory.createForClass(MangaRating);
