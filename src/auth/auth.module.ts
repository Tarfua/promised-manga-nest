import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, TokenModule, JwtModule.register({})],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
