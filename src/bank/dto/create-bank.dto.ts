import { Address } from "src/gym/entities/gym.entity";

export class CreateBankDto {
  
  bankId:string;
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
  userid:string;
  // gymId?:string;
}
