import { IsNumber, IsOptional } from "class-validator";

export class SignUpDTO {
    userId:string;
    fullName: string;
    email: string;
    mobileNo: number;
    password: string;
    roles: USER_ROLE[];

}

export enum USER_ROLE {

    OWNER = "OWNER",
    MEMBER = "MEMBER",
    ADMIN = 'ADMIN'
}