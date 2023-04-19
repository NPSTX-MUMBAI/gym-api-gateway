export class CreateMemberDto {
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    password: string;   
    roles: string[];
    gymId: string;

    memberId?: string;
    
}
