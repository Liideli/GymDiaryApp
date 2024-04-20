import { User } from './User';

type RegisterMessageResponse = {
  register: {
    message: string;
    user: User;
  };
}

export type { RegisterMessageResponse };