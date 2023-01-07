import { IsDefined, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString({ each: true })
  permissionIds: string[];
}
