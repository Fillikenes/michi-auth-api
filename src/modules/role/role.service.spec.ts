import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { IRoleCreateParams } from './params/role-create.params';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: {
            role: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#createRole', () => {
    it('should create a new role in the db based in the properties given as arguments', async () => {
      const params = {
        name: 'New name',
        permissionIds: [],
      } as IRoleCreateParams;

      const expectedResponse = { id: '1234', ...params };
      const createSpy = jest
        .spyOn(prismaService.role, 'create')
        .mockResolvedValue(expectedResponse);

      const result = await service.createRole(params);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(createSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledWith({ data: params });
    });
  });

  describe('#updateRole', () => {
    it('should update the properties of a role from db', async () => {
      const id = '1234';
      const params = {
        name: 'New name',
        permissionIds: ['1234-abcd'],
      } as IRoleCreateParams;
      const expectedResponse = { id, ...params };

      const updateSpy = jest
        .spyOn(prismaService.role, 'update')
        .mockResolvedValue(expectedResponse);

      const result = await service.updateRole(id, params);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(updateSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id },
        data: params,
      });
    });
  });

  describe('#deleteRole', () => {
    it('should delete a specific role from db by id given as argument', async () => {
      const id = '1234';
      const expectedResponse = { id, name: 'New name', permissionIds: [] };
      const deleteSpy = jest
        .spyOn(prismaService.role, 'delete')
        .mockResolvedValue(expectedResponse);

      const result = await service.deleteRole(id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(deleteSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('#getRoleByRut ', () => {
    it('should return a specific role from db by rut given as argument', async () => {
      const id = '1234';
      const expectedResponse = { id, name: 'New name', permissionIds: [] };
      const findFirstSpy = jest
        .spyOn(prismaService.role, 'findFirst')
        .mockResolvedValue(expectedResponse);

      const result = await service.getRoleById(id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(findFirstSpy).toHaveBeenCalled();

      expect(findFirstSpy).toHaveBeenCalledWith({
        where: { id },
        include: { permissions: true },
      });

      const [firstArgument] = findFirstSpy.mock.lastCall;
      expect(firstArgument).toEqual({
        where: { id },
        include: { permissions: true },
      });
      expect(firstArgument).toHaveProperty('where', { id });
    });
  });
});
