import { Controller, UseGuards, Get, Post, Body, Param } from '@nestjs/common';
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
import * as request from 'src/modules/university/dto';
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
}
