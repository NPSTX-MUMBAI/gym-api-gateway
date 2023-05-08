import { Address } from "src/gym/entities/gym.entity";

export class linkGymidToBank {
  accountHolderName: string;
  accountType: string;
  accountNo: string;
  ifsc: string;
  bankName: string;
  branchName: string;
  address: Address;
  vpa: string;

  id?: string;
  mid?: string;

  bankId?: string;
  gymId?: string;
}
