import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConfigService } from '../../../config/config.service';
import { UserService } from '../../user/user.service';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

describe('JwtRefreshStrategy', () => {
  let jwtRefreshStrategy: JwtRefreshStrategy;
  let userService: UserService;
  let configService: ConfigService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: CACHE_MANAGER, useValue: { get: jest.fn() } },
        {
          provide: ConfigService,
          useValue: {
            config: {
              jwtRefreshSecret: 'jwt_refresh_secret',
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
        JwtRefreshStrategy,
      ],
    }).compile();

    jwtRefreshStrategy = app.get<JwtRefreshStrategy>(JwtRefreshStrategy);
    userService = app.get<UserService>(UserService);
    configService = app.get<ConfigService>(ConfigService);
    cacheManager = app.get<'CACHE_MANAGER'>(CACHE_MANAGER);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(jwtRefreshStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a refresh session if the session is valid', async () => {
      const req: any = {
        get: jest.fn().mockReturnValueOnce('Bearer token'),
      };
      const payload: any = { username: 'new@email.com' };
      const user: any = { email: 'new@email.com' };
      const expectedResponse = {
        refreshToken: 'token',
        username: 'new@email.com',
      };

      const getUserByEmailSpy = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(user);

      const getCacheSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue('token');

      const session = await jwtRefreshStrategy.validate(req, payload);

      expect(getUserByEmailSpy).toHaveBeenCalled();
      expect(getUserByEmailSpy).toHaveBeenCalledWith(payload.username);
      expect(getCacheSpy).toHaveBeenCalled();
      expect(getCacheSpy).toHaveBeenCalledWith(user.email);
      expect(configService.config.jwtRefreshSecret).toBe('jwt_refresh_secret');
      expect(session).toEqual(expectedResponse);
    });

    it('should return UnauthorizedException when the user is not found', async () => {
      const req: any = {
        get: jest.fn().mockReturnValueOnce('Bearer token'),
      };
      const payload: any = { username: 'new@email.com' };

      const getUserByEmailSpy = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(null);

      const getCacheSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue('token');

      try {
        await jwtRefreshStrategy.validate(req, payload);
      } catch (err) {
        expect(getUserByEmailSpy).toHaveBeenCalled();
        expect(getUserByEmailSpy).toHaveBeenCalledWith(payload.username);
        expect(getCacheSpy).not.toHaveBeenCalled();
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should return UnauthorizedException when the sesion is not found in cache', async () => {
      const req: any = {
        get: jest.fn().mockReturnValueOnce('Bearer token'),
      };
      const payload: any = { username: 'new@email.com' };
      const user: any = { email: 'new@email.com' };

      const getUserByEmailSpy = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(user);

      const getCacheSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(null);

      try {
        await jwtRefreshStrategy.validate(req, payload);
      } catch (err) {
        expect(getUserByEmailSpy).toHaveBeenCalled();
        expect(getUserByEmailSpy).toHaveBeenCalledWith(payload.username);
        expect(getCacheSpy).toHaveBeenCalled();
        expect(getCacheSpy).toHaveBeenCalledWith(user.email);
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
