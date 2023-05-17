import { USER_ROLE } from "src/auth/dtos/signup.dto";

export interface User {
    userId: string;
    fullName: string;
    email: string;
    mobileNo: number;
    password: string;
    roles: USER_ROLE[];
}




