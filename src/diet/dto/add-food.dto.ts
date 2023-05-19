export class AddFoodDTO {

    foodId:string;
    foodType:FoodType;
    foodName:string;

    
    mealId?:string;

}

export enum FoodType {
    veg = 'VEG',
    nonveg = 'NONVEG'
}