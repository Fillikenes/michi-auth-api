import * as bcrypt from 'bcrypt';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { RegisterDto } from './dtos';
import { AuthService } from './auth.service';
import { IRegisterParams } from './params/register-params';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
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

    return this.authService.register(registerParams);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  public async login(@Request() req) {
    const user = req.user as User;
    const payload = { username: user.email, sub: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async _encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }
}
