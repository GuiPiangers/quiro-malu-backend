import { User, UserDTO } from "../../authentication/models/User";
import { Service, ServiceDTO } from "../../service/models/Service";
import { ApiError } from "../../../utils/ApiError";

export interface ClinicianDTO extends UserDTO {
  services?: ServiceDTO[];
}

export class Clinician extends User {
  private readonly _services: Service[];

  constructor(props: ClinicianDTO) {
    const { services, ...userProps } = props;
    super(userProps);

    const list = services ?? [];
    const seen = new Set<string>();
    for (const s of list) {
      const id = s.id;
      if (!id) {
        throw new ApiError("Serviço sem id", 400, "services");
      }
      if (seen.has(id)) {
        throw new ApiError(
          "Lista de serviços contém id duplicado",
          400,
          "services",
        );
      }
      seen.add(id);
    }

    this._services = list.map((s) => new Service(s));
  }

  get services(): ReadonlyArray<Service> {
    return this._services;
  }

  addService(service: ServiceDTO): Clinician {
    if (!service.id) {
      throw new ApiError("Serviço sem id", 400, "services");
    }
    const alreadyAdded = this._services.some((s) => s.id === service.id);
    if (alreadyAdded) {
      throw new ApiError("Serviço já vinculado ao clínico.", 400, "services");
    }

    const dto = this.toClinicianDTO();
    return new Clinician({
      ...dto,
      services: [...(dto.services ?? []), service],
    });
  }

  removeService(serviceId: string): Clinician {
    const updated = this._services.filter((s) => s.id !== serviceId);
    if (updated.length === this._services.length) {
      throw new ApiError("Serviço não encontrado no clínico.", 400, "services");
    }

    const dto = this.toClinicianDTO();
    return new Clinician({
      ...dto,
      services: updated.map((s) => s.getDTO()),
    });
  }

  toClinicianDTO(): ClinicianDTO {
    return {
      id: this.id,
      email: this.email,
      password: this.password.value,
      name: this.name.value,
      phone: this.phone,
      clinicId: this.clinicId,
      roleId: this.roleId,
      services: this._services.map((s) => s.getDTO()),
    };
  }
}
