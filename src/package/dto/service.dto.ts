export class ServiceDTO {

  name: string;
  isDefault: IS_DEFAULT;
  isActive: IS_ACTIVE;
  // rate: number;
  svcId: string;

  imgUrl?: string;
  createdOn?: string;
  gymId?: string;
  memeberId?: string;
  serviceType?: SERVICE_TYPE[];
  noOfOccurrence?: number;

}

export enum SERVICE_TYPE {
  INSTANCE = 'INSTANCE',
  RECURRING = 'RECURRING',
}

export enum IS_DEFAULT {
  default = 'DEFAULT',
  custom =  'CUSTOM'
}

export enum IS_ACTIVE {
  true = "TRUE",
  false = "FALSE"
}
