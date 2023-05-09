import { Address } from '../entities/member.entity';

export class CreateMemberDto {
  userId?: string;
  fullName: string;
  email: string;
  mobileNo: string;
  password: string;
  roles?: string[];
  // gymId: string;
  address?: Address;
  svcId: string;
  rate: number;
  rateType: RATE_TYPE;
  serviceallocatedCount: number;
  serviceUsageCount: number;

  // gstNo: any;
  // aadhar: any;
  // serviceId: any;
  // rate: any;
  // rateType: any;
  id: any;
  // line1: any;
  // line2: any;
  // locality: any;
  // city: any;
  // state: any;
  // country: any;
  // pinCode: any;
  // svcId: any;
}

// services?: [
//     {

//     },
//   ];
enum RATE_TYPE {
  'PER_SESSION' = 'PER_SESSION',
  'PER_MONTH' = 'PER_MONTH',
  'PER_YEAR' = 'PER_YEAR',
  'PER_DAY' = 'PER_DAY',
}
