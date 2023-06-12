export class CreateExerciseDto {
  exId?: string;

  name: string;

  imgUrl?: string;

  createdOn?: string;

  isDefault: boolean;

  //   svcIds?: Array<ServicesDTO>;

  exerciseType?: exerciseType[];
}

export enum exerciseType {
  BICEPS = 'BICEPS',

  TRICEPS = 'TRICEPS',

  CHEST = 'CHEST',

  LEGS = 'LEGS',

  SHOULDER = 'SHOULDER',
}
