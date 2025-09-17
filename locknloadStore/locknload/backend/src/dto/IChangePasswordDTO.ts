export interface IChangePasswordDTO {
  token: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}
