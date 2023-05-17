export class CreateBankDto {
  accountType: string;
  accountNo: string;
  ifsc: string;
  vpa?: string;
  gymId?: string;
  bankId?: string;
  accountHolderName: string;
  name: string;
  branchName: string;
  bankName: string;
  address: Address;


  id?: string;
  mid?: string;

  userid: string;
  packageId?: string;
  serviceId?: string;
}


export interface Address {

  line1?: string;

  line2: string;

  locality: string;

  city: string;

  state: string;

  country: string;

  pinCode: string;

}