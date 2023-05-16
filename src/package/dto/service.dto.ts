export class ServiceDTO {
  name: string;
  imgUrl?: string;
  createdOn?: string;
  isDefault: boolean;
  rate: number;
  svcId?: string;
  svcIds?: Array<ServicesDTO>;
  //   userid?: string;
  gymId?: string;
  //   packageId?: string;
  serviceType?: serviceType[];
  noOfOccurrence?: number;
  id?: string;
}

export class ServicesDTO {
  name: string;
  svcId: string;
}

export enum serviceType {
  INSTANCE = 'INSTANCE',
  RECURRING = 'RECURRING',
}
