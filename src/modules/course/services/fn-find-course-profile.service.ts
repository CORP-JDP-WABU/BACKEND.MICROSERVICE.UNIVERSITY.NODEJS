import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schemas from 'src/common/schemas';
import * as exception from 'src/exception';
import * as response from 'src/common/dto';
import * as dto from '../dto';
import { UserDecoratorInterface } from 'src/common/interfaces';

@Injectable()
export class FnFindCourseProfileService {

  private logger = new Logger(FnFindCourseProfileService.name);

  constructor(
    @InjectModel(schemas.ProfileCourse.name)
    private readonly profileCourseModel: mongoose.Model<schemas.ProfileCourseDocument>,
    @InjectModel(schemas.UniversityCourse.name)
    private readonly universityCourseModel: mongoose.Model<schemas.UniversityCourseDocument>,
    @InjectModel(schemas.UniversityTeacher.name)
    private readonly universityTeacherModel: mongoose.Model<schemas.UniversityTeacherDocument>
  ) {}

  async execute(idCourse: string, userDecorator: UserDecoratorInterface) {
    const idCourseMongoose = mongoose.Types.ObjectId(idCourse);

    const profileCourse = await this.profileCourseModel.findById(idCourseMongoose);

    if(!profileCourse) {

        let teachers = [];
        let averageQualification = 0;
        let amountDivide = 0;
        let quantityComment = 0;

        const [
            universityCoursePromise,
            universityTeacherPromise
        ] = await Promise.all([
            this.universityCourseModel.findById(idCourseMongoose),
            this.universityTeacherModel.find({ "courses._id": idCourseMongoose })
        ])
        
        for (const universityTeacher of universityTeacherPromise) {
            const course = universityTeacher.courses.find(x => x._id.toString() === idCourse);
            if(course) {
                averageQualification = course.manyAverageQualifications + averageQualification;
                amountDivide = amountDivide++;
                quantityComment = course.manyComments + quantityComment;
                teachers.push({
                    _id: universityTeacher._id,
                    firstName: universityTeacher.firstName,
                    lastName: universityTeacher.lastName,
                    averageQualification: course.manyAverageQualifications
                })
            }
        }

        const newProfileCourse = await this.profileCourseModel.create({
            _id: universityCoursePromise._id,
            idUniversity: mongoose.Types.ObjectId(userDecorator.idUniversity),
            name: universityCoursePromise.name,
            averageQualification: averageQualification/amountDivide,
            quantityComment,
            teachers,
            documents: {
                exams: 0,
                summaries: 0
            },
            auditProperties: {
                status: {
                    code: 1,
                    description: 'REGISTER'
                },
                dateCreate: new Date(),
                dateUpdate: null,
                userCreate: userDecorator.email,
                userUpdate: null,
                recordActive: true
            }
        });

        return this.returnCourseProfile(newProfileCourse);
    }

    return this.returnCourseProfile(profileCourse);

  }


  private returnCourseProfile(newProfileCourse: schemas.ProfileCourseDocument) {
    return <response.ResponseGenericDto> {
        message: 'Processo exitoso',
        operation: `::${FnFindCourseProfileService.name}::execute`,
        data: <dto.ResponseProfileCourseDto>{
            idCourse: newProfileCourse._id,
            course: newProfileCourse.name,
            quantityComment: newProfileCourse.quantityComment,
            averageQualification: newProfileCourse.averageQualification,
            documents: {
                exams: newProfileCourse.documents.exams,
                summaries: newProfileCourse.documents.summaries
            },
            teachers: newProfileCourse.teachers.map(x => {
                return {
                    idTeacher: x._id.toString(),
                    firstName: x.firstName,
                    averageQualification: x.averageQualification
                }
            })
        }
    }
  }
  
}