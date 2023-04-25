export class CreateBankDto {
  accountType: string;
  accountNo: string;
  ifsc: string;
  vpa?: string;
  gymId?: string;
  bankId?: string;
  accountHolderName: string;
  bankName: string;
  branchName: string;
}
