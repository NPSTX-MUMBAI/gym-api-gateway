import { Address } from "../entities/gym.entity";

export class CreateGymDto {
    name: string;
    email: string;
    panNo: string;
    gstNo: string;
    aadhar?: string;
    address: Address;
    createdBy?: string;
    id: any;
    createdOn:string;
    createdTime:string;
    rate:string;
    gymId?: string;
    // memberId?:String;
    userId?:string;
    // pkgId:string;
    svcId?:string;
    bankId?:string;
    
}
