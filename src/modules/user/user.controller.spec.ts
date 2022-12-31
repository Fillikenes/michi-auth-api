import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dtos/create-user.dto';
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
        lastname: 'New lastname',
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
});
