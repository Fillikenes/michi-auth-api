import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserWithAuthorization } from 'src/modules/user/models/user-authorization.model';
import { UserService } from '../../user/user.service';
import { LocalStrategy } from './local.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = app.get<LocalStrategy>(LocalStrategy);
    userService = app.get<UserService>(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user principal if user and password is provided ', async () => {
      const loginParams = { email: 'new@email.com', password: '1234abcd' };
      const expectedResponse: UserWithAuthorization = {
        id: '1234',
        name: 'New name',
        lastName: 'New lastname',
        email: loginParams.email,
        rut: 'New rut',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorization: {
          id: '1234',
          password: 'hash',
          roleId: '1',
          userRut: 'New rut',
        },
      };

      const getUserByEmailSpy = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(expectedResponse);

      const bcryptCompareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const user = await localStrategy.validate(
        loginParams.email,
        loginParams.password,
      );

      expect(getUserByEmailSpy).toHaveBeenCalled();
      expect(getUserByEmailSpy).toHaveBeenCalledWith(loginParams.email);
      expect(bcryptCompareSpy).toHaveBeenCalled();
      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        loginParams.password,
        'hash',
      );
      expect(user.email).toEqual(loginParams.email);
    });

    it('should return UnauthorizedException when the user is not found', async () => {
      const loginParams = { email: 'new@email.com', password: '1234abcd' };

      const getUserByEmailSpy = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(null);

      const bcryptCompareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      try {
        await localStrategy.validate(loginParams.email, loginParams.password);
      } catch (err) {
        expect(getUserByEmailSpy).toHaveBeenCalled();
        expect(getUserByEmailSpy).toHaveBeenCalledWith(loginParams.email);
        expect(bcryptCompareSpy).not.toHaveBeenCalled();
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should return UnauthorizedException when the password is wrong', async () => {
      const loginParams = { email: 'new@email.com', password: '1234abcd' };
      const expectedResponse: UserWithAuthorization = {
        id: '1234',
        name: 'New name',
        lastName: 'New lastname',
        email: loginParams.email,
        rut: 'New rut',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorization: {
          id: '1234',
          password: 'hash',
          roleId: '1',
          userRut: 'New rut',
        },
      };

      const getUserByEmailSpy = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(expectedResponse);

      const bcryptCompareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      try {
        await localStrategy.validate(loginParams.email, loginParams.password);
      } catch (err) {
        expect(getUserByEmailSpy).toHaveBeenCalled();
        expect(getUserByEmailSpy).toHaveBeenCalledWith(loginParams.email);
        expect(bcryptCompareSpy).toHaveBeenCalled();
        expect(bcryptCompareSpy).toHaveBeenCalledWith(
          loginParams.password,
          'hash',
        );
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
