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

    if (search.length <= 3) {
      throw new exception.SearchMaxLengthException(`SEARCH_MAX_LENGTH`);
    }

    const countTeacherPromise = this.universityTeacherModel.countDocuments({
      idUniversity: mongoose.Types.ObjectId(idUniversity),
      searchTextKeys: {
        $elemMatch: {
          $regex: search,
          $options: 'mi',
        },
      },
    });

    const universityTeacherPromise = this.universityTeacherModel
      .find(
        {
          idUniversity: mongoose.Types.ObjectId(idUniversity),
          searchTextKeys: {
            $elemMatch: {
              $regex: search,
              $options: 'mi',
            },
          },
        },
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
}
