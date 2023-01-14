import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '../../../config/config.service';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            config: {
              jwtAccessSecret: 'test',
            },
          },
        },
      ],
    }).compile();

    jwtStrategy = app.get<JwtStrategy>(JwtStrategy);
    configService = app.get<ConfigService>(ConfigService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user principal if user and password is provided ', async () => {
      const user = await jwtStrategy.validate({
        sub: 'testid',
        username: 'test@example.com',
      });

      expect(configService.config.jwtAccessSecret).toBe('test');
      expect(user.username).toEqual('test@example.com');
      expect(user.userId).toEqual('testid');
    });
  });
});
