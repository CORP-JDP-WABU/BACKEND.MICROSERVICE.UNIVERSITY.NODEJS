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
@Controller('course/v1.0')
@ApiTags('COURSE')
export class CourseController {
  constructor(
    private readonly FnFindTeachersService: services.FnFindTeachersService,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Throttle()
  @Get(':idCourse/teachers')
  @ApiCreatedResponse({
    description: 'The al teachers in course has been successfully.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The al teachers in course has been failed by conflict.',
  })
  @ApiInternalServerErrorResponse({
    description: 'The al teachers in course has been failed by internal error.',
  })
  findAllTeachersInCourse(
    @Param('idCourse') idCourse: string,
    @UserDecorator() userDecorator: UserDecoratorInterface,
  ): Promise<response.ResponseGenericDto> {
    return this.FnFindTeachersService.execute(idCourse, userDecorator);
  }
}
