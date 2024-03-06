import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';

@Injectable()
export class FnTeacherAllCoursesService {
    private logger = new Logger(FnTeacherAllCoursesService.name);
    
    constructor(
        @InjectModel(schemas.UniversityTeacher.name)
        private readonly universityTeacherModel: mongoose.Model<schemas.UniversityTeacherDocument>,
        @InjectModel(schemas.UniversityCourse.name)
        private readonly universityCourseModel: mongoose.Model<schemas.UniversityCourseDocument>
    ) {

    }

    async execute(idTeacher: string, idCareer: string) {
        const [universityTeachers, universityCoursesInCareer, universityCoursesInOtherCareer ] = await Promise.all([
            this.universityTeacherModel.findById(idTeacher),
            this.universityCourseModel.find({ "teachers._id": new mongoose.Types.ObjectId(idTeacher), careers : { $in: [ mongoose.Types.ObjectId(idCareer) ] }}),
            this.universityCourseModel.find({ "teachers._id": new mongoose.Types.ObjectId(idTeacher), careers : { $ne: [ mongoose.Types.ObjectId(idCareer) ] }})
        ]);

        const { firstName, lastName, email } = universityTeachers;

        const idCourseInCareer = universityCoursesInCareer.map(x => x.id);
        const idCourseInOtherCareer = universityCoursesInOtherCareer.map(x => x.id);

        const courseInCareer = universityTeachers.courses.filter(x => idCourseInCareer.includes(x._id));
        const courseInOtherCareer = universityTeachers.courses.filter(x => idCourseInOtherCareer.includes(x._id));

        return <response.ResponseGenericDto>{
            message: 'Processo exitoso',
            operation: `::${FnTeacherAllCoursesService.name}::execute`,
            data: {
                teacher: {
                    firstName,
                    lastName,
                    information: '',
                    email,
                    averageQualification: 5,
                    quantityComment: 10,
                    quantityStudent: 10
                },
                courseInCareer,
                courseInOtherCareer
            }
          };
    }

    private generateCourseInCareer(idCareer: string, universityCourses: any[]) {

    }

    private generateCourseInOtherCareer(idCareer: string, universityCourses: any[]) {

    }
}