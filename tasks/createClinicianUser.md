Vamos criar um usuário Clinician que estende as funcionalidades de um User mas tem suas próprias lógicas e campos

Clinician extends User
A entidade User continua sendo a base — responsável por identidade, autenticação e permissões. Clinician estende User e adiciona os invariantes e dados específicos do clínico.
No banco: tabela users continua igual, mais uma tabela clinicians com os dados extras (relação 1-to-1 opcional).

Entidade base — sem mudanças estruturais
typescript// src/domain/user/User.ts

export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  clinicId: string;
  roleId?: string;
}

export class User extends Entity {
  readonly name: Name;
  readonly password: Password;
  readonly clinicId: string;
  readonly roleId?: string;
  private _email: Email;
  private _phone: Phone;

  constructor(props: UserDTO) {
    super(props.id);
    this.name = new Name(props.name, { compoundName: true });
    this._email = new Email(props.email);
    this._phone = new Phone(props.phone);
    this.password = new Password(props.password);
    this.clinicId = props.clinicId;
    this.roleId = props.roleId;
  }

  get email() { return this._email.value; }
  get phone() { return this._phone.value; }

  async getUserDTO(): Promise<UserDTO> {
    return {
      id: this.id,
      email: this.email,
      password: await this.password.getHash(),
      name: this.name.value,
      phone: this.phone,
      clinicId: this.clinicId,
      roleId: this.roleId,
    };
  }
}

Value Object: ClinicianService
Os serviços do clínico não são strings soltas — têm regras. Encapsule:
typescript// src/domain/clinician/ClinicianService.ts

export interface ClinicianServiceProps {
  serviceId: string;    // FK → services.id
  durationOverride?: number; // segundos; null = usa o padrão do serviço
}

export class ClinicianService {
  readonly serviceId: string;
  readonly durationOverride?: number;

  constructor(props: ClinicianServiceProps) {
    if (!props.serviceId) throw new Error('serviceId é obrigatório');

    if (
      props.durationOverride !== undefined &&
      props.durationOverride <= 0
    ) {
      throw new Error('durationOverride deve ser positivo');
    }

    this.serviceId = props.serviceId;
    this.durationOverride = props.durationOverride;
  }
}

Entidade Clinician
typescript// src/domain/clinician/Clinician.ts

import { User, UserDTO } from '../user/User';
import { ClinicianService, ClinicianServiceProps } from './ClinicianService';

export interface ClinicianDTO extends UserDTO {
  // dados específicos do clínico — nunca ficam em UserDTO
  services?: ClinicianServiceProps[];
}

export class Clinician extends User {
  private _services: ClinicianService[];

  constructor(props: ClinicianDTO) {
    super(props);

    this._services = (props.services ?? []).map(
      (s) => new ClinicianService(s)
    );
  }

  get services(): ReadonlyArray<ClinicianService> { return this._services; }

  // Comportamentos exclusivos do clínico

  addService(service: ClinicianServiceProps): Clinician {
    const alreadyAdded = this._services.some(
      (s) => s.serviceId === service.serviceId
    );
    if (alreadyAdded) throw new Error('Serviço já vinculado ao clínico.');

    return new Clinician({
      ...this.toClinicianDTO(),
      services: [...this.toClinicianDTO().services!, service],
    });
  }

  removeService(serviceId: string): Clinician {
    const updated = this._services.filter((s) => s.serviceId !== serviceId);
    if (updated.length === this._services.length) {
      throw new Error('Serviço não encontrado no clínico.');
    }
    return new Clinician({
      ...this.toClinicianDTO(),
      services: updated.map((s) => ({
        serviceId: s.serviceId,
        durationOverride: s.durationOverride,
      })),
    });
  }

  // DTO específico do clínico (inclui tudo do UserDTO)
  toClinicianDTO(): ClinicianDTO {
    return {
      id: this.id,
      email: this.email,
      // password já é hash nesse ponto se vier do banco,
      // getUserDTO() faz o hash lazy para criação
      password: '', // será preenchido via getUserDTO() quando necessário
      name: this.name.value,
      phone: this.phone,
      clinicId: this.clinicId,
      roleId: this.roleId,
      services: this._services.map((s) => ({
        serviceId: s.serviceId,
        durationOverride: s.durationOverride,
      })),
    };
  }
}

Banco de dados
sql-- Tabela existente, sem alterações
users (
  id, name, email, phone, password_hash,
  clinic_id, role_id
)

-- Nova tabela: dados exclusivos do clínico
clinicians (
  id          UUID PK DEFAULT uuid()  -- mesmo id do users (shared PK)
  -- índice implícito pelo PK compartilhado
)

-- Serviços do clínico
clinician_services (
  id                UUID PK
  clinician_id      UUID FK → clinicians.id
  service_id        UUID FK → services.id
  duration_override INT NULL  -- segundos; NULL = usa duração padrão do serviço
  UNIQUE (clinician_id, service_id)
)

Shared PK (clinicians.id = users.id) é mais limpo do que uma coluna user_id separada. Garante que não existe clinician sem user correspondente, sem precisar de coluna extra.


Repositório
Dois repositórios separados respeitando o princípio da separação de responsabilidades:
typescript// src/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

// src/repositories/IClinicianRepository.ts
export interface IClinicianRepository {
  findById(id: string): Promise<Clinician | null>;
  findByClinic(clinicId: string): Promise<Clinician[]>;
  save(clinician: Clinician): Promise<void>;  // upsert em users + clinicians + clinician_services
  delete(id: string): Promise<void>;
}
typescript// src/repositories/knex/KnexClinicianRepository.ts

export class KnexClinicianRepository implements IClinicianRepository {
  constructor(private db: Knex) {}

  async findById(id: string): Promise<Clinician | null> {
    const row = await this.db('users as u')
      .leftJoin('clinicians as c', 'c.id', 'u.id')
      .where('u.id', id)
      .whereNotNull('c.id')   // garante que é clínico
      .first();

    if (!row) return null;

    const services = await this.db('clinician_services')
      .where('clinician_id', id)
      .select('service_id as serviceId', 'duration_override as durationOverride');

    return new Clinician({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      password: row.password_hash,
      clinicId: row.clinic_id,
      roleId: row.role_id,
      services,
    });
  }

  async save(clinician: Clinician): Promise<void> {
    const dto = clinician.toClinicianDTO();
    const userDTO = await clinician.getUserDTO();

    await this.db.transaction(async (trx) => {
      // upsert users
      await trx('users')
        .insert({
          id: clinician.id,
          name: userDTO.name,
          email: userDTO.email,
          phone: userDTO.phone,
          password_hash: userDTO.password,
          clinic_id: userDTO.clinicId,
          role_id: userDTO.roleId,
        })
        .onConflict('id')
        .merge(['name', 'email', 'phone', 'role_id']);

      // upsert clinicians
      await trx('clinicians')
        .insert({ id: clinician.id })
        .onConflict('id')

      // recria serviços (simples e seguro para listas pequenas)
      await trx('clinician_services')
        .where('clinician_id', clinician.id)
        .delete();

      if (dto.services?.length) {
        await trx('clinician_services').insert(
          dto.services.map((s) => ({
            id: uuid(),
            clinician_id: clinician.id,
            service_id: s.serviceId,
            duration_override: s.durationOverride ?? null,
          }))
        );
      }
    });
  }
}

Use cases separados
typescript// src/use-cases/clinician/CreateClinician.ts

export class CreateClinicianService {
  constructor(
    private clinicianRepo: IClinicianRepository,
    private userRepo: IUserRepository,   // para checar email duplicado
  ) {}

  async execute(data: ClinicianDTO): Promise<Clinician> {
    const emailInUse = await this.userRepo.findByEmail(data.email);
    if (emailInUse) throw new ConflictError('Email já cadastrado.');

    const clinician = new Clinician(data);
    await this.clinicianRepo.save(clinician);
    return clinician;
  }
}
Use cases de User (atendente, gestor) continuam usando IUserRepository — nunca precisam saber que Clinician existe.

Como fica o agendamento
O scheduling já tem patientId. Basta adicionar clinicianId (que é um userId com registro em clinicians):
typescript// CreateSchedulingBody já existente — adiciona campo:
clinicianId: string;  // FK → clinicians.id (= users.id)
No use case de criação de agendamento, você valida:
typescriptconst clinician = await clinicianRepo.findById(data.clinicianId);
if (!clinician) throw new BadRequestError('Clínico não encontrado.');
if (clinician.clinicId !== currentUser.clinicId) throw new ForbiddenError();

Resumo da estrutura
domain/
  user/
    User.ts              ← entidade base, login, permissões
    IUserRepository.ts

  clinician/
    Clinician.ts         ← extends User, agenda, serviços
    ClinicianService.ts  ← value object
    IClinicianRepository.ts

repositories/
  knex/
    KnexUserRepository.ts
    KnexClinicianRepository.ts   ← JOIN users + clinicians + clinician_services

use-cases/
  auth/          ← usa IUserRepository (funciona para qualquer User)
  clinician/     ← usa IClinicianRepository
O login funciona para qualquer User — o IUserRepository.findByEmail retorna um User base, suficiente para autenticação. Se precisar saber se é clínico após o login (para montar o payload JWT, por exemplo), basta fazer um clinicianRepo.findById(user.id) e checar se retorna algo.