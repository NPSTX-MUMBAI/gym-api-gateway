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
    
    earlymorning = 'EARLYMORNING',          //   h
    breakfast = 'BREAKFAST',                //   h m l
    midmeal = 'MIDMEAL',                    //   h 
    lunch = 'LUNCH',                        //   h m l
    preworkout = 'PREWORKOUT',              //   h m 
    postworkout = 'POSTWORKOUT',            //   h l 
    dinner = 'DINNER',                      //   h m l
    bedtime = 'BEDTIME'                     //   h m 

    // morning = 'MORNING',
    // evening = 'EVENING',


}