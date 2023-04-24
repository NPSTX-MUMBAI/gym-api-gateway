import { Address } from "src/gym/entities/gym.entity";

export class CreateBankDto {
  
  accountHolderName: string;
  accountType: string;
  accountNo: string;
  ifsc: string;
  name: string;
  branchName: string;
  address:Address
  
  id?: string;
  mid?: string;   
  bankId?:string;
  userid:string;
  gymId?:string;
  packageId?:string;
  serviceId?:string;
}
