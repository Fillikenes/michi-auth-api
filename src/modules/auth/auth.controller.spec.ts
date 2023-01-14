import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos';
import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: CACHE_MANAGER, useValue: { set: jest.fn() } },
        {
          provide: ConfigService,
          useValue: {
            config: {
              jwtAccessSecret: 'jwt_access_secret',
              jwtRefreshSecret: 'jwt_refresh_secret',
            },
          },
        },
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          },
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#register', () => {
    it('should register a new user with authenticacion  in the db', async () => {
      jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(() => Promise.resolve('salt'));
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hash'));

      const userParams = {
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
        rut: 'new rut',
      };
      const authParams = {
        password: '1234',
        roleId: '1',
      };
      const paramsBody = {
        ...userParams,
        ...authParams,
      } as RegisterDto;

      const expectedResponse = {
        id: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...userParams,
      };
      const registerSpy = jest
        .spyOn(authService, 'register')
        .mockResolvedValue(expectedResponse);

      const result = await controller.register(paramsBody);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(registerSpy).toHaveBeenCalled();
      expect(registerSpy).toHaveBeenCalledWith({
        user: userParams,
        auth: { ...authParams, password: 'hash' },
      });
    });
  });

  describe('#login', () => {
    it('should login a user and return a valid session', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const paramsRequest: any = {
        user: {
          id: '123',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'New name',
          lastName: 'New lastname',
          email: 'new@email.com',
        },
      };

      const expectedResponse = { accessToken: 'token', refreshToken: 'token' };

      const signSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue('token');

      const result = await controller.login(paramsRequest);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(signSpy).toHaveBeenCalledTimes(2);
      expect(signSpy.mock.calls).toEqual([
        [
          { sub: 'new@email.com', username: 'new@email.com' },
          { expiresIn: '15m', secret: 'jwt_access_secret' },
        ],
        [
          { sub: 'new@email.com', username: 'new@email.com' },
          { expiresIn: '1h', secret: 'jwt_refresh_secret' },
        ],
      ]);
    });
  });

  describe('#refresh', () => {
    it('should refresh a user session and return a valid session', async () => {
      const paramsRequest: any = {
        user: {
          sub: 'new@email.com',
          refreshToken: 'token',
        },
      };

      const expectedResponse = { accessToken: 'token', refreshToken: 'token' };

      const signSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue('token');

      const result = await controller.refreshSession(paramsRequest);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(signSpy).toHaveBeenCalledTimes(2);
      expect(signSpy.mock.calls).toEqual([
        [
          { sub: 'new@email.com', username: 'new@email.com' },
          { expiresIn: '15m', secret: 'jwt_access_secret' },
        ],
        [
          { sub: 'new@email.com', username: 'new@email.com' },
          { expiresIn: '1h', secret: 'jwt_refresh_secret' },
        ],
      ]);
    });
  });
});
