import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as exception from 'src/exception';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';
import * as teacherDto from '../dto';

import { UserDecoratorInterface } from 'src/common/interfaces';

@Injectable()
export class FnTeacherInUniversityService {
  private logger = new Logger(FnTeacherInUniversityService.name);

  constructor(
    @InjectModel(schemas.UniversityTeacher.name)
    private readonly universityTeacherModel: mongoose.Model<schemas.UniversityTeacherDocument>,
  ) {}

  async execute(
    idUniversity: string,
    search: string,
    skipe: number,
    userDecoratorInterface: UserDecoratorInterface,
  ) {
    if (idUniversity != userDecoratorInterface.idUniversity) {
      throw new exception.UnahutorizedUniversityCustomException(
        `UNAUTHORIZED_UNIVERSITY`,
      );
    }

    if (search.length <= 3 && search.length > 0) {
      throw new exception.SearchMaxLengthException(`SEARCH_MIN_LENGTH`);
    }

    if (search.length > 50) {
      throw new exception.SearchMaxLengthException(`SEARCH_MAX_LENGTH`);
    }

    let query = {
      idUniversity: mongoose.Types.ObjectId(idUniversity)
    };
    
    if (search !== '') {
        query['searchTextKeys'] = {
            $elemMatch: {
                $regex: search,
                $options: 'mi',
            },
        };
    }

    const countTeacherPromise = this.universityTeacherModel.countDocuments(query);

    const universityTeacherPromise = this.universityTeacherModel
      .find(
        query,
        {
          _id: 1,
          firstName: 1,
          lastName: 1,
          url: 1,
          courses: 1,
        },
      )
      .skip(skipe > 0 ? (skipe - 1) * 10 : 0)
      .limit(10);

    const [universityTeacher, countTeacher] = await Promise.all([
      universityTeacherPromise,
      countTeacherPromise,
    ]);

    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnTeacherInUniversityService.name}::execute`,
      data: {
        teacher: universityTeacher.map((teacher) => {
          const manyComments = this.sumProperty(
            teacher.courses,
            'manyComments',
          );
          const manyAverageAllQualifications = this.sumPropertyAverage(
            teacher.courses,
            'manyAverageQualifications',
          );
          const manyAllQualifications = this.sumProperty(
            teacher.courses,
            'manyQualifications',
          );

          return {
            idTeacher: teacher.id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            manyComments,
            manyQualifications: Number.isNaN(manyAllQualifications)
              ? 0
              : manyAllQualifications,
            manyAverageQualifications: Number.isNaN(
              manyAverageAllQualifications,
            )
              ? 0
              : manyAverageAllQualifications,
            photoUrl: teacher.url,
          };
        }),
        totalTeacher: countTeacher,
      },
    };
  }

  async executeCompare(
    idUniversity: string,
    requestTeacherCompare: teacherDto.RequestTeachersCompareDto,
    userDecoratorInterface: UserDecoratorInterface,
  ) {
    if (idUniversity != userDecoratorInterface.idUniversity) {
      throw new exception.UnahutorizedUniversityCustomException(
        `UNAUTHORIZED_UNIVERSITY`,
      );
    }

    const teachers = await this.universityTeacherModel.find({
      idUniversity: mongoose.Types.ObjectId(idUniversity),
      _id: {
        $in: requestTeacherCompare.idTeachers.map((x) =>
          mongoose.Types.ObjectId(x),
        ),
      },
    });

    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnTeacherInUniversityService.name}::execute`,
      data: teachers.map((teacher) => {
        const manyComments = this.sumProperty(teacher.courses, 'manyComments');
        const manyAverageAllQualifications = this.sumPropertyAverage(
          teacher.courses,
          'manyAverageQualifications',
        );
        const manyAllQualifications = this.sumProperty(
          teacher.courses,
          'manyQualifications',
        );

        const courses = teacher.courses;
        const { lear, hight, goodPeople, worked, late, assistance } =
          this.sumPropertyRequiredOptionalAverage(courses);

        return {
          idTeacher: teacher.id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          manyComments,
          manyQualifications: Number.isNaN(manyAllQualifications)
            ? 0
            : manyAllQualifications,
          manyAverageQualifications: Number.isNaN(manyAverageAllQualifications)
            ? 0
            : manyAverageAllQualifications,
          photoUrl: teacher.url,
          requiredQualification: {
            lear,
            hight,
            goodPeople,
          },
          optionalQualification: {
            worked,
            late,
            assistance,
          },
        };
      }),
    };
  }

  private sumProperty(arr, prop) {
    return arr.reduce((previous, current) => previous + current[prop], 0);
  }

  private sumPropertyAverage(arr, prop) {
    let sum = 0;
    let count = 0;
    arr.forEach((item) => {
      if (item[prop] > 0) {
        sum += item[prop];
        count++;
      }
    });
    return count == 0 ? 0 : count > 0 && sum > 0 ? sum / count : 0;
  }

  private sumPropertyRequiredOptionalAverage(courses) {
    let sumRequiredQualificationLear = 0;
    let sumRequiredQualificationHight = 0;
    let sumRequiredQualificationGoodPeople = 0;
    let countRequiredQualificationLear = 0;
    let countRequiredQualificationHight = 0;
    let countRequiredQualificationGoodPeople = 0;

    let sumOptionalQualificationWorked = 0;
    let countOptionalQualificationWorked = 0;
    let sumOptionalQualificationLate = 0;
    let countOptionalQualificationLate = 0;
    let sumOptionalQualificationAssistance = 0;
    let countOptionalQualificationAssistance = 0;

    courses.forEach((course) => {
      const requiredQualificationLear = course.requiredQualifications.find(
        (x) => x.qualification.value == 'REQUIRED_CALIFICATION_LEARN',
      );
      const requiredQualificationHight = course.requiredQualifications.find(
        (x) => x.qualification.value == 'REQUIRED_CALIFICATION_HIGHT',
      );
      const requiredQualificationGoodPeople =
        course.requiredQualifications.find(
          (x) => x.qualification.value == 'REQUIRED_CALIFICATION_GOOD_PEOPLE',
        );

      if (
        requiredQualificationLear &&
        requiredQualificationLear.averageQualification > 0
      ) {
        sumRequiredQualificationLear =
          sumRequiredQualificationLear +
          requiredQualificationLear.averageQualification;
        countRequiredQualificationLear++;
      }

      if (
        requiredQualificationHight &&
        requiredQualificationHight.averageQualification > 0
      ) {
        sumRequiredQualificationHight =
          sumRequiredQualificationHight +
          requiredQualificationHight.averageQualification;
        countRequiredQualificationHight++;
      }

      if (
        requiredQualificationGoodPeople &&
        requiredQualificationGoodPeople.averageQualification > 0
      ) {
        sumRequiredQualificationGoodPeople =
          sumRequiredQualificationGoodPeople +
          requiredQualificationGoodPeople.averageQualification;
        countRequiredQualificationGoodPeople++;
      }

      const optionalQualificationWorked = course.optionalQualifications.find(
        (x) => x.qualification.value == 'OPTIONAL_CALIFICATION_WORKED',
      );
      const optionalQualificationLate = course.optionalQualifications.find(
        (x) => x.qualification.value == 'OPTIONAL_CALIFICATION_LATE',
      );
      const optionalQualificationAssistance =
        course.optionalQualifications.find(
          (x) => x.qualification.value == 'OPTIONAL_CALIFICATION_ASSISTANCE',
        );

      if (
        optionalQualificationWorked &&
        optionalQualificationWorked.averageQualification > 0
      ) {
        sumOptionalQualificationWorked =
          sumOptionalQualificationWorked +
          optionalQualificationWorked.averageQualification;
        countOptionalQualificationWorked++;
      }

      if (
        optionalQualificationLate &&
        optionalQualificationLate.averageQualification > 0
      ) {
        sumOptionalQualificationLate =
          sumOptionalQualificationLate +
          optionalQualificationLate.averageQualification;
        countOptionalQualificationLate++;
      }

      if (
        optionalQualificationAssistance &&
        optionalQualificationAssistance.averageQualification
      ) {
        sumOptionalQualificationAssistance =
          sumOptionalQualificationAssistance +
          optionalQualificationAssistance.averageQualification;
        countOptionalQualificationAssistance++;
      }
    });

    return {
      lear:
        countRequiredQualificationLear == 0
          ? 0
          : countRequiredQualificationLear > 0 &&
            sumRequiredQualificationLear > 0
          ? sumRequiredQualificationLear / countRequiredQualificationLear
          : 0,
      hight:
        countRequiredQualificationHight == 0
          ? 0
          : countRequiredQualificationHight > 0 &&
            sumRequiredQualificationHight > 0
          ? sumRequiredQualificationHight / countRequiredQualificationHight
          : 0,
      goodPeople:
        countRequiredQualificationGoodPeople == 0
          ? 0
          : countRequiredQualificationGoodPeople > 0 &&
            sumRequiredQualificationGoodPeople > 0
          ? sumRequiredQualificationGoodPeople /
            countRequiredQualificationGoodPeople
          : 0,
      worked:
        countOptionalQualificationWorked == 0
          ? 0
          : countOptionalQualificationWorked > 0 &&
            sumOptionalQualificationWorked > 0
          ? sumRequiredQualificationLear / countOptionalQualificationWorked
          : 0,
      late:
        countOptionalQualificationLate == 0
          ? 0
          : countOptionalQualificationLate > 0 &&
            sumOptionalQualificationLate > 0
          ? sumOptionalQualificationLate / countOptionalQualificationLate
          : 0,
      assistance:
        countOptionalQualificationAssistance == 0
          ? 0
          : countOptionalQualificationAssistance > 0 &&
            sumOptionalQualificationAssistance > 0
          ? sumOptionalQualificationAssistance /
            countOptionalQualificationAssistance
          : 0,
    };
  }
}
