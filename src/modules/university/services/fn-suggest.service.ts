import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';

@Injectable()
export class FnSuggestService {
  private logger = new Logger(FnSuggestService.name);

  constructor(
    @InjectModel(schemas.Suggests.name)
    private readonly suggestModel: mongoose.Model<schemas.SuggestsDocument>,
  ) {}

  async executeUniversity(
    university: string,
  ): Promise<response.ResponseGenericDto> {
    this.logger.debug(
      `::executeUniversity::parameters::${JSON.stringify(university)}`,
    );
    const lowercaseNoSpaces = this.lowercaseNoSpaces(university);

    const suggest = await this.suggestModel.findOne({
      'university.lowercaseNoSpaces': lowercaseNoSpaces,
    });

    if (!suggest) {
      await this.suggestModel.create({
        university: {
          name: university,
          lowercaseNoSpaces: lowercaseNoSpaces,
          coincidences: 0,
        },
      });
    } else {
      await this.suggestModel.findByIdAndUpdate(suggest._id, {
        $inc: { 'university.coincidences': 1 },
      });
    }
    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnSuggestService.name}::execute`,
      data: {
        isRegister: true,
      },
    };
  }

  private lowercaseNoSpaces(text: string): string {
    let textNoSpaces = text.replace(/\s/g, '');
    let textWithoutTilde = textNoSpaces
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    let textLowerCase = textWithoutTilde.toLowerCase();
    return textLowerCase;
  }
}
