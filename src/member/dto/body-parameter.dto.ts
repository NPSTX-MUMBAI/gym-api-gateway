import { IsNumber } from 'class-validator';

export class CreateBodydto {
  bodyId: string;

  height: number;

  weight: number;

  neck: number;

  shoulder: number;

  chest: number;

  biceps: number;

  waist: number;

  hips: number;

  thighs: number;

  rightarmFlex: number;

  leftarmFlex: number;

  calves: number;

  userId?: string;

  memberId?: string;
}
