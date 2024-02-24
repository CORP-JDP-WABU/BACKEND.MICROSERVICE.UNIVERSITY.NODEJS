import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { OperationService } from '../client/operation/operation.service';

@Injectable()
export class AnalitycSearchCourseTeacherGuard implements CanActivate {
  private logger = new Logger(AnalitycSearchCourseTeacherGuard.name);

  constructor(private readonly operationService: OperationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const student = request.userSession;
      this.operationService.callFxSearchCourseTeacher({ ...student });
      return true;
    } catch (error) {
      this.logger.error(
        'analitycsearchcourseteacherguard:canactivate:error',
        error,
      );
      return true;
    }
  }
}
