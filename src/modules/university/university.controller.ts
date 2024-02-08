import { Controller, UseGuards, Get, Post, Body, Param, Query } from '@nestjs/common';
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
import { AnalitycSearchCourseTeacherGuard, SecurityGuard } from 'src/common/guard';
import { UserDecorator } from 'src/common/decorator';
import { UserDecoratorInterface } from 'src/common/interfaces';

@Controller('university/v1.0')
@ApiTags('UNIVERSITY')
export class UniversityController {
  constructor(
    private readonly fnUniversityService: services.FnUniversityService,
    private readonly fnUniversityCourseTeacherService: services.FnUniversityCourseTeacherService,
    private readonly fnSuggestUniversityService: services.FnSuggestService,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Throttle()
  @Get('')
  @ApiCreatedResponse({
    description: 'The university has been successfully.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The university has been failed by conflict.',
  })
  @ApiInternalServerErrorResponse({
    description: 'The university has been failed by internal error.',
  })
  findAll(): Promise<response.ResponseGenericDto> {
    return this.fnUniversityService.execute();
  }

  @ApiBearerAuth()
  @UseGuards(SecurityGuard, ThrottlerGuard, AnalitycSearchCourseTeacherGuard)
  @Throttle()
  @Get(':idUniversity/course/teacher/:skipe/')
  @ApiCreatedResponse({
    description: 'The university course and teacher has been successfully.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description:
      'The university course and teacher has been failed by conflict.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'The university course and teacher has been failed by internal error.',
  })
  findAllTeacherAndCourse(
    @Param('idUniversity') idUniversity: string,
    @Param('skipe') skipe: string,
    @Query('search') search: string,
    @UserDecorator() userDecorator: UserDecoratorInterface,
  ): Promise<response.ResponseGenericDto> {
    return this.fnUniversityCourseTeacherService.execute(
      idUniversity,
      search,
      parseInt(skipe),
      userDecorator,
    );
  }

  @UseGuards(ThrottlerGuard)
  @Throttle()
  @Post('suggest')
  @ApiCreatedResponse({
    description: 'The university has been successfully.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The university has been failed by conflict.',
  })
  @ApiInternalServerErrorResponse({
    description: 'The university has been failed by internal error.',
  })
  suggest(
    @Body() requestSuggestUniversity: request.RequestSuggestUniversityDto,
  ): Promise<response.ResponseGenericDto> {
    return this.fnSuggestUniversityService.executeUniversity(
      requestSuggestUniversity.university,
    );
  }
}
