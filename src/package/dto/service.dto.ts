export class ServiceDTO {

  name: string;
  imgUrl?: string;
  createdOn?: string;
  isDefault: boolean;
  rate: number;
  svcId: string;
  //   userid?: string;
  gymId?: string;
  memeberId?: string;
  serviceType?: serviceType[];
  noOfOccurrence?: number;

}

export enum serviceType {
  INSTANCE = 'INSTANCE',
  RECURRING = 'RECURRING',
}
