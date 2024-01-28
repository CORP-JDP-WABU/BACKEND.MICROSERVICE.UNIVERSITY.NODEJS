import { ConflictException } from '@nestjs/common';

export class UnahutorizedUniversityCustomException extends ConflictException {
  constructor(customCode: string) {
    super(`Usted no esta authorizado para realizar consultas en esta universidad [${customCode}]`);
  }
}
