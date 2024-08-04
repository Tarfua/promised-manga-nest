import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class PayloadDto {
  @IsNotEmpty()
  id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
