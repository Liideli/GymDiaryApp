import { Group } from "./Group";

type GroupMessageResponse = {
  createGroup: {
    group: Group;
    message: string;
  };
};

export type { GroupMessageResponse };