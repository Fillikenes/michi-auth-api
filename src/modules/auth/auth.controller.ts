import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dtos';
import { AuthService } from './auth.service';
import { IRegisterParams } from './params/register-params';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
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

  @Post('/login')
  public async login(@Body() login: LoginDto) {
    const { email, password } = login;

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      console.log('not found');
      return;
    }

    return await bcrypt.compare(password, user.authorization.password);
  }

  private async _encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }
}
