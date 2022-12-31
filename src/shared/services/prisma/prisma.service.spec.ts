import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

jest.mock('@prisma/client');
describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#onModuleInit', () => {
    const connectSpy = jest.fn();

    beforeEach(() => {
      service.$connect = connectSpy;
    });

    it('should execute connect method to stablish connection with db', async () => {
      await service.onModuleInit();
      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe('#enableShutdownHooks', () => {
    beforeEach(() => {
      service.$on = jest.fn().mockImplementation((value: string, cb) => {
        expect(value).toEqual('beforeExit');
        cb();
      });
    });

    it('should force the close of nest app when before exit signal is emitted', async () => {
      const app = { close: jest.fn() } as any;
      await service.enableShutdownHooks(app);
      expect(app.close).toHaveBeenCalled();
    });
  });
});
