export class AddDietDTO {
    dietId:string;
    isVeg:IsVeg;
    dietType:string;

    breakfast?:boolean;
    lunch:boolean;
    salad:boolean;
    shakes:boolean;    
    
    fruits:string;
    userId?:string;

}

export enum IsVeg {
    veg = 'VEG',
    nonveg = 'NONVEG'
}
