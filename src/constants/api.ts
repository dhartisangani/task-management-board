import { Task } from "@/types/Types";

export const API = {
    TASKS: "https://jsonplaceholder.typicode.com/todos",
  };
  
export const dummyTasks: Task[] = [
    {
      id: "1",
      title: "Create Landing Page",
      description: "Design and develop the main landing page for the website.",
      status: "todo",
    },
    {
      id: "2",
      title: "Fix Login Bug",
      description: "Resolve login issue where users are redirected incorrectly.",
      status: "inprogress",
    },
    {
      id: "3",
      title: "Write Unit Tests",
      description: "Add unit tests for the user authentication module.",
      status: "todo",
    },
    {
      id: "4",
      title: "Deploy to Staging",
      description: "Deploy the latest build to the staging environment.",
      status: "done",
    },
    {
      id: "5",
      title: "Update Documentation",
      description: "Revise the API documentation for the new endpoints.",
      status: "inprogress",
    },
    {
      id: "6",
      title: "Set Up CI/CD",
      description: "Configure continuous integration and deployment pipelines.",
      status: "done",
    },
  ];
  