export class AssociateSvcDto {




    memberId:string;

    services: Array<{

        svcId:string,

        rate:string

    }>

    

    userId?:string;

    gymId?:string;

    svcId?:string;

}