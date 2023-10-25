import { Email } from "../../shared/Email";
import { Entity } from "../../shared/Entity";
import { Name } from "../../shared/Name";
import { Password } from "../../shared/Password";
import { Phone } from "../../shared/Phone";

export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export class User extends Entity {
  readonly name: Name;
  readonly password: Password;
  private _email: Email;
  private _phone: Phone;

  constructor(props: UserDTO) {
    super(props.id);
    this.name = new Name(props.name, { compoundName: true });
    this._email = new Email(props.email);
    this._phone = new Phone(props.phone);
    this.password = new Password(props.password);
  }

  get email() { return this._email.value }
  get phone() { return this._phone.value }

  async getUserDTO(): Promise<UserDTO> {
    return {
      id: this.id,
      email: this.email,
      password: await this.password.getHash(),
      name: this.name.value,
      phone: this.phone,
    }
  }
}
