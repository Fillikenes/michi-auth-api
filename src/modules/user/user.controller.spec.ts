import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            getUserByRut: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createUser', () => {
    it('should create a new user in the db', async () => {
      const params = {
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
      } as CreateUserDto;

      const expectedResponse = { id: '123', ...params };
      const createUserSpy = jest
        .spyOn(userService, 'createUser')
        .mockResolvedValue(expectedResponse);

      const result = await controller.createUser(params);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(createUserSpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalledWith(params);
    });
  });

  describe('#updateUser', () => {
    it('should update a user from db based in the id given as argument', async () => {
      const paramId = '1234';
      const paramsBody = {
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
      } as UpdateUserDto;
      const expectedResponse = { id: paramId, rut: 'New rut', ...paramsBody };
      const updateUserSpy = jest
        .spyOn(userService, 'updateUser')
        .mockResolvedValue(expectedResponse);

      const result = await controller.updateUser(paramId, paramsBody);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(updateUserSpy).toHaveBeenCalled();
      expect(updateUserSpy).toHaveBeenCalledWith(paramId, paramsBody);
    });
  });

  describe('#deleteUser', () => {
    it('should delete a specific user from db based in the argument given', async () => {
      const params = { id: '1234' };
      const expectedResponse = {
        id: params.id,
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
        rut: 'New rut',
      };
      const deleteUserSpy = jest
        .spyOn(userService, 'deleteUser')
        .mockResolvedValue(expectedResponse);

      const result = await controller.deleteUser(params.id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(deleteUserSpy).toHaveBeenCalled();
      expect(deleteUserSpy).toHaveBeenCalledWith(params.id);
    });
  });

  describe('#getUserByRut', () => {
    it('should get a specific user from db based in the argument given', async () => {
      const params = { id: '1234' };
      const expectedResponse = {
        id: params.id,
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
        rut: 'New rut',
      };
      const getUserByRutSpy = jest
        .spyOn(userService, 'getUserByRut')
        .mockResolvedValue(expectedResponse);

      const result = await controller.getUserByRut(params.id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(getUserByRutSpy).toHaveBeenCalled();
      expect(getUserByRutSpy).toHaveBeenCalledWith(params.id);
    });
  });
});
