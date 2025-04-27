export type StatusList = "todo" | "inprogress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: StatusList;
}
