import { Address } from "src/gym/entities/gym.entity";

export class CreateBankDto {
  id?: string;
  accountHoldername: string;
  accountType: string;
  accountNo: string;
  ifsc: string;
  mid: string;
  bankname: string;
  branchname: string;
  bankId?:string;
  address:Address
}
