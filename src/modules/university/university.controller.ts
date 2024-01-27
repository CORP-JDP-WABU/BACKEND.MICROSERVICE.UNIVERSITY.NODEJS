import { Controller, UseGuards, Get, Post, Body, Param } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

import * as services from './services';
import * as response from 'src/common/dto';
import * as request from 'src/modules/university/dto';

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

  @UseGuards(ThrottlerGuard)
  @Throttle()
  @Get(':idUniversity/course/teacher/')
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
  findAllTeacherAndCourse(@Param("idUniversity") idUniversity: string ): Promise<response.ResponseGenericDto> {
    return this.fnUniversityCourseTeacherService.execute(idUniversity);
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
