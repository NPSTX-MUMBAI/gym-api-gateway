import { Address } from "src/gym/entities/gym.entity";

export class CreateBankDto {
  
  accountHolderName: string;
  accountType: string;
  accountNo: string;
  ifsc: string;
  bankName: string;
  branchName: string;
  address:Address
  vpa:string
  mid?: string;   

  id?: string;
  bankId?:string;
  userid:string;
  // gymId?:string;
}
