import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  let service: PermissionService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: PrismaService,
          useValue: {
            permission: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#createPermission', () => {
    it('should create a new permission in the db based in the properties given as arguments', async () => {
      const name = 'New name';
      const expectedResponse = { id: '1234', name };
      const createSpy = jest
        .spyOn(prismaService.permission, 'create')
        .mockResolvedValue(expectedResponse);

      const result = await service.createPermission(name);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({ data: { name } });
    });
  });

  describe('#updatePermission', () => {
    it('should update the properties of a permission from db', async () => {
      const id = '1234';
      const name = 'New name';
      const expectedResponse = { id, name };

      const updateSpy = jest
        .spyOn(prismaService.permission, 'update')
        .mockResolvedValue(expectedResponse);

      const result = await service.updatePermission(id, name);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(updateSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id },
        data: { name },
      });
    });
  });

  describe('#deletePermission', () => {
    it('should delete a specific permission from db by id given as argument', async () => {
      const id = '1234';
      const expectedResponse = { id, name: 'New name' };
      const deleteSpy = jest
        .spyOn(prismaService.permission, 'delete')
        .mockResolvedValue(expectedResponse);

      const result = await service.deletePermission(id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(deleteSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('#getPermissionByRut ', () => {
    it('should return a specific permission from db by rut given as argument', async () => {
      const id = '1234';
      const expectedResponse = { id, name: 'New name' };
      const findFirstSpy = jest
        .spyOn(prismaService.permission, 'findFirst')
        .mockResolvedValue(expectedResponse);

      const result = await service.getPermissionById(id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(findFirstSpy).toHaveBeenCalled();

      expect(findFirstSpy).toHaveBeenCalledWith({ where: { id } });

      const [firstArgument] = findFirstSpy.mock.lastCall;
      expect(firstArgument).toEqual({ where: { id } });
      expect(firstArgument).toHaveProperty('where', { id });
    });
  });
});
