import { PartialType } from '@nestjs/mapped-types';

import { ServiceDTO } from './service.dto';

export class updateService extends PartialType(ServiceDTO) {
  name: any;

  rate: any;
}
