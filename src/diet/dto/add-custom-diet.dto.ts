export class AddCustomDietDTO {

      dietId:string;
      isVeg:IsVeg;
      dietType:string;
  
      breakfast?:boolean;
      lunch:boolean;
      salad:boolean;
      shakes:boolean;    
      
      fruits:string;
      userId?:string;
      mealId?:string;
  }
  
  export enum IsVeg {
      veg = 'VEG',
      nonveg = 'NONVEG'
  }
  