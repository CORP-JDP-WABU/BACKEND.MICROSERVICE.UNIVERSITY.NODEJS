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
      `Usted a ingresado un profesor que no a sido registrado en nuestra plataforma [${customCode}`,
    );
  }
}

export class CourseNotFoundCustomException extends ConflictException {
  constructor(customCode: string) {
    super(
      `Usted a ingresado un curso, que no a sido registrado para el profesor, en nuestra plataforma [${customCode}`,
    );
  }
}
