import { IsDefined, IsString } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsString()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}
