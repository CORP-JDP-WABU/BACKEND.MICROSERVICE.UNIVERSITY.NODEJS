import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schemas from 'src/common/schemas';
import * as enums from 'src/common/enum';
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
    private readonly universityTeacherModel: mongoose.Model<schemas.UniversityTeacherDocument>,
    @InjectModel(schemas.UniversityCourseDoc.name)
    private readonly universityCourseDocModel: mongoose.Model<schemas.UniversityCourseDocDocument>,
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
            universityTeacherPromise,
            universityCourseDocPromise
        ] = await Promise.all([
            this.universityCourseModel.findById(idCourseMongoose),
            this.universityTeacherModel.find({ "courses._id": idCourseMongoose }),
            this.universityCourseDocModel.find({ "course.idCourse": idCourse })
        ])
        
        for (const universityTeacher of universityTeacherPromise) {
            const course = universityTeacher.courses.find(x => x._id.toString() === idCourse);
            if(course) {

                if(course.manyAverageQualifications > 0) {
                    averageQualification = course.manyAverageQualifications + averageQualification;
                    amountDivide = amountDivide++;
                }

                quantityComment = course.manyComments + quantityComment;
                teachers.push({
                    _id: universityTeacher._id,
                    firstName: universityTeacher.firstName,
                    lastName: universityTeacher.lastName,
                    averageQualification: course.manyAverageQualifications,
                    photoUrl: universityTeacher.url
                })
            }
        }

        let documents = {
            exams: 0,
            excercies: 0,
            notes: 0,
            summary: 0,
            presentations: 0,
            worked: 0,
            syllables: 0
        };
        if(universityCourseDocPromise.length > 0) {
            let allDocuments = [];
            for (const universityCourseDoc of universityCourseDocPromise) {
              allDocuments.push(universityCourseDoc.document)
            }
            documents = this.countDocumentsByType(allDocuments);
        }
        const newProfileCourse = await this.profileCourseModel.create({
            _id: universityCoursePromise._id,
            idUniversity: mongoose.Types.ObjectId(userDecorator.idUniversity),
            name: universityCoursePromise.name,
            averageQualification: averageQualification == 0 || amountDivide == 0 ? 0 : averageQualification/amountDivide,
            quantityComment,
            teachers,
            documents,
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
            documents: this.transforDocumentToArray(newProfileCourse.documents),
            teachers: newProfileCourse.teachers.map(x => {
                return {
                    idTeacher: x._id.toString(),
                    firstName: x.firstName,
                    averageQualification: x.averageQualification,
                    prothoUrl: x.photoUrl
                }
            })
        }
    }
  }
 
  private transforDocumentToArray(documents: any) : any[]{

    const { exams, excercies, notes, summary, presentations, worked, syllables } = documents;
    const totalQuantity = exams + excercies + notes + summary + presentations + worked + syllables;
    const transformDocumentsToArray = [
      {
          typeDocument: 'ALL',
          name: 'Ver todos',
          quantity: totalQuantity
      },
      {
          typeDocument: enums.DocumentTypeEnum.EXAMS,
          name: 'Exámenes',
          quantity: exams
      },
      {
        typeDocument: enums.DocumentTypeEnum.EXCERCIES,
        name: 'Ejercicios',
        quantity: excercies
      },
      {
        typeDocument: enums.DocumentTypeEnum.NOTES,
        name: 'Contenido de clases',
        quantity: notes
      },
      {
        typeDocument: enums.DocumentTypeEnum.SUMMARY,
        name: 'Resúmenes',
        quantity: summary
      },
      {
        typeDocument: enums.DocumentTypeEnum.PRESENTATIONS,
        name: 'Presentaciones',
        quantity: presentations
      },
      {
        typeDocument: enums.DocumentTypeEnum.WORKED,
        name: 'Trabajos finales',
        quantity: worked
      },
      {
        typeDocument: enums.DocumentTypeEnum.SYLLABLES,
        name: 'Sílabos',
        quantity: syllables
      }
    ];

    return transformDocumentsToArray;
  }

  private countDocumentsByType(documents: any[]) : any {
    const expectedTypes : string[] = Object.values(enums.DocumentTypeEnum).filter(
      value => typeof value === 'string'
    );
    const countsMap = new Map<string, number>();
    expectedTypes.forEach(type => countsMap.set(type, 0));

    documents.forEach(document => {
      const { documentType } = document;
      if (countsMap.has(documentType)) {
        countsMap.set(documentType, countsMap.get(documentType)! + 1);
      } else {
        countsMap.set(documentType, 1);
      }
    });

    const result: { [key: string]: number } = {};
    countsMap.forEach((count, documentType) => {
      result[documentType.toLowerCase()] = count;
    });
  
    return result;
  }

}