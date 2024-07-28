import { IsNotEmpty, IsString } from 'class-validator';

export class PayloadDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
