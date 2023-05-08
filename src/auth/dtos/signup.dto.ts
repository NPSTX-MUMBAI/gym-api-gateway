// import { IsNumber, IsOptional } from 'class-validator';
// import { Address } from 'src/gym/entities/gym.entity';

export class SignUpDTO {
  userId: string;
  fullName?: string;
  email: string;
  mobileNo: string;
  password: string;
  Address: Address[];
  roles: USER_ROLE[];
}

export interface Address {
  line1: string;
  line2: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export enum USER_ROLE {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}
