import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class Titles {
  @Prop({ type: String, required: true })
  ukrainian: string;

  @Prop({ type: String, required: true })
  english: string;

  @Prop({ type: String, required: true })
  original: string;
}

@Schema()
class MangaDetails {
  @Prop({ type: String, required: true })
  mangaType: string;

  @Prop({ type: String, required: true })
  rating: string;

  @Prop({ type: String, required: true })
  year: number;

  @Prop({ type: [String], required: true })
  authors: string[];

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String })
  translationStatus: string;

  @Prop({ type: [String] })
  translators: string[];

  @Prop({ type: Date, default: () => Date.now() })
  lastUpdated: Date;
}

@Schema()
export class Manga {
  @Prop({ type: String, unique: true, required: true })
  slug: string;

  @Prop({ type: String })
  cover: string;

  @Prop({ type: Titles, required: true })
  titles: Titles;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: Number, default: 0 })
  ratingCount: number;

  @Prop({ type: Number, default: 0 })
  averageRating: number;

  @Prop({ type: MangaDetails, required: true })
  details: MangaDetails;
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
