export class AddMeallDTO {
    
    mealId:string;
    millType:millType;
    createdOn:string;
    createdBy:string;       //Gym name

    gymId?:string;
    userId?:string;
}

export enum millType {

    breakfast = 'BREAKFAST',
    lunch = 'LUNCH',
    morning = 'MORNING',
    evening = 'EVENING',


}