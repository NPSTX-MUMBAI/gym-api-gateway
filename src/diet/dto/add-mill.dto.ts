export class AddMeallDTO {
    
    mealId:string;
    millType:millType;
    createdOn:string;
    createdBy:string;       //Gym name
    
    gymId?:string;
    userId?:string;
}

export enum millType {
    
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