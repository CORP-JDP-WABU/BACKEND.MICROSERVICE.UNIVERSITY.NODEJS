import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';
import * as universityDto from '../dto';
@Injectable()
export class FnUniversityService {

    private logger = new Logger(FnUniversityService.name);

    constructor(
        @InjectModel(schemas.Universities.name)
        private readonly universityModel: mongoose.Model<schemas.UniversitiesDocument>,
    ) {}

    async execute(): Promise<response.ResponseGenericDto> {
      const findAllUniversities = await this.universityModel.find({ "auditProperties.status.code": 1 }, { _id:1, name: 1, carrers: 1 });  
    
      const universities : universityDto.ResponseUniversityDto[] = findAllUniversities.map(university => {
        
        const careers: any[]  = university.careers.map(carrer => {
            return {
                idCarrer: String(carrer.idCareer),
                name: carrer.name
            }
        })
        
        return {
            idUniversity: university.id,
            name: university.name,
            careers: careers
        }
        
      })

      return <response.ResponseGenericDto>{
        message: 'Processo exitoso',
        operation: `::${FnUniversityService.name}::execute`,
        data: universities
      };
    }

}