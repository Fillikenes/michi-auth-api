import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { AuthService } from './auth.service';
import { IRegisterParams } from './params/register-params';

describe('Auth Service', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#Register user', () => {
    it('should register a new user in the db based in the properties given as arguments', async () => {
      const params = {
        user: {
          name: 'New name',
          lastName: 'New lastname',
          email: 'new@email.com',
          rut: 'New rut',
        },
        auth: {
          password: '1234',
          roleId: '1',
        },
      } as IRegisterParams;

      const expectedResponse = {
        id: '1234',
        ...params.user,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createSpy = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(expectedResponse);

      const result = await service.register(params);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          ...params.user,
          authorization: {
            create: { ...params.auth },
          },
        },
      });
    });
  });
});
