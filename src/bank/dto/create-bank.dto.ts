import { Address } from "src/gym/entities/gym.entity";

export class CreateBankDto {
  
  accountHoldername: string;
  accountType: string;
  accountNo: string;
  ifsc: string;
  mid: string;
  bankname: string;
  branchname: string;
  address:Address
  
  id?: string;
  bankId?:string;
  userid:string;
  gymId?:string;
  packageId?:string;
  serviceId?:string;
}
