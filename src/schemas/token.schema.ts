import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  expiresAt: Date;
}
export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
