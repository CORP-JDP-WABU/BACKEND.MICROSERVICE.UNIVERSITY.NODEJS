import { Controller, UseGuards, Get, Query, Param, Body } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

import * as services from './services';
import * as response from 'src/common/dto';
import * as requestTeacher from './dto';
import { SecurityGuard } from 'src/common/guard';
import { UserDecorator } from 'src/common/decorator';
import { UserDecoratorInterface } from 'src/common/interfaces';
import { AnalitycSearchQualificationTeacherGuard } from 'src/common/guard/analityc-search-qualification-teacher.guard';

@ApiBearerAuth()
@UseGuards(SecurityGuard, ThrottlerGuard)
@Controller('teacher/v1.0')
@ApiTags('TEACHER')
export class TeacherController {
  constructor(
    private readonly fnTeacherInCourseService: services.FnTeacherInCourseService,
    private readonly fnTeacherCourseCommentService: services.FnTeacherCourseCommentService,
    private readonly fnCareerCourseTeacherService: services.FnCareerCourseTeacherService,
    private readonly fnTeacherInUniversity: services.FnTeacherInUniversityService,
  ) {}

  @UseGuards(ThrottlerGuard, AnalitycSearchQualificationTeacherGuard)
  @Throttle()
  @Get(':idTeacher/course/:idCourse')
  @ApiCreatedResponse({
    description: 'The teacher has been successfully.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The teacher has been failed by conflict.',
  })
  @ApiInternalServerErrorResponse({
    description: 'The teacher has been failed by internal error.',
  })
  findAllTeacherInCourse(
    @Param('idTeacher') idTeacher: string,
    @Param('idCourse') idCourse: string,
    @UserDecorator() userDecorator: UserDecoratorInterface,
  ): Promise<response.ResponseGenericDto> {
    return this.fnTeacherInCourseService.execute(
      idTeacher,
      idCourse,
      userDecorator,
    );
  }

  @UseGuards(ThrottlerGuard, AnalitycSearchQualificationTeacherGuard)
  @Throttle()
  @Get(':idTeacher/course/:idCourse/comment')
  @ApiCreatedResponse({
    description: 'The teacher course comment has been successfully.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The teacher course comment has been failed by conflict.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'The teacher course comment has been failed by internal error.',
  })
  findAllTeacherCourseComment(
    @Param('idTeacher') idTeacher: string,
    @Param('idCourse') idCourse: string,
    @UserDecorator() userDecorator: UserDecoratorInterface,
  ): Promise<response.ResponseGenericDto> {
    return this.fnTeacherCourseCommentService.execute(idTeacher, idCourse);
  }

  @UseGuards(ThrottlerGuard, AnalitycSearchQualificationTeacherGuard)
  @Throttle()
  @Get('career/:idCareer')
  @ApiCreatedResponse({
    description: 'The teacher career has been successfully.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The teacher career has been failed by conflict.',
  })
  @ApiInternalServerErrorResponse({
    description: 'The teacher career has been failed by internal error.',
  })
  findAllTeacherCareer(
    @Param('idCareer') idCareer: string,
    @UserDecorator() userDecorator: UserDecoratorInterface,
  ): Promise<response.ResponseGenericDto> {
    return this.fnCareerCourseTeacherService.execute(idCareer, userDecorator);
  }

  @UseGuards(ThrottlerGuard, AnalitycSearchQualificationTeacherGuard)
  @Throttle()
  @Get('university/:idUniversity')
  @ApiCreatedResponse({
    description: 'The teacher university has been successfully.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The teacher university has been failed by conflict.',
  })
  @ApiInternalServerErrorResponse({
    description: 'The teacher university has been failed by internal error.',
  })
  findAllTeacherUniversity(
    @Param('idUniversity') idUniversity: string,
    @Param('skipe') skipe: string,
    @Query('search') search: string,
    @UserDecorator() userDecorator: UserDecoratorInterface,
  ): Promise<response.ResponseGenericDto> {
    return this.fnTeacherInUniversity.execute(
      idUniversity,
      search,
      parseInt(skipe),
      userDecorator,
    );
  }

  @UseGuards(ThrottlerGuard, AnalitycSearchQualificationTeacherGuard)
  @Throttle()
  @Get('university/:idUniversity')
  @ApiCreatedResponse({
    description: 'The teacher university has been successfully.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The teacher university has been failed by conflict.',
  })
  @ApiInternalServerErrorResponse({
    description: 'The teacher university has been failed by internal error.',
  })
  findTeachersCampare(
    @Param('idUniversity') idUniversity: string,
    @Body() requestTeacherCompare: requestTeacher.RequestTeachersCompareDto,
    @UserDecorator() userDecorator: UserDecoratorInterface,
  ): Promise<response.ResponseGenericDto> {
    return this.fnTeacherInUniversity.executeCompare(
      idUniversity,
      requestTeacherCompare,
      userDecorator,
    );
  }
}
