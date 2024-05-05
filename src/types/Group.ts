import { User } from "./User";

type Group = {
  id: string;
  name: string;
  description: string;
  owner: User;
  members: User[];
};

type GroupData = {
  group: Group;
};

type ResponseData = {
  data: GroupData;
};

export type { Group, GroupData, ResponseData };