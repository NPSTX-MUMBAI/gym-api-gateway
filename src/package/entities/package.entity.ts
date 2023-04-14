export class Package {
  packageid?: string;
  name: string;
  description: string;
  service: Service;
  imgUrl: string;
  createdOn: string;
  createdBy: string;
  amount: number;
  validFrom: string;
  validTo: string;
  memberId: string;
}

export class Service {
  serviceid?: string;
  name: string;
  rate: number;
  imgUrl?: string;
  gymId: string;
}
