import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async signup(user: CreateUserDto) {
    return await this.userService.create(user);
  }

  async login(loginUser: LoginUserDto, res: Response) {
    const user = await this.userService.findByLogin(loginUser.login);

    if (!user) {
      throw new UnauthorizedException('Неправильний лоґін або пароль');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUser.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неправильний лоґін або пароль');
    }

    const tokens = this.tokenService.generateTokens({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken);

    this.setCookieRefreshToken(tokens.refreshToken, res);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(refreshToken: string, res: Response) {
    await this.tokenService.removeToken(refreshToken);
    this.clearCookies(res);
    return { message: 'Вихід виконано успішно' };
  }

  async refresh(refreshToken: string, res: Response) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('Користувач не авторизований');
      }

      const payload = this.tokenService.validateRefreshToken(refreshToken);
      const tokenFromDB = await this.tokenService.findToken(refreshToken);
      if (!payload || !tokenFromDB) {
        throw new UnauthorizedException('Користувач не авторизований');
      }

      const user = await this.userService.findByLogin(payload.username);

      if (!user) {
        throw new UnauthorizedException('Користувач не авторизований');
      }

      const tokens = this.tokenService.generateTokens({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken);

      this.setCookieRefreshToken(tokens.refreshToken, res);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      throw new UnauthorizedException('Користувач не авторизований');
    }
  }

  private setCookieRefreshToken(refreshToken: string, res: Response) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('refreshToken');
  }
}
