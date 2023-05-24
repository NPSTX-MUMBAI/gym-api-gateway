import { PartialType } from '@nestjs/mapped-types';
import { AddCustomDietDTO } from './add-custom-diet.dto';

export class UpdateDietDto extends PartialType(AddCustomDietDTO) {}
