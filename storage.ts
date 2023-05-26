import { makeAutoObservable } from "mobx";
import { configurePersistable, makePersistable } from "mobx-persist-store";
import * as SecureStore from "expo-secure-store";
import { Priority } from "./utils";

configurePersistable({
  storage: {
    setItem: async (key, data) => await SecureStore.setItemAsync(key, data),
    getItem: async (key) => (await SecureStore.getItemAsync(key)) ?? null,
    removeItem: async (key) => await SecureStore.deleteItemAsync(key),
  },
});

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  dueAt?: Date;
}

export interface NewTaskData {
  id?: string;
  title?: string;
  description?: string;
  priority?: Priority;
  dueAt?: Date;
}

class TaskStore {
  tasks: Task[] = [];
  currentTask: NewTaskData = {};

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, { name: "TaskStore", properties: ["tasks"] });
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  updateCurrentTaskData(data: NewTaskData) {
    this.currentTask = data;
  }

  toggleCompleted(taskId: string) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      const index = this.tasks.indexOf(task);
      this.tasks[index] = { ...task, completed: !task.completed };
    }
  }
}

export const storage = new TaskStore();
