import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientTCP } from '@nestjs/microservices';
import { CLIENT } from 'src/common/const/comon.const';

@Injectable()
export class OperationService {
  private logger = new Logger(
    `::${CLIENT.OPERATION}::${OperationService.name}`,
  );
  constructor(
    @Inject(CLIENT.OPERATION)
    private readonly client: ClientTCP,
  ) {}

  callFxSearchCourseTeacher<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    this.logger.debug(
      `execute::callFxSearchCourseTeacher::params${JSON.stringify(dto)}`,
    );
    const pattern = {
      subjet: 'client-operation',
      function: 'search-course-teacher',
    };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }

  callFxSearchQualificationTeacher<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    this.logger.debug(
      `execute::callFxSearchQualificationTeacher::params${JSON.stringify(dto)}`,
    );
    const pattern = {
      subjet: 'client-operation',
      function: 'search-qualification-teacher',
    };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }
}
