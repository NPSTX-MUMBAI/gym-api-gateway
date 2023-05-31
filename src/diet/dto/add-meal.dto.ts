export class AddMealDTO {
    
    mealId:string;
    mealType?:mealType;
    createdOn:string;
    createdBy:string;       //Gym name
    
    gymId?:string;
    userId?:string;
    dietId:string;
}

export enum mealType {
    
    earlymorning = 'EARLYMORNING',
    breakfast = 'BREAKFAST',
    midmeal = 'MIDMEAL',
    lunch = 'LUNCH',
    preworkout = 'PREWORKOUT',
    postworkout = 'POSTWORKOUT',
    dinner = 'DINNER',
    bedtime = 'BEDTIME'

    // morning = 'MORNING',
    // evening = 'EVENING',


}