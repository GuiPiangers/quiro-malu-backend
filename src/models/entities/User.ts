import { Email } from "../shared/Email";
import { Entity } from "../shared/Entity";
import { Name } from "../shared/Name";
import { Password } from "../shared/Password";
import { Phone } from "../shared/Phone";

export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export class User extends Entity {
  readonly name: Name;
  readonly email: Email;
  readonly phone: Phone;
  readonly password: Password;

  constructor(props: UserDTO) {
    super(props.id);
    this.name = new Name(props.name);
    this.email = new Email(props.email);
    this.phone = new Phone(props.phone);
    this.password = new Password(props.password);
  }
}
