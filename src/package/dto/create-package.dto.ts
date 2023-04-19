export class CreatePackageDto {
  id?: string;
  name: string;
  description: string;
  imgUrl?: string;
  validFrom?: string;
  validTo?: string;
  gymId?: string;
}
