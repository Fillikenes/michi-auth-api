import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
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

      const paramsRequest: User = {
        id: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
        rut: 'new rut',
      };

      const expectedResponse = { access_token: 'token' };

      const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await controller.login({ user: paramsRequest });

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(signSpy).toHaveBeenCalled();
      expect(signSpy).toHaveBeenCalledWith({
        username: paramsRequest.email,
        sub: paramsRequest.email,
      });
    });
  });
});
