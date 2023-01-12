import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new UnauthorizedException();

    const isValidPassword = await bcrypt.compare(
      password,
      user.authorization.password,
    );

    if (!isValidPassword) throw new UnauthorizedException();

    delete user.authorization;

    return user;
  }
}
