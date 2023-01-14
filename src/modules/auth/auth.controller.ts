import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { RegisterDto } from './dtos';
import { AuthService } from './auth.service';
import { IRegisterParams } from './params/register-params';
import { ConfigService } from '../../config/config.service';
import { JwtRefreshGuard, LocalAuthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/register')
  public async register(@Body() register: RegisterDto) {
    const { name, lastName, email, rut, password, roleId } = register;

    const hash = await this._encryptPassword(password);

    const registerParams: IRegisterParams = {
      user: { name, lastName, email, rut },
      auth: { password: hash, roleId },
    };

    // send active account email

    return this.authService.register(registerParams);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  public async login(@Req() req: Request) {
    const user = req.user as User;

    const { accessToken, refreshToken } = await this._getTokens(user.email);

    await this.cacheManager.set(user.email, accessToken, { ttl: 3600 });

    return {
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  public async refreshSession(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    const { accessToken } = await this._getTokens(userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async _encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  private async _getTokens(email: string) {
    const payload = { sub: email, username: email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.config.jwtAccessSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.config.jwtRefreshSecret,
        expiresIn: '1h',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
