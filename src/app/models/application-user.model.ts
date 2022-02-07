export class ApplicationUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  roles: string[];

  constructor(email = '',
              password = '',
              firstName = '',
              lastName = '',
              birthDate = '',
              roles= []) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.roles = roles;
  }
}
