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
  serviceType?: SERVICE_TYPE[];
  noOfOccurrence?: number;

}

export enum SERVICE_TYPE {
  INSTANCE = 'INSTANCE',
  RECURRING = 'RECURRING',
}
