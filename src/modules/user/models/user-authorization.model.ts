import { User, Authorization } from '@prisma/client';

export type UserWithAuthorization = User & {
  authorization: Authorization;
};
