import { User } from './User';

type LoginMessageResponse = {
  login: {
    token?: string;
    message: string;
    user: User;
  };
}

export type { LoginMessageResponse };
