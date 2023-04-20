import { Address } from '../entities/gym.entity';

export class CreateGymDto {
  id?: string;
  name: string;
  email: string;
  panNo: string;
  gstNo: string;
  aadhar?: string;
  address: Address;
  userId: string;
}
