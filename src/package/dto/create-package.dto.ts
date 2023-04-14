import { Service } from '../entities/package.entity';
export class CreatePackageDto {
  packageid?: string;
  name: string;
  description: string;
  service: Service;
  imgUrl: string;
  createdOn: string;
  createdBy: string;
  amount: number;
  validFrom: string;
  validTo: string;
  memberId: string;
}
