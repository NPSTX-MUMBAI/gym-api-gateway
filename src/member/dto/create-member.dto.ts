export class CreateMemberDto {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    password: string;
    roles: string[];
    gymId: string;
}
