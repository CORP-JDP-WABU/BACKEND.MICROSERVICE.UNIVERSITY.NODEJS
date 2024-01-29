import { ConflictException } from '@nestjs/common';

export class UnahutorizedUniversityCustomException extends ConflictException {
  constructor(customCode: string) {
    super(
      `Usted no esta authorizado para realizar consultas en esta universidad [${customCode}`,
    );
  }
}

export class TeacherNotFoundCustomException extends ConflictException {
  constructor(customCode: string) {
    super(
      `Usted a ingresado un colegio que no a sido registrado en nuestra plataforma [${customCode}`,
    );
  }
}