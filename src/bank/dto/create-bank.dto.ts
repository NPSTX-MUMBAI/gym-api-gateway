export class CreateBankDto {
  id?: string;
  accountType: string;
  accountNo: string;
  ifsc: string;
  mid: string;
  gymId?: string;
  bankId?: string;
  accountHolderName: string;
  bankName: string;
  branchName: string;
}
