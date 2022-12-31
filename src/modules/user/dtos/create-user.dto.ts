import { IsDefined, IsString } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  lastname: string;

  @IsDefined()
  @IsString()
  email: string;
}
