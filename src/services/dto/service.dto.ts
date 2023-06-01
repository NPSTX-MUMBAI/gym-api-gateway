export class ServiceDTO {

  gymId?: string;
  name: string;
  imgUrl?: string;
  createdOn?: string;
  isDefault: boolean;
  rate: number;
  serviceType?: serviceType[];
  noOfOccurrence?: number;
  isActive: any;

  svcId?: string;
  svcIds?: Array<ServicesDTO>;

  //   userid?: string;

  //   packageId?: string;


  // id?: string;
}

export class ServicesDTO {
  name: string;

  svcId: string;
}

export enum serviceType {
  INSTANCE = 'INSTANCE',

  RECURRING = 'RECURRING',
}
