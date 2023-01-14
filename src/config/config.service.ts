import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { EEnvironment } from '../shared/enums';
import { IConfigParams, IEnvironmentParams } from './models';

dotenv.config();

@Injectable()
export class ConfigService {
  public config: IConfigParams;
  private readonly DEFAULT_PORT = 3000;

  constructor() {
    this._setup();
  }

  private _setup(): void {
    const configSchema = Joi.object<IEnvironmentParams>({
      PORT: Joi.number().default(this.DEFAULT_PORT),
      ENVIRONMENT: Joi.string()
        .valid(...Object.values(EEnvironment))
        .required(),
      JWT_ACCESS_SECRET: Joi.string().required(),
      JWT_REFRESH_SECRET: Joi.string().required(),
      REDIS_URL: Joi.string().required(),
    });

    const { value, error } = configSchema.validate(process.env, {
      allowUnknown: true,
    });

    if (error) {
      throw error;
    }

    this.config = {
      environment: value.ENVIRONMENT,
      port: value.PORT,
      jwtAccessSecret: value.JWT_ACCESS_SECRET,
      jwtRefreshSecret: value.JWT_REFRESH_SECRET,
      redisUrl: value.REDIS_URL,
    };
  }
}
