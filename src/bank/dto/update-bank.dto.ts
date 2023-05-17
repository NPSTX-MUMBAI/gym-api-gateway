import { PartialType } from '@nestjs/mapped-types';
import { Address } from 'src/gym/entities/gym.entity';
import { CreateBankDto } from './create-bank.dto';

export class UpdateBankDto{

    accountHolderName?: string;
    accountType?: string;
    accountNo?: string;
    ifsc?: string;
    bankName?: string;
    branchName?: string;
    address?:Address;
    vpa?:string
    mid?: string;   
  
    id?: string;
    bankId?:string;
    userid?:string;
    // gymId?:string;

}
