export class ServiceDTO {

  svcId: string;
  name: string;
  imgUrl?: string;
  createdOn?: string;
  isDefault: boolean;
  rate: number;
  userid?: string;
  isActive: string;

  gymid?: string;
  svcType: string;
  gymId?: string;
  serviceType?: SERVICE_TYPE
}


export enum SERVICE_TYPE {
  INSTANCE = 'INSTANCE',
  RECURRING = 'RECURRING',
}