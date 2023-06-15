export class AddDietDTO {
    
    dietId:string;
    dietType:string;        //Light, Medium, Heavy

    userId:string;
    mealId:string;
}

export enum dietType {
    
    light = 'LIGHT',
    medium = 'MEDIUM',
    heavy = 'HEAVY'
}