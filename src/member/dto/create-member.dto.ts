export class CreateMemberDto {
  memberId?: string;
  fullName: string;
  email: string;
  mobileNo: string;
  password: string;
  roles?: string[];
  gymId: string;
  services?: [
    {
      serviceId: string;
      rate: number;
      rateType: RATE_TYPE;
      serviceallocatedCount: number;
      serviceUsageCount: number;
    },
  ];
}

enum RATE_TYPE {
  'PER_SESSION' = 'PER_SESSION',
  'PER_MONTH' = 'PER_MONTH',
  'PER_YEAR' = 'PER_YEAR',
  'PER_DAY' = 'PER_DAY',
}
