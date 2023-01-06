import { Test, TestingModule } from '@nestjs/testing';
import { CreatePermissionDto } from './dtos';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

describe('PermissionController', () => {
  let controller: PermissionController;
  let permissionService: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        {
          provide: PermissionService,
          useValue: {
            createPermission: jest.fn(),
            updatePermission: jest.fn(),
            deletePermission: jest.fn(),
            getPermissionById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createPermission', () => {
    it('should create a new permission in the db', async () => {
      const paramsBody = { name: 'New name' } as CreatePermissionDto;
      const expectedResponse = { id: '123', roleIds: [], ...paramsBody };
      const createPermissionSpy = jest
        .spyOn(permissionService, 'createPermission')
        .mockResolvedValue(expectedResponse);

      const result = await controller.createPermission(paramsBody);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(createPermissionSpy).toHaveBeenCalled();
      expect(createPermissionSpy).toHaveBeenCalledWith(paramsBody.name);
    });
  });

  describe('#updatePermission', () => {
    it('should update a permission from db based in the id given as argument', async () => {
      const paramId = '1234';
      const paramsBody = { name: 'New name' };
      const expectedResponse = { id: paramId, roleIds: [], ...paramsBody };
      const updatePermissionSpy = jest
        .spyOn(permissionService, 'updatePermission')
        .mockResolvedValue(expectedResponse);

      const result = await controller.updatePermission(paramId, paramsBody);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(updatePermissionSpy).toHaveBeenCalled();
      expect(updatePermissionSpy).toHaveBeenCalledWith(
        paramId,
        paramsBody.name,
      );
    });
  });

  describe('#deletePermission', () => {
    it('should delete a specific permission from db based in the argument given', async () => {
      const params = { id: '1234' };
      const expectedResponse = { id: params.id, roleIds: [], name: 'New name' };
      const deletePermissionSpy = jest
        .spyOn(permissionService, 'deletePermission')
        .mockResolvedValue(expectedResponse);

      const result = await controller.deletePermission(params.id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(deletePermissionSpy).toHaveBeenCalled();
      expect(deletePermissionSpy).toHaveBeenCalledWith(params.id);
    });
  });

  describe('#getPermissionByRut', () => {
    it('should get a specific permission from db based in the argument given', async () => {
      const params = { id: '1234' };
      const expectedResponse = { id: params.id, roleIds: [], name: 'New name' };
      const getPermissionByIdSpy = jest
        .spyOn(permissionService, 'getPermissionById')
        .mockResolvedValue(expectedResponse);

      const result = await controller.getPermissionById(params.id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(getPermissionByIdSpy).toHaveBeenCalled();
      expect(getPermissionByIdSpy).toHaveBeenCalledWith(params.id);
    });
  });
});
