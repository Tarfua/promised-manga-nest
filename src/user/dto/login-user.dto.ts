import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Лоґін не може бути порожнім' })
  @IsString({ message: 'Лоґін повинен бути рядком' })
  login: string;

  @IsNotEmpty({ message: 'Пароль не може бути порожнім' })
  @MinLength(8, { message: 'Пароль повинен бути не менше 8 символів' })
  @IsString({ message: 'Пароль повинен бути рядком' })
  password: string;
}
