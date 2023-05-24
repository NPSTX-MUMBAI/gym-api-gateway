import { CreateBodydto } from './body-parameter.dto';

import { PartialType } from '@nestjs/mapped-types';

export class updateBodyparameter extends PartialType(CreateBodydto) {
  chest: any;
   
  height: any;

  weight: any;
  neck:any;
}
