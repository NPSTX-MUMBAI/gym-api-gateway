import { Address } from "../entities/gym.entity";

export class CreateGymDto {
    id?: string;
    gymName: string;
    mobileNo: number;
    email: string;
    state?: string;
    city?: string;
    panNo: string;
    gstNo: string;
    aadhar?: string;
    address: Address;
    createdBy?: string;
}



