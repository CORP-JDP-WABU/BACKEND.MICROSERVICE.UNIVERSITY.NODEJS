import { Controller, UseGuards, Get } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

import * as services from './services';
import * as response from 'src/common/dto';
import * as exception from 'src/exception';

@Controller('university/v1.0')
@ApiTags('UNIVERSITY')
export class UniversityController {
 
    constructor(
        private readonly fnUniversityService: services.FnUniversityService
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
}
