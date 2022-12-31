import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { UserParams } from './params/user.params';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#createUser', () => {
    it('should create a new user in the db based in the properties given as arguments', async () => {
      const params: UserParams = {
        name: 'New name',
        lastname: 'New lastname',
        email: 'new@email.com',
      };

      const expectedResponse = { id: '1234', ...params };
      const createSpy = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(expectedResponse);

      const result = await service.createUser(params);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({ data: { ...params } });
    });
  });
});
