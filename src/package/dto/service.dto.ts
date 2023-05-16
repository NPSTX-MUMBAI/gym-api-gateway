export class ServiceDTO{
    name:string;
    imgUrl?: string;
    createdOn?:string;
    isDefault:boolean;
    rate:number;
    svcId: string;
    serviceType?: serviceType[];
    noOfOccurence?:number;
    id?:string;
    gymId?:string
}
export enum serviceType {
 INSTANCE = 'INSTANCE',
 RECURRING = 'RECURRING',

}

