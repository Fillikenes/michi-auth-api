import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.config.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    const user = await this.userService.getUserByEmail(payload.username);

    if (!user) throw new UnauthorizedException();

    const session = await this.cacheManager.get(user.email);

    if (!session) throw new UnauthorizedException();

    return { ...payload, refreshToken };
  }
}
