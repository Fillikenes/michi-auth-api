export interface IConfigParams {
  environment: string;
  port: number;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  redisUrl: string;
}
