import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { ITask } from '../../domain/tasks/interfaces/task.interface';
import { TaskStatusEnum } from '../../domain/tasks/enums/task-status.enum';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';
import { TaskStatus } from '../../domain/tasks/types/task-status';
import { IComment } from '../../domain/tasks/interfaces/comment.interface';
import { generateUniqueIdWithTimestamp } from '../../shared/utils/generate-unique-id-with-timestamp';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private todoTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.TODO),
  );
  readonly todoTasks = this.todoTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.TODO, tasks)),
  );

  private doingTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.DOING),
  );
  readonly doingTasks = this.doingTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.DOING, tasks)),
  );

  private doneTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.DONE),
  );
  readonly doneTasks = this.doneTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.DONE, tasks)),
  );

  addTask(taskInfos: ITaskFormControls) {
    const newTask: ITask = {
      ...taskInfos,
      status: TaskStatusEnum.TODO,
      id: generateUniqueIdWithTimestamp(),
      comments: [],
    };

    const currentList = this.todoTasks$.value;

    this.todoTasks$.next([...currentList, newTask]);
  }

  updateTaskStatus(taskId: string, taskCurrentSatatus: TaskStatus, taskNextStatus: TaskStatus) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentSatatus);
    const nextTaskList = this.getTaskListByStatus(taskNextStatus);
    const currentTask = currentTaskList.value.find((task) => task.id === taskId);

    if (currentTask) {
      currentTask.status = taskNextStatus;

      const currentTaskListWithoutTask = currentTaskList.value.filter((task) => task.id !== taskId);

      currentTaskList.next([...currentTaskListWithoutTask]);

      nextTaskList.next([...nextTaskList.value, { ...currentTask }]);
    }
  }

  updateTaskNameAndDescription(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    newTaskName: string,
    newTaskDescription: string,
  ) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskIndex = currentTaskList.value.findIndex((task) => task.id === taskId);

    if (currentTaskIndex > -1) {
      const updatedTaskList = [...currentTaskList.value];

      updatedTaskList[currentTaskIndex] = {
        ...updatedTaskList[currentTaskIndex],
        name: newTaskName,
        description: newTaskDescription,
      };

      currentTaskList.next(updatedTaskList);
    }
  }

  updateTaskComments(taskId: string, taskCurrentStatus: TaskStatus, newTaskComments: IComment[]) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskIndex = currentTaskList.value.findIndex((task) => task.id === taskId);

    if (currentTaskIndex > -1) {
      const updatedTaskList = [...currentTaskList.value];

      updatedTaskList[currentTaskIndex] = {
        ...updatedTaskList[currentTaskIndex],
        comments: [...newTaskComments],
      };

      currentTaskList.next(updatedTaskList);
    }
  }

  deleteTask(taskId: string, taskCurrentSatatus: TaskStatus) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentSatatus);

    const newTaskList = currentTaskList.value.filter((task) => task.id !== taskId);

    currentTaskList.next(newTaskList);
  }

  private loadTasksFromLocalStorage(key: string) {
    try {
      const storedTasks = localStorage.getItem(key);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Erro ao carregar tarefas do Local Storage', error);
      return [];
    }
  }

  private saveTasksOnLocalStorage(key: string, tasks: ITask[]) {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no Local Storage', error);
    }
  }

  private getTaskListByStatus(taskStatus: TaskStatus) {
    const taskListObj = {
      [TaskStatusEnum.TODO]: this.todoTasks$,
      [TaskStatusEnum.DOING]: this.doingTasks$,
      [TaskStatusEnum.DONE]: this.doneTasks$,
    };

    return taskListObj[taskStatus];
  }
}
