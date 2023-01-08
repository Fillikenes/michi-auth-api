import { IsDefined, IsString } from 'class-validator';

export class RegisterDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  lastName: string;

  @IsDefined()
  @IsString()
  email: string;

  @IsDefined()
  @IsString()
  rut: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsString()
  roleId: string;
}
