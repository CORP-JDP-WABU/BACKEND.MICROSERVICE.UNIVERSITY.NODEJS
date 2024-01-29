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

@ApiBearerAuth()
@UseGuards(SecurityGuard, ThrottlerGuard)
@Controller('teacher/v1.0')
@ApiTags('TEACHER')
export class TeacherController {
  constructor(
    private readonly fnTeacherInCourseService: services.FnTeacherInCourseService,
  ) {}

  @UseGuards(ThrottlerGuard)
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
}