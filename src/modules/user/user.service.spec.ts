import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { UserCreateParams, UserUpdateParams } from './params';
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
              update: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
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
      const params: UserCreateParams = {
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
        rut: 'New rut',
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

  describe('#updateUser', () => {
    it('should update the properties of a user from db', async () => {
      const id = '1234';

      const params: UserUpdateParams = {
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
      };

      const expectedResponse = {
        id: '1234',
        rut: 'New rut',
        name: params.name,
        lastName: params.lastName,
        email: params.email,
      };

      const updateSpy = jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(expectedResponse);

      const result = await service.updateUser(id, params);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(updateSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id },
        data: { ...params },
      });
    });
  });

  describe('#deleteUser', () => {
    it('should delete a specific user from db by id given as argument', async () => {
      const id = '1234';
      const expectedResponse = {
        id: id,
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
        rut: 'New rut',
      };

      const deleteSpy = jest
        .spyOn(prismaService.user, 'delete')
        .mockResolvedValue(expectedResponse);

      const result = await service.deleteUser(id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(deleteSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('#getUserByRut ', () => {
    it('should return a specific user from db by rut given as argument', async () => {
      const rut = 'New rut';

      const expectedResponse = {
        id: '1234',
        name: 'New name',
        lastName: 'New lastname',
        email: 'new@email.com',
        rut,
      };

      const findFirstSpy = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(expectedResponse);

      const result = await service.getUserByRut(rut);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(findFirstSpy).toHaveBeenCalled();

      expect(findFirstSpy).toHaveBeenCalledWith({ where: { rut } });

      const [firstArgument] = findFirstSpy.mock.lastCall;
      expect(firstArgument).toEqual({ where: { rut } });
      expect(firstArgument).toHaveProperty('where', { rut });
    });
  });
});
