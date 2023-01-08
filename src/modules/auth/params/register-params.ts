export interface IRegisterParams {
  user: {
    name: string;
    lastName: string;
    email: string;
    rut: string;
  };
  auth: {
    password: string;
    roleId: string;
  };
}
