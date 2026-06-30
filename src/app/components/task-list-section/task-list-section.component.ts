import { Component, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskService } from '../../services/task.service';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-list-section',
  imports: [TaskCardComponent, CdkDropList, CdkDrag],
  templateUrl: './task-list-section.component.html',
  styleUrl: './task-list-section.component.css',
})
export class TaskListSectionComponent {
  todoTasks: ITask[] = [];
  doingTasks: ITask[] = [];
  doneTasks: ITask[] = [];

  private readonly _taskService = inject(TaskService);

  ngOnInit() {
    this._taskService.todoTasks.subscribe((todoTasks) => {
      this.todoTasks = todoTasks;
    });
    this._taskService.doingTasks.subscribe((doingTasks) => {
      this.doingTasks = doingTasks;
    });
    this._taskService.doneTasks.subscribe((doneTasks) => {
      this.doneTasks = doneTasks;
    });
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
