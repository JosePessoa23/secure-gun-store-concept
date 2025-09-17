export class ResetPassword {
  token: string;
  email: string;
  new_password: string;
  new_password_confirmation: string;

  constructor(token:string, email: string, new_password: string, new_password_confirmation: string) {
    this.token = token;
    this.email = email;
    this.new_password = new_password;
    this.new_password_confirmation = new_password_confirmation;
  }
}
