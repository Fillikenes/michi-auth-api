import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos';
import { UserWithAuthorization } from '../user/models/user-authorization.model';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

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
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
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

      const paramsBody = {
        email: 'new@email.com',
        password: '1234',
      };

      const expectedResponse: UserWithAuthorization = {
        id: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
        rut: 'new rut',
        authorization: {
          id: '123',
          password: 'hash',
          roleId: '1',
          userRut: 'new rut',
        },
      };

      const getUserByEmailSpy = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(expectedResponse);

      const result = await controller.login(paramsBody);

      expect(result).toBeDefined();
      expect(result).toEqual(true);
      expect(getUserByEmailSpy).toHaveBeenCalled();
      expect(getUserByEmailSpy).toHaveBeenCalledWith(paramsBody.email);
    });
  });
});
