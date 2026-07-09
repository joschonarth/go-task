import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IComment } from '../../interfaces/comment.interface';
import { generateUniqueIdWithTimestamp } from '../../utils/generate-unique-id-with-timestamp';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css',
})
export class TaskCommentsModalComponent {
  taskCommentsChanged = false;
  commentControl = new FormControl('', [Validators.required]);

  readonly _task: ITask = inject(DIALOG_DATA);
  readonly _dialogRef: DialogRef<boolean> = inject(DialogRef);

  onAddComment() {
    console.log(this.commentControl.value);

    const newComment: IComment = {
      id: generateUniqueIdWithTimestamp(),
      description: this.commentControl.value ? this.commentControl.value : '',
    };

    this._task.comments.unshift(newComment);

    this.commentControl.reset();

    this.taskCommentsChanged = true;
  }

  onCloseModal() {
    this._dialogRef.close(this.taskCommentsChanged);
  }
}
