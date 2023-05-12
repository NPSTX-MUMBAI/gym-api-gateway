export class ServiceDTO {
  name: string;
  imgUrl?: string;
  createdOn?: string;
  isDefault: boolean;
  rate: number;
  svcId: string;
  //   userid?: string;
  gymId?: string;
  //   packageId?: string;
  serviceType?: serviceType[];
  noOfOccurrence?: number;
}

export enum serviceType {
  INSTANCE = 'INSTANCE',
  RECURRING = 'RECURRING',
}
