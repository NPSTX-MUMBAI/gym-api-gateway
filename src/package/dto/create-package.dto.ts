export class CreatePackageDto {
  name: string;
  description: string;
  imgUrl?: string;
  createdBy?: string;
  createdOn?: string;
  createTime:string;
  services?: any;
  amount: number;
  validFrom: string;
  validTo: string;
  
  packageId: string;
  gymId?: string;
  svcId:string;

}
