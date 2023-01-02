import { IsDefined, IsString } from 'class-validator';

export class CreateUserDto {
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
}
