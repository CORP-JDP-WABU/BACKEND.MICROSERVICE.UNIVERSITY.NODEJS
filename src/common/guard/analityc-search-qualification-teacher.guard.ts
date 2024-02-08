

import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Logger
  } from '@nestjs/common';
  import { OperationService } from '../client/operation/operation.service';
  
  @Injectable()
  export class AnalitycSearchQualificationTeacherGuard implements CanActivate {
    
    private logger = new Logger(AnalitycSearchQualificationTeacherGuard.name);

    constructor(
      private readonly operationService: OperationService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const student = request.userSession;
            this.operationService.callFxSearchQualificationTeacher({ ...student });
            return true;
        } catch (error) {
            this.logger.error('analitycsearchqualificationteacherguard:canactivate:error', error);
            return true;
        }
    }
}