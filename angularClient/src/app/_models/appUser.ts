import { Photo } from './photo';
import { Portfolio } from './portfolio';

export interface AppUser {
  id: number;
  email: string;
  username: string;
  age: number;
  created: Date;
  lastActive: Date;
  city: string;
  country: string;
  dateOfBirth: Date;
  photo?: Photo;
  portfolios: Portfolio[];
  investingStrategySummary: string;
}
