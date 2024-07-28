import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserDto } from '../user/dto/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(UserDto)
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() user: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(user, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    return this.authService.logout(refreshToken, res);
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    return this.authService.refresh(refreshToken, res);
  }
}
