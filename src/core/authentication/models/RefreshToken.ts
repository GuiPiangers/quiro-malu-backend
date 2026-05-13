import { Entity } from "../../shared/Entity";

export type RefreshTokenDTO = {
  id?: string;
  userId: string;
  fingerprint: string;
  expiresIn: number;
  lastUsedAt?: string;
};

export class RefreshToken extends Entity {
  readonly userId: string;
  readonly fingerprint: string;
  readonly expiresIn: number;
  readonly lastUsedAt?: string;

  constructor(props: RefreshTokenDTO) {
    super(props.id);
    this.userId = props.userId;
    this.fingerprint = props.fingerprint;
    this.expiresIn = props.expiresIn;
    this.lastUsedAt = props.lastUsedAt;
  }

  getDTO(): RefreshTokenDTO {
    return {
      id: this.id,
      userId: this.userId,
      fingerprint: this.fingerprint,
      expiresIn: this.expiresIn,
      lastUsedAt: this.lastUsedAt,
    };
  }
}
