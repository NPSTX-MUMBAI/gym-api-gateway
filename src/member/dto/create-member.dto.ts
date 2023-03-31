import { isNotEmpty, IsNotEmpty } from "class-validator";

export class CreateMemberDto {
    id?: string;
    @IsNotEmpty()
    firstName: string;
    @IsNotEmpty()
    lastName: string;
    @IsNotEmpty()
    email: string;
    mobileNo: string;
    @IsNotEmpty()
    password: string;
    roles: string[];
    @IsNotEmpty()
    gymId: string;
}
