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
  private readonly DEFAULT_EXPIRATION_TIME = 60;

  constructor() {
    this._setup();
  }

  private _setup(): void {
    const configSchema = Joi.object<IEnvironmentParams>({
      PORT: Joi.number().default(this.DEFAULT_PORT),
      ENVIRONMENT: Joi.string()
        .valid(...Object.values(EEnvironment))
        .required(),
      SECRET: Joi.string().required(),
      EXPIRATION_TIME: Joi.number().default(this.DEFAULT_EXPIRATION_TIME),
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
      secret: value.SECRET,
      expirationTime: value.EXPIRATION_TIME,
    };
  }
}
