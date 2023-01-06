import { Test, TestingModule } from '@nestjs/testing';
import { CreateRoleDto } from './dtos';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

describe('RoleController', () => {
  let controller: RoleController;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: {
            createRole: jest.fn(),
            updateRole: jest.fn(),
            deleteRole: jest.fn(),
            getRoleById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    roleService = module.get<RoleService>(RoleService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createRole', () => {
    it('should create a new role in the db', async () => {
      const paramsBody = {
        name: 'New name',
        permissionIds: [],
      } as CreateRoleDto;
      const expectedResponse = { id: '123', ...paramsBody };
      const createRoleSpy = jest
        .spyOn(roleService, 'createRole')
        .mockResolvedValue(expectedResponse);

      const result = await controller.createRole(paramsBody);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(createRoleSpy).toHaveBeenCalled();
      expect(createRoleSpy).toHaveBeenCalledWith(paramsBody);
    });
  });

  describe('#updateRole', () => {
    it('should update a role from db based in the id given as argument', async () => {
      const paramId = '1234';
      const paramsBody = { name: 'New name', permissionIds: [] };
      const expectedResponse = { id: paramId, ...paramsBody };
      const updateRoleSpy = jest
        .spyOn(roleService, 'updateRole')
        .mockResolvedValue(expectedResponse);

      const result = await controller.updateRole(paramId, paramsBody);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(updateRoleSpy).toHaveBeenCalled();
      expect(updateRoleSpy).toHaveBeenCalledWith(paramId, paramsBody);
    });
  });

  describe('#deleteRole', () => {
    it('should delete a specific role from db based in the argument given', async () => {
      const params = { id: '1234' };
      const expectedResponse = {
        id: params.id,
        name: 'New name',
        permissionIds: [],
      };
      const deleteRoleSpy = jest
        .spyOn(roleService, 'deleteRole')
        .mockResolvedValue(expectedResponse);

      const result = await controller.deleteRole(params.id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(deleteRoleSpy).toHaveBeenCalled();
      expect(deleteRoleSpy).toHaveBeenCalledWith(params.id);
    });
  });

  describe('#getRoleByRut', () => {
    it('should get a specific role from db based in the argument given', async () => {
      const params = { id: '1234' };
      const expectedResponse = {
        id: params.id,
        name: 'New name',
        permissionIds: [],
      };
      const getRoleByIdSpy = jest
        .spyOn(roleService, 'getRoleById')
        .mockResolvedValue(expectedResponse);

      const result = await controller.getRoleById(params.id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(getRoleByIdSpy).toHaveBeenCalled();
      expect(getRoleByIdSpy).toHaveBeenCalledWith(params.id);
    });
  });
});
