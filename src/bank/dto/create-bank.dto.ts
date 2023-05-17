export class CreateBankDto {
<<<<<<< HEAD
  accountType: string;
  accountNo: string;
  ifsc: string;
  vpa?: string;
  gymId?: string;
  bankId?: string;
  accountHolderName: string;
  name: string;
  branchName: string;
=======
  
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
>>>>>>> 903463badc3e04777d22ceff3d6b77434e8a271e
}
