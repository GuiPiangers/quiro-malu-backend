import { Entity } from "../../shared/Entity";
import { ApiError } from "../../../utils/ApiError";

export interface WhatsAppInstanceDTO {
  id: string;
  userId: string;
  instanceName: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class WhatsAppInstance extends Entity {
  private _userId: string;
  private _instanceName: string;
  private _phoneNumber?: string;

  constructor(dto: WhatsAppInstanceDTO) {
    super(dto.id);

    if (!dto.userId) {
      throw new ApiError("userId é obrigatório para uma instância WhatsApp", 400);
    }
    if (!dto.instanceName) {
      throw new ApiError(
        "instanceName é obrigatório para uma instância WhatsApp",
        400,
      );
    }

    this._userId = dto.userId;
    this._instanceName = dto.instanceName;
    this._phoneNumber = dto.phoneNumber;
  }

  get userId() {
    return this._userId;
  }

  get instanceName() {
    return this._instanceName;
  }

  getDTO(): WhatsAppInstanceDTO {
    return {
      id: this.id,
      userId: this._userId,
      instanceName: this._instanceName,
      phoneNumber: this._phoneNumber,
    };
  }
}
