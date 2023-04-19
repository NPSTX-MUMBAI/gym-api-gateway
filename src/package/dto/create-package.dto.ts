export class CreatePackageDto {
  id: string;
  name: string;
  description: string;
  imgUrl?: string;
  services?: any;
  amount: number;
  validFrom: string;
  validTo: string;
  gymId?: string;
}
