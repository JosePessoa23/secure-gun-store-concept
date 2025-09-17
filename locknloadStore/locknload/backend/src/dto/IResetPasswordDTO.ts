export interface IResetPasswordDTO {
  token: string;
  email: string;
  new_password: string;
  new_password_confirmation: string;
}
