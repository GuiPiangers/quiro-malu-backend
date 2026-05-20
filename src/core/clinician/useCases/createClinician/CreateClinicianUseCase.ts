import type { ClinicianPublicDTO } from "../../clinicianPublicDto";
import { toClinicianPublicDTO } from "../../clinicianPublicDto";
import { Clinician } from "../../models/Clinician";
import { resolveClinicianServices } from "../../resolveClinicianServices";
import type { IClinicianRepository } from "../../../../repositories/clinician/IClinicianRepository";
import type { IClinicRepository } from "../../../../repositories/clinic/IClinicRepository";
import type { IRbacRepository } from "../../../../repositories/rbac/IRbacRepository";
import type { IServiceRepository } from "../../../../repositories/service/IServiceRepository";
import type { IUserRepository } from "../../../../repositories/user/IUserRepository";
import { ApiError } from "../../../../utils/ApiError";

export type CreateClinicianInputDTO = {
  name: string;
  email: string;
  phone: string;
  password: string;
  roleId: string;
  services?: { serviceId: string }[];
};

export class CreateClinicianUseCase {
  constructor(
    private readonly clinicianRepository: IClinicianRepository,
    private readonly userRepository: IUserRepository,
    private readonly clinicRepository: IClinicRepository,
    private readonly rbacRepository: IRbacRepository,
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(
    data: CreateClinicianInputDTO,
    clinicId: string,
  ): Promise<ClinicianPublicDTO> {
    const clinic = await this.clinicRepository.findById(clinicId);
    if (!clinic) {
      throw new ApiError("Clínica não encontrada", 404, "clinicId");
    }

    if (!data.roleId?.trim()) {
      throw new ApiError("roleId é obrigatório", 400, "roleId");
    }

    const role = await this.rbacRepository.findRoleByIdForClinic({
      id: data.roleId,
      clinicId,
    });
    if (!role) {
      throw new ApiError("Papel inválido", 400, "roleId");
    }

    const [userAlreadyExist] = await this.userRepository.getByEmail(data.email);
    if (userAlreadyExist) {
      throw new ApiError("Usuário já cadastrado");
    }

    const resolvedServices = await resolveClinicianServices(
      this.serviceRepository,
      data.services ?? [],
      clinicId,
    );

    const clinician = new Clinician({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      clinicId,
      roleId: data.roleId,
      services: resolvedServices,
    });

    await this.clinicianRepository.save(clinician);

    return toClinicianPublicDTO(clinician);
  }
}
